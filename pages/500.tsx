import styled from 'styled-components'

import { useRouter } from 'next/router'

// Components
import Button from '@/components/Button'
import { Logger } from '@/utils/logger'
import { Box, getPaletteColor } from '@/compound'
import { getConfig } from '@/config'

// Logger

export function Custom500() {
	const router = useRouter()

	const openRouteHandler = () => {
		Logger.info('User reached a 500 error. User redirected to /')
		getConfig().navigation.goToHomeScreen()
	}

	return (
		<Container stacked="column" align="center" justify="center">
			<Text>Something went wrong</Text>
			<Button action={openRouteHandler} text="Return home" />
		</Container>
	)
}

export default Custom500

const Container = styled(Box)`
	height: 100vh;
	max-width: 100%;
	width: 600px;
	margin: 0 auto;
`

const Text = styled.div`
	color: ${getPaletteColor('text-main')};
	margin-bottom: 32px;
	font-size: 22px;
	font-weight: 500;
`
