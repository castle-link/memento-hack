import styled from 'styled-components'

// Components

import { ConnectLink } from '@/components/ConnectLink'
import { Box, Text, TextInput, UnstyledButton } from '@/compound'
import { useUser } from '@/hooks/useUser'

// Hooks

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Logger } from '@/utils/logger'
import { getConfig } from '@/config'
import { emailCheck } from '@/constants/checks'
import { toast } from 'react-toastify'
import { isEqual, isNaN, toNumber } from 'lodash'
import { useSelector } from 'react-redux'
import { selectAuthState, selectIsAuthenticated } from '@/redux/auth'

// Utils
import { getPaletteColor } from '@/compound/themes/utils'
import { SpinningIndicator } from '../SpinningIndicator'
import { FEATURE_CONFIG } from '@/lib/features'
import Button from '../Button'

interface LoginForm {
	email: string
	otpCode: string
}

const ConnectPage = () => {
	const [formData, setFormData] = useState<LoginForm>({
		email: '',
		otpCode: '',
	})
	const [step, setStep] = useState<
		'identify' | 'verifyOtp' | 'verifyMagicLink'
	>('identify')

	const [isConnecting, setIsConnecting] = useState(false)

	const parsedOtpCode = useMemo(() => {
		return formData.otpCode.replaceAll(/[^0-9]/g, '')
	}, [formData.otpCode])

	const { isEmailValid, isOtpCodeValid } = useMemo(() => {
		return {
			isEmailValid: !!formData.email.match(emailCheck),
			isOtpCodeValid:
				parsedOtpCode.length === 6 && !isNaN(toNumber(parsedOtpCode)),
		}
	}, [formData, parsedOtpCode])

	const onChange = (field: keyof LoginForm) => (input: string) => {
		if (field === 'email') {
			setFormData((old) => ({
				...old,
				email: input,
			}))
		} else if (field === 'otpCode') {
			setFormData((old) => ({
				...old,
				otpCode: input.replaceAll(/[^0-9\s]/g, ''),
			}))
		}
	}

	const { connectUser, requestToken } = useUser()

	const connectWithEmail = useCallback(async () => {
		if (!isEmailValid) return

		try {
			if (FEATURE_CONFIG.safeAuthSdk) {
				await connectUser({
					providerApplication: 'safeAuthKit',
					providerIdentifier: formData?.email,
				})
				console.log('connected')
				await getConfig().navigation.goToPostLoginScreen()
			} else {
				setIsConnecting(true)
				const { providerMethod } = await requestToken({
					providerApplication: 'web3auth',
					providerIdentifier: formData?.email,
				})
				if (providerMethod === 'emailOtp') {
					setStep('verifyOtp')
				} else {
					setStep('verifyMagicLink')
				}
			}
		} catch (e: any) {
			console.error(e)
			Logger.warn(e.message)
			toast.error('Error connecting to wallet', {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		} finally {
			setIsConnecting(false)
		}
	}, [formData?.email, isEmailValid, requestToken, connectUser])

	const connectWithToken = useCallback(async () => {
		if (!isOtpCodeValid) return
		try {
			setIsConnecting(true)
			await connectUser({
				providerApplication: 'web3auth',
				providerIdentifier: formData?.email,
				providerToken: parsedOtpCode,
				providerMethod: 'emailOtp',
			})

			await getConfig().navigation.goToPostLoginScreen()
		} catch (e: any) {
			console.error(e)
			Logger.warn(e.message)
			toast.error('An error occurred', {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		} finally {
			setIsConnecting(false)
		}
	}, [formData?.email, isOtpCodeValid, parsedOtpCode, connectUser])

	const connectWithWalletConnect = useCallback(async () => {
		try {
			await connectUser({ providerApplication: 'walletConnect' })
			await getConfig().navigation.goToPostLoginScreen()
		} catch (e: any) {
			Logger.warn(e.message)
		}
	}, [])

	return (
		<>
			{step === 'identify' && (
				<>
					<Card>
						<Text bold spacing="mb2" fontSize={20}>
							Log in or sign up
						</Text>

						<TextInput
							onChange={onChange('email')}
							suffix={
								isConnecting ? (
									<Box stacked="row" align="center">
										<SpinningIndicator />
									</Box>
								) : (
									<UnstyledButton onClick={connectWithEmail} spacing="pl2">
										<Text bold fontSize={14}>
											CONTINUE
										</Text>
									</UnstyledButton>
								)
							}
							value={formData.email}
							placeholder="Enter your email"
						/>

						<ButtonContainer>
							<ConnectLinkContainer>
								<ConnectLink onConnect={connectWithWalletConnect} />
							</ConnectLinkContainer>
						</ButtonContainer>
					</Card>
				</>
			)}
			{step === 'verifyOtp' && (
				<>
					<Card>
						<Text>{"We've emailed you a code to log in"}</Text>
						<Text fontColor="text-muted">Check your email for code</Text>
					</Card>

					<TextInput
						onChange={onChange('otpCode')}
						suffix={
							isConnecting ? (
								<Box stacked="row" align="center">
									<SpinningIndicator />
								</Box>
							) : (
								<UnstyledButton onClick={connectWithToken} spacing="pl2">
									<Text bold fontSize={14}>
										VERIFY CODE
									</Text>
								</UnstyledButton>
							)
						}
						value={formData.otpCode}
						placeholder="Enter code"
					/>
				</>
			)}
			{step === 'verifyMagicLink' && (
				<>
					<Card>
						<Text fontSize={22} bold spacing="mb1">
							{'Check your email'}
						</Text>
						<Text fontColor="text-muted" fontSize={16} medium>
							{`We've sent an email with a link that you can use to sign in.`}
						</Text>
					</Card>

					{/* <TextInput
							onChange={onChange('otpCode')}
							suffix={
								<UnstyledButton onClick={connectWithToken} spacing="pl2">
									<Text bold fontSize={14}>
										VERIFY
									</Text>
								</UnstyledButton>
							}
							value={formData.otpCode}
							placeholder="Enter code"
						/> */}
				</>
			)}
		</>
	)
}

export default ConnectPage

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-top: 40px;
`

const ConnectLinkContainer = styled.div`
	display: inline-block;
`

const Card = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	display: flex;
	flex-direction: column;
	margin-bottom: 24px;
	padding: 24px;
`
