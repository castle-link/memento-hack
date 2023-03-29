import styled from 'styled-components'
import Image from 'next/image'
import { getPaletteColor } from '@/compound/themes/utils'
import { Box, useBreakPoint } from '@/compound'
import { ThemeToggler } from '../ThemeSwitch'
import { useMemo } from 'react'

const Navbar = () => {
	const breakpoint = useBreakPoint()

	const isMobile = useMemo(
		() => ['tablet', 'mobile'].includes(breakpoint),
		[breakpoint]
	)

	return (
		<Container stacked="row" justify={'space-between'}>
			{!isMobile && (
				<Left>
					<Subtitle>
						Mint and collect <br />
						amazing media
					</Subtitle>
				</Left>
			)}
			<Center>
				<Title>MEMENTO</Title>
			</Center>
			<Box></Box>
		</Container>
	)
}

export default Navbar

// Styles
const Container = styled(Box)`
	align-items: center;
	background: ${getPaletteColor('card-bg')};
	border-bottom: 1px solid ${getPaletteColor('border-color-navbar')};
	display: flex;
	height: 64px;
	padding: 0px 16px;
	position: fixed;
	width: 100%;
	z-index: 100;
	top: 0;
`

const Left = styled.div``

const Center = styled.div`
	position: absolute;
	left: 50%;
	transform: translate(-50%, -0%);
`

const Title = styled.div`
	color: ${getPaletteColor('text-main')};
	cursor: pointer;
	font-size: 20px;
	font-weight: 600;
`

const Subtitle = styled.div`
	color: ${getPaletteColor('text-muted')};
	font-size: 13px;
	font-weight: 500;
`
