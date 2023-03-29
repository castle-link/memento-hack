import styled from 'styled-components'

import { useRouter } from 'next/router'

// Components
import Button from '@/components/Button'
import { Logger } from '@/utils/logger'
import { Box, getPaletteColor } from '@/compound'
import { getConfig } from '@/config'

// Logger

export function Custom404() {
	const router = useRouter()

	const openRouteHandler = () => {
		Logger.info('User reached a 404 error. User redirected to /404')
		getConfig().navigation.goToHomeScreen()
	}

	return (
		<Container stacked="column" align="center" justify="center">
			<Text>Page not found</Text>
			<Button action={openRouteHandler} text="Return home" />
		</Container>
	)
}

export default Custom404

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
