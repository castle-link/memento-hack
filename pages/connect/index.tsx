import styled from 'styled-components'

// Components
import PageContainer from '@/components/PageContainer'
import InputWithButton from '@/components/Input/InputWithButton'
import { ConnectLink } from '@/components/ConnectLink'
import { Text, Card, TextInput, UnstyledButton } from '@/compound'
import { useUser } from '@/hooks/useUser'

// Hooks

import { useCallback, useMemo, useState } from 'react'
import { Logger } from '@/utils/logger'
import { getConfig } from '@/config'
import { emailCheck } from '@/constants/checks'
import { toast } from 'react-toastify'
import { isNaN, toNumber } from 'lodash'

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

	console.log({ parsedOtpCode, isOtpCodeValid })

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
			const { providerMethod } = await requestToken({
				providerApplication: 'web3auth',

				providerIdentifier: formData?.email,
			})

			if (providerMethod === 'emailOtp') {
				setStep('verifyOtp')
			} else {
				setStep('verifyMagicLink')
			}
		} catch (e: any) {
			Logger.warn(e.message)
			toast.error('An error occurred', {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		}
	}, [formData?.email, isEmailValid])

	const connectWithToken = useCallback(async () => {
		if (!isOtpCodeValid) return
		try {
			await connectUser({
				providerApplication: 'web3auth',
				providerMethod: 'emailOtp',
				providerIdentifier: formData?.email,
				providerToken: parsedOtpCode,
			})

			await getConfig().navigation.goToPostLoginScreen()
		} catch (e: any) {
			console.error(e)
			Logger.warn(e.message)
			toast.error('An error occured', {
				position: toast.POSITION.BOTTOM_CENTER,
			})
		}
	}, [formData?.email, isOtpCodeValid, parsedOtpCode])

	const connectWithWalletConnect = useCallback(async () => {
		try {
			await connectUser({ providerApplication: 'walletConnect' })
			await getConfig().navigation.goToPostLoginScreen()
		} catch (e: any) {
			Logger.warn(e.message)
		}
	}, [])

	return (
		<PageContainer paddingTop="200px">
			{step === 'identify' && (
				<>
					<Text bold align="center" fontSize={32} spacing="mb2">
						Sign in or sign up
					</Text>

					<Card spacing="p4">
						<TextInput
							onChange={onChange('email')}
							suffix={
								<UnstyledButton onClick={connectWithEmail} spacing="pl2">
									<Text bold fontSize={14}>
										SEND CODE
									</Text>
								</UnstyledButton>
							}
							value={formData.email}
							placeholder="Enter your email"
						/>

						<ButtonContainer>
							<Text>Have an Ethereum wallet?</Text>
							<ConnectLink onConnect={connectWithWalletConnect} />
						</ButtonContainer>
					</Card>
				</>
			)}
			{step === 'verifyOtp' && (
				<>
					<Text bold align="center" fontSize={32} spacing="mb2">
						{"We've sent you a one time code"}
					</Text>

					<Card spacing="p4">
						<TextInput
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
						/>
					</Card>
				</>
			)}

			{step === 'verifyMagicLink' && (
				<>
					<Text bold align="center" fontSize={32} spacing="mb2">
						{"We've sent you magic link"}
					</Text>

					<Card spacing="p4">
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
					</Card>
				</>
			)}
		</PageContainer>
	)
}

export default ConnectPage

const ButtonContainer = styled.div`
	margin-top: 40px;
`
