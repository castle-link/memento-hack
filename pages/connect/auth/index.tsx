import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

// Components
import Button from '@/components/Button'
import { Box, getPaletteColor, LoadingIndicator } from '@/compound'
import { getConfig } from '@/config'
import { CheckmarkCircle, CloseCircle } from '@styled-icons/ionicons-solid'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'

// Jwt Decode
import jwtDecode from 'jwt-decode'

// Logger
import { Logger } from '@/utils/logger'

interface DecodedToken {
	exp: number
	iat: number
	iss: string
	sub: string
}

export function ConnectAuthPage() {
	const router = useRouter()
	const { connectUser } = useUser()
	const { token, providerIdentifier } = router.query
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const hasAuth = useRef(false)

	useEffect(() => {
		;(async () => {
			if (token && providerIdentifier && hasAuth.current === false) {
				try {
					setError(null)
					setLoading(true)
					hasAuth.current = true
					const { exp } = jwtDecode(token as string) as DecodedToken

					if (exp < Date.now() / 1000) {
						throw new Error('Token expired')
					}

					await connectUser({
						providerApplication: 'web3auth',
						providerIdentifier: providerIdentifier as string,
						providerToken: token as string,
						providerMethod: 'emailMagicLink',
					})

					await getConfig().navigation.goToDashboard()
				} catch (e: any) {
					Logger.logError(e)
					console.log('I am here')
					setError('Invalid token, please try again.')
				} finally {
					setLoading(false)
				}
			} else {
				if (!token || !providerIdentifier) {
					console.log('Actually i am heres')
					Logger.logError('Token and / or providerIdentifier is invalid.')
					setError('Invalid token, please try again.')
				}
			}
		})()
	}, [token, providerIdentifier, connectUser])

	const openRouteHandler = () => {
		getConfig().navigation.goToHomeScreen()
	}

	return (
		<LoadingIndicator minHeight="100vh" ready={!loading}>
			<Container stacked="column" align="center" justify="center">
				{error ? (
					<>
						<Box spacing="mb4" stacked="row" align="center" gap="8px">
							<Text>Invalid token, please request a new magic link.</Text>
							<CloseCircle size={24} color="var(--danger-color)" />
						</Box>
						<Button action={openRouteHandler} text="Return home" />
					</>
				) : (
					<Box spacing="mb4" stacked="row" align="center" gap="8px">
						<Text>Login successful, you may close this page.</Text>
						<CheckmarkCircle size={24} color="var(--success-color)" />
					</Box>
				)}
			</Container>
		</LoadingIndicator>
	)
}

export default ConnectAuthPage

const Container = styled(Box)`
	height: 100vh;
	max-width: 100%;
	width: 600px;
	margin: 0 auto;
`

const Text = styled.div`
	color: ${getPaletteColor('text-main')};

	font-size: 22px;
	font-weight: 500;
`
