import { getMagicSdk } from '@/lib/magic'
import { BigNumber, providers } from 'ethers'
import { arrayify, UnsignedTransaction } from 'ethers/lib/utils'
import { MagicUserMetadata } from 'magic-sdk'
import { useCallback, useEffect, useState } from 'react'
import { Logger } from '@/utils/logger'

export const useMagic = () => {
	const [isConnecting, setIsConnecting] = useState(false)
	const [isSigning, setIsSigning] = useState(false)
	const [initializing, setInitializing] = useState(false)
	const [metadata, setMetadata] = useState<MagicUserMetadata | undefined>()

	useEffect(() => {
		getMagicSdk().preload()
	}, [])

	useEffect(() => {
		;(async () => {
			setInitializing(true)
			try {
				const isLoggedin = await getMagicSdk().user.isLoggedIn()
				if (isLoggedin) {
					await updateMetadata()
				}
			} catch (e: any) {
				Logger.logError(e)
			} finally {
				setInitializing(false)
			}
		})()
	}, [])

	const updateMetadata = useCallback(async () => {
		const metadata = await getMagicSdk().user.getMetadata()
		if (!metadata) throw new Error('Metadata not found for Magic account')
		setMetadata(metadata)
		return metadata
	}, [])

	const signMessage = useCallback(async (message: string) => {
		try {
			if (!metadata) throw new Error('User is not logged in')
			setIsSigning(true)
			const signer = getSigner()
			return await signer.signMessage(arrayify(message))
		} catch (e: any) {
			console.error('Magic:signMessage', e.message)
		} finally {
			setIsSigning(false)
		}
	}, [])

	const sendTransaction = async (tx: UnsignedTransaction) => {
		try {
			setIsSigning(true)
			if (!metadata) throw new Error('User is not logged in')
			const signer = getSigner()
			const estimatedGas = await signer.estimateGas({
				to: tx.to,
				value: tx.value || '0',
				data: tx.data || '0x',
			})
			const feeData = await signer.getFeeData()
			if (!feeData) throw new Error('Unable to get fee data')
			return await signer.sendTransaction({
				to: tx.to,
				value: tx.value || '0',
				data: tx.data || '0x',
				gasPrice: BigNumber.from(feeData.gasPrice),
				gasLimit: estimatedGas,
			})
		} catch (e: any) {
			console.error('Magic:sendTransaction', e.message)
		} finally {
			setIsSigning(false)
		}
	}

	const getSigner = useCallback(() => {
		if (!getMagicSdk().user?.isLoggedIn)
			throw new Error('User is not logged in')

		const provider = new providers.Web3Provider(
			getMagicSdk().rpcProvider as any
		)
		return provider.getSigner()
	}, [])

	const disconnectUser = useCallback(async () => {
		return new Promise((resolve) => {
			const magic = getMagicSdk()

			const req = magic.user.logout()

			req
				.on('error', (error) => {
					Logger.logError(error, 'Failed to logout of magic')
					return resolve(false)
				})
				.on('done', () => {
					Logger.info('Logged user out of magic')
					return resolve(true)
				})
		})
	}, [])

	const connectWithEmail = useCallback(async (email: string) => {
		try {
			setIsConnecting(true)
			const configuration = { email, showUI: false }
			await getMagicSdk().auth.loginWithEmailOTP(configuration)
			return updateMetadata()
		} catch (e: any) {
			console.error(e)
			throw e
		} finally {
			setIsConnecting(false)
		}
	}, [])

	return {
		isConnecting,
		isSigning,
		connectWithEmail,
		initializing,
		signMessage,
		sendTransaction,
		disconnectUser,
		metadata, // If exists, then validated
	}
}
