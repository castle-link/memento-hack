import styled from 'styled-components'
import { useRouter } from 'next/router'

// Components
import Image from 'next/image'
import { Box, getPaletteColor } from '@/compound'
import { ThemeToggler } from '../ThemeSwitch'

const Navbar = () => {
	const router = useRouter()

	return (
		<>
			<Container stacked="row" justify="space-between">
				<Box>
					<Title>MEMENTO</Title>
					<Subtitle>Mint and collect amazing media</Subtitle>
				</Box>
				<Box>
					<ThemeToggler />
				</Box>
			</Container>
		</>
	)
}

export default Navbar

// Styles
const Container = styled(Box)`
	background: ${getPaletteColor('card-bg')};
	backdrop-filter: saturate(180%) blur(23px);
	padding: 12px 40px;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 100;

	-webkit-backdrop-filter: saturate(180%) blur(20px);
`

const Title = styled.div`
	color: ${getPaletteColor('text-main')};
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	margin-bottom: 2px;
`

const Subtitle = styled.div`
	color: ${getPaletteColor('text-muted')};
	font-size: 14px;
`
