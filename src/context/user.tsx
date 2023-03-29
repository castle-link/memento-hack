import { useAccount, useDisconnect, useProvider } from 'wagmi'
import { authenticateUser, refreshToken } from '@/lib/user'
import { Magic } from 'magic-sdk'
import { validateEmail } from '@/utils/validateEmail'
import React, {
	useState,
	ReactNode,
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { useRouter } from 'next/router'
import { TUser } from '@/models/User'
import { BigNumber, ethers } from 'ethers'
import { useMagic } from '@/hooks/useMagic'
import { getMagicSdk } from '@/lib/magic'
import { useWeb3Modal } from '@web3modal/react'
import { ModalCtrl, ClientCtrl } from '@web3modal/core'

import { arrayify, UnsignedTransaction } from 'ethers/lib/utils.js'
import { RequestOtpCode, VerifyOtpCode, WalletProviderArgs } from '@/types'
import { Logger } from '@/utils/logger'
import { useDispatch, useSelector } from '@/redux/hooks'
import { selectAuthState } from '@/redux/auth'
import { getCookieFromDocument } from '@/utils/cookies'
import { getConfig } from '@/config'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { disconnect as disconnectWagmi } from '@wagmi/core'
import { logoutAction } from '@/redux/auth/auth.actions'
import { Web3AuthClient } from '@/lib/web3auth'
import { fetchUserAction } from '@/redux/user/user.actions'
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import UAParser from 'ua-parser-js'
import { getSafeAuthKit } from '@/lib/safeAuthKit'
import { useTheme } from '@/compound'

interface UserContextInterface {
	user?: Maybe<TUser>
	magic?: Magic
	collections?: any[]
	collected?: any[]
	collectors?: any[]
	updateCollections: (collections: any) => void
	updateCollected: (collected: any) => void
	updateCollectors: (collectors: any) => void
	handleExportCollectorEmails: () => void
	isLoadingUser: boolean
	isExporting: boolean
	connectUser: (connectUserArgs: WalletProviderArgs) => Promise<TUser>
	requestToken: (
		requestTokenArgs: Pick<
			WalletProviderArgs,
			'providerIdentifier' | 'providerApplication' | 'providerMethod'
		>
	) => Promise<RequestOtpCode.ResponseData>
	disconnectUser: () => Promise<void>
	sendTransaction: (
		tx: UnsignedTransaction
	) => Promise<TransactionResponse | undefined>
	signMessage: (message: string) => Promise<string>
}

export const UserContext = createContext<UserContextInterface | null>(null)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
	const {
		connectWithEmail,
		metadata,
		disconnectUser: disconnectMagicUser,
	} = useMagic()

	const { open: openWalletConnectModal } = useWeb3Modal()
	const dispatch = useDispatch()

	const { user, accessToken, isAuthenticated, accessTokenExpiry } =
		useSelector(selectAuthState)

	const { theme } = useTheme()
	const [collections, setCollections] = useState<any[] | undefined>()
	const [collected, setCollected] = useState<any[] | undefined>()
	const [collectors, setCollectors] = useState<any[] | undefined>()
	const [isLoadingUser, setIsLoadingUser] = useState(true)
	const [isSigning, setIsSigning] = useState(false)
	const [isExporting, setIsExporting] = useState(false)
	const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>()
	const router = useRouter()

	const updateCollections = useCallback((_collections: any[] | undefined) => {
		setCollections(_collections)
	}, [])

	const updateCollected = useCallback((_collected: any[] | undefined) => {
		setCollected(_collected)
	}, [])

	const updateCollectors = useCallback((_collectors: any[] | undefined) => {
		setCollectors(_collectors)
	}, [])

	const {
		address: walletConnectAddress,
		connector: walletConnectConnector,
		isConnected: walletConnectConnected,
	} = useAccount()
	const { disconnect: disconnectWalletConnectUser } = useDisconnect()

	const initialAuthenticationPerformed = useRef(false)

	useEffect(() => {
		if (initialAuthenticationPerformed.current) {
			console.log('initial authentication already performed. skipping')
			setIsLoadingUser(false)
			return
		}

		initialAuthenticationPerformed.current = true
		console.log('performing initial authentication')
		const refreshAvailable =
			getCookieFromDocument('refreshAvailable') === 'true'
		const isAuthed =
			accessTokenExpiry && accessTokenExpiry < Date.now() && !isAuthenticated

		;(async () => {
			if (isAuthed) {
				console.log('user already authed, skipping initial auth')
				setIsLoadingUser(false)
				return
			}
			if (!refreshAvailable) {
				console.log('refresh token not detected. Disconnecting user')

				disconnectUser()
				await getConfig().navigation.goToNearestPublicScreen()
				setIsLoadingUser(false)
				return
			}

			let isConnectedToWallet = false
			try {
				// fetch user from session
				const { user: cachedUser } = await refreshToken()

				if (cachedUser?.email) {
					const isLoggedIn = await getMagicSdk().user.isLoggedIn()
					if (isLoggedIn) {
						const metadata = await getMagicSdk().user.getMetadata()

						isConnectedToWallet =
							metadata.email?.toLowerCase() === cachedUser.email
					}
				} else {
					if (walletConnectAddress) {
						isConnectedToWallet =
							walletConnectAddress.toLowerCase() ===
							cachedUser.eoa.toLowerCase()
					}
				}

				// TODO: This next block allow us to ensure that a user has a provider
				// If them don't we direct them to sign in again
				// We've disabled this for not since we need to fice the race condition
				// where this code runs before the provider is fully set up

				// if (!isConnectedToWallet)
				// 	throw new Error('Not connected to user wallet')

				if (['/', '/connect'].includes(router.pathname)) {
					getConfig().navigation.goToHomeScreen()
				}
			} catch (e) {
				Logger.error('Error loading data during initialization')
				disconnectUser()
				await getConfig().navigation.goToNearestPublicScreen()
			} finally {
				setIsLoadingUser(false)
			}
		})()
	}, [])

	const handleExportCollectorEmails = async () => {
		try {
			setIsExporting(true)
			if (user) {
				const url = `/api/export/collectors/${user.email || user.eoa}`
				const settings = {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
				const res = await fetch(url, settings)
				const { emails } = await res.json()
				const emailsForCsv = emails.map((email: string) => [email])
				const rows = [['email']].concat(emailsForCsv)
				const csvContent =
					'data:text/csv;charset=utf-8,' +
					rows.map((e) => e.join(',')).join('\n')
				const encodedUri = encodeURI(csvContent)
				window.open(encodedUri)
			}
		} catch (e: any) {
			console.error(e)
		} finally {
			setIsExporting(false)
		}
	}

	const disconnectUser = useCallback(async () => {
		try {
			await disconnectMagicUser()
			await disconnectWalletConnectUser()
			await disconnectWagmi()
			getSafeAuthKit()
				.then((authKit) => authKit.signOut())
				.catch(() => {
					console.log('error signing out of authkit')
				})

			dispatch(logoutAction()).unwrap()
			updateCollections(undefined)
			updateCollected(undefined)
		} catch (e: any) {
			console.error('Yo', e)
			toast.error('Error disconnecting user', {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		}
	}, [
		disconnectWalletConnectUser,
		disconnectMagicUser,
		dispatch,
		updateCollected,
		updateCollections,
	])

	const requestToken: UserContextInterface['requestToken'] = useCallback(
		async ({ providerIdentifier, providerApplication, providerMethod }) => {
			if (!providerIdentifier) throw new Error('Please provide an email')

			const parser = new UAParser('user-agent')

			const ua = parser.getResult()
			const browserName = ua.browser.name
			const osName = ua.os.name

			const deviceName =
				osName && browserName
					? `${browserName}, ${osName}`
					: osName || browserName
					? ((osName || browserName) as string)
					: 'an unidentified device'

			return getConfig().api.post<
				RequestOtpCode.ResponseData,
				RequestOtpCode.RequestBody
			>('/api/auth/request', {
				body: {
					providerApplication,
					providerIdentifier,
					providerMethod,
					deviceName,
					timeZone: moment.tz.guess(),
				},
			})
		},
		[]
	)

	const connectUser = async ({
		providerApplication,
		providerIdentifier,
		providerMethod,
		providerToken,
	}: WalletProviderArgs) => {
		Logger.info('clearing cached providers for provider specific reconnection')
		await disconnectMagicUser()
		await disconnectWalletConnectUser()
		await disconnectWagmi()
		await Web3AuthClient.disconnect()

		let signedMessage: string | undefined = undefined
		let address: string | undefined | null = undefined
		let rpcProvider: ethers.providers.ExternalProvider | undefined | null =
			undefined

		if (providerApplication === 'safeAuthKit') {
			if (!providerIdentifier) throw new Error('Please provide an email')
			const safeAuthKit = await getSafeAuthKit(theme.name)

			setTimeout(() => {
				const inputElement = document.querySelector(
					'section#w3a-container input[name=passwordless-input]'
				) as HTMLInputElement | null

				if (inputElement) {
					const inputValue = providerIdentifier
					const inputPropsKey = Object.keys(inputElement).find((key) =>
						key.startsWith('__reactProps')
					)

					if (inputPropsKey) {
						inputElement.value = inputValue
						;(inputElement as any)?.[inputPropsKey]?.onChange({
							target: { value: inputValue },
						})

						setTimeout(() => {
							const formElement = document.querySelector(
								'form.w3ajs-passwordless-form'
							) as HTMLElement

							if (formElement) {
								const formPropsKey = Object.keys(formElement).find((key) =>
									key.startsWith('__reactProps')
								)

								if (formPropsKey) {
									const formProps = (formElement as any)?.[formPropsKey]

									console.log({ formProps, onSubmit: formProps?.onSubmit })
									const submitEvent = new Event('submit')
									formProps?.onSubmit?.(submitEvent)
								}
							}
						}, 100)
					}
				}
			}, 500)
			const { eoa } = await safeAuthKit.signIn()
			address = eoa
			rpcProvider = await safeAuthKit.getProvider()
		} else if (providerApplication === 'web3auth') {
			if (providerMethod === 'emailMagicLink') {
				if (!providerIdentifier || !providerToken)
					throw new Error('Please provide an email and token')
				const connectionResponse = await Web3AuthClient.connectWithToken(
					providerToken,
					providerIdentifier
				)

				console.log('connectionResponse', connectionResponse)
				rpcProvider = Web3AuthClient.authenticator
					.provider as ethers.providers.ExternalProvider
				address = connectionResponse.address
			} else {
				if (!providerIdentifier || !providerMethod)
					throw new Error('Please provide an email')

				if (!providerToken) throw new Error('Please provide an OTP code')

				const { connectionToken } = await getConfig().api.post<
					VerifyOtpCode.ResponseData,
					VerifyOtpCode.RequestBody
				>('/api/auth/verify', {
					body: {
						providerToken,
						providerApplication,
						providerIdentifier,
						providerMethod,
					},
				})

				const connectionResponse = await Web3AuthClient.connectWithToken(
					connectionToken,
					providerIdentifier
				)

				console.log('connectionResponse', connectionResponse)
				rpcProvider = Web3AuthClient.authenticator
					.provider as ethers.providers.ExternalProvider
				address = connectionResponse.address
			}
		} else if (providerApplication === 'magic') {
			if (!providerIdentifier) throw new Error('Please provide an email')
			if (validateEmail(providerIdentifier)) {
				const { publicAddress } = await connectWithEmail(providerIdentifier)
				if (publicAddress) {
					address = publicAddress
					rpcProvider = getMagicSdk()
						.rpcProvider as unknown as ethers.providers.ExternalProvider
				} else {
					throw new Error('No public address found')
				}
			}
		} else if (providerApplication === 'walletConnect') {
			if (walletConnectAddress && walletConnectConnector) {
				address = walletConnectAddress
				rpcProvider = await walletConnectConnector.getProvider()
			} else {
				await new Promise((resolve) => {
					ModalCtrl.subscribe((modalState) => {
						if (!modalState.open) resolve('Modal closed')
					})
					openWalletConnectModal()
				})

				const account = ClientCtrl.client().getAccount()
				address = account.address
				rpcProvider = await account.connector?.getProvider()

				if (!address || !rpcProvider) {
					throw new Error('Failed to connect to WalletConnect')
				}
			}
		}

		console.log({ address, rpcProvider })
		if (!rpcProvider || !address) throw new Error('No provider found')
		const provider = new ethers.providers.Web3Provider(rpcProvider)

		setProvider(provider)

		const signer = provider.getSigner()
		signedMessage = await signer.signMessage('Connect to Memento')

		const { user } = await authenticateUser({
			address,
			signedMessage,
			providerApplication,
			providerIdentifier,
			providerMethod,
		})

		return user
	}

	const signMessage = useCallback(
		async (message: string) => {
			try {
				if (!provider) throw new Error('User is not logged in')
				setIsSigning(true)
				const signer = provider.getSigner()
				return await signer.signMessage(arrayify(message))
			} catch (e: any) {
				console.error('Magic:signMessage', e.message)
				throw e
			} finally {
				setIsSigning(false)
			}
		},
		[provider]
	)

	const sendTransaction = async (tx: UnsignedTransaction) => {
		try {
			setIsSigning(true)
			if (!provider) throw new Error('User is not logged in')
			setIsSigning(true)
			const signer = provider.getSigner()
			const estimatedGas = await signer.estimateGas({
				to: tx.to,
				value: tx.value || '0',
				data: tx.data || '0x',
			})
			const feeData = await signer.getFeeData()
			if (!feeData) throw new Error('Unable to get fee data')
			return signer.sendTransaction({
				to: tx.to,
				value: tx.value || '0',
				data: tx.data || '0x',
				gasPrice: BigNumber.from(feeData.gasPrice),
				gasLimit: estimatedGas,
			})
		} catch (e: any) {
			console.error('sendTransaction', e.message)
		} finally {
			setIsSigning(false)
		}
	}

	return (
		<UserContext.Provider
			value={{
				user,
				collections,
				updateCollections,
				collected,
				updateCollected,
				collectors,
				isLoadingUser,
				updateCollectors,
				handleExportCollectorEmails,
				isExporting,
				connectUser,
				disconnectUser,
				signMessage,
				sendTransaction,
				requestToken,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
