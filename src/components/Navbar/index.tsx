import { getConfig } from '@/config'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
	Box,
	getPaletteColor,
	Text,
	UnstyledButton,
	useBreakPoint,
	useModal,
	useOutsideClick,
	useTheme,
} from '@/compound'

// Components
import { UserButton } from './UserButton'
import { ThemeToggler } from '../ThemeSwitch'
import { useMemo, useRef } from 'react'
import { Menu } from '@styled-icons/ionicons-sharp'
import { MoonIcon } from '../ThemeSwitch/MoonIcon'
import { SunIcon } from '../ThemeSwitch/SunIcon'

const Navbar = () => {
	const router = useRouter()
	const { user, disconnectUser } = useUser()
	const { theme, getPaletteColor: _getPaletteColor, toggleTheme } = useTheme()
	const breakpoint = useBreakPoint()

	const isMobile = useMemo(
		() => ['tablet', 'mobile'].includes(breakpoint),
		[breakpoint]
	)
	const SwitchIcon = useMemo(
		() => (theme.name === 'dark' ? MoonIcon : SunIcon),
		[theme.name]
	)

	console.log({ isMobile, breakpoint })

	const {
		onModalToggle: toggleMobileMenu,
		onModalClose: closeMobileMenu,
		showModal: showMobileMenu,
	} = useModal()

	const onLogoutClick = async () => {
		closeMobileMenu()
		await disconnectUser()
		router.push('/')
	}

	const openProfileHandler = () => {
		getConfig().navigation.goToProfile()
		closeMobileMenu()
	}

	const openEditProfileHandler = () => {
		router.push('/edit-profile')
		closeMobileMenu()
	}

	const menuRef = useRef(null)

	useOutsideClick(menuRef, closeMobileMenu)

	return (
		<Container ref={menuRef}>
			<Left>
				{isMobile ? (
					<Title onClick={getConfig().navigation.goToHomeScreen}>MEMENTO</Title>
				) : (
					<Subtitle onClick={getConfig().navigation.goToHomeScreen}>
						Mint and collect <br />
						amazing media
					</Subtitle>
				)}
			</Left>
			{!isMobile && (
				<Center>
					<Title onClick={getConfig().navigation.goToHomeScreen}>MEMENTO</Title>
				</Center>
			)}
			{!isMobile && (
				<Right>
					{user && (
						<>
							<Item
								active={router.pathname.includes('/home')}
								onClick={getConfig().navigation.goToHomeScreen}
							>
								Home
							</Item>
							<Item
								active={router.pathname.includes('/mint')}
								onClick={() => router.push('/mint')}
							>
								Mint
							</Item>
							<Item
								active={router.pathname.includes('/collectors')}
								onClick={() => router.push('/collectors')}
							>
								Collectors
							</Item>
							<UserButton />
						</>
					)}
				</Right>
			)}

			{isMobile && (
				<>
					<MobileMenuButton onClick={toggleMobileMenu}>
						<Menu size={24} color={_getPaletteColor('text-muted')} />
					</MobileMenuButton>
					{showMobileMenu && (
						<MobileMenu>
							<MobileItem
								active={router.pathname.includes('/home')}
								onClick={() => {
									getConfig().navigation.goToHomeScreen()
									closeMobileMenu()
								}}
							>
								Home
							</MobileItem>
							<MobileItem
								active={router.pathname.includes('/mint')}
								onClick={() => {
									router.push('/mint')
									closeMobileMenu()
								}}
							>
								Mint
							</MobileItem>
							<MobileItem
								active={router.pathname.includes('/collectors')}
								onClick={() => {
									router.push('/collectors')
									closeMobileMenu()
								}}
							>
								Collectors
							</MobileItem>
							<MobileItem onClick={() => openProfileHandler()}>
								Profile
							</MobileItem>

							<MobileItem onClick={() => openEditProfileHandler()}>
								Edit profile
							</MobileItem>

							<MobileItem onClick={toggleTheme}>Switch Appearance</MobileItem>

							<MobileItem onClick={() => onLogoutClick()}>Log out</MobileItem>
						</MobileMenu>
					)}
				</>
			)}
		</Container>
	)
}

export default Navbar

// Styles
const Container = styled.div`
	align-items: center;
	background: ${getPaletteColor('card-bg')};
	border-bottom: 1px solid ${getPaletteColor('border-color-navbar')};
	display: flex;
	justify-content: space-between;
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
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
`

const Right = styled.div`
	align-items: center;
	display: flex;
`

const Item = styled.div<{ active?: boolean }>`
	color: ${(props) =>
		props.active
			? `${getPaletteColor('text-muted-hover')}`
			: `${getPaletteColor('text-muted')}`};
	cursor: pointer;
	font-size: 12px;
	font-weight: 500;
	margin-right: 40px;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		color: ${getPaletteColor('text-muted-hover')};
	}
`

const MobileMenuButton = styled(UnstyledButton)`
	padding: 8px;
`

const MobileMenu = styled(Box)`
	position: absolute;
	top: 64px;
	left: 0;
	width: 100%;
	background: ${getPaletteColor('card-bg')};
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid ${getPaletteColor('border-color-navbar')};
`

const MobileItem = styled(UnstyledButton)<{ active?: boolean }>`
	padding: 16px;
	text-align: center;
	font-size: 16px;
	color: ${({ active, theme }) =>
		active
			? getPaletteColor('text-main')({ theme })
			: getPaletteColor('text-muted')({ theme })};
	text-align: center;

	&:hover {
		color: ${getPaletteColor('text-main')};
	}
`
