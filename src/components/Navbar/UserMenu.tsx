import styled, { keyframes } from 'styled-components'

import { useRouter } from 'next/router'

// Redux
import { useDispatch } from 'react-redux'
import { useUser } from '@/hooks/useUser'
import { getConfig } from '@/config'
import { getPaletteColor } from '@/compound'

// Components
import { ThemeToggler } from '../ThemeSwitch'

const UserMenu = ({
	setUserMenuOpen,
}: {
	setUserMenuOpen: (a: boolean) => void
}) => {
	const router = useRouter()

	const { disconnectUser } = useUser()

	const onLogoutClick = async () => {
		setUserMenuOpen(false)
		await disconnectUser()
		router.push('/')
	}

	const openProfileHandler = () => {
		getConfig().navigation.goToProfile()
		setUserMenuOpen(false)
	}

	const openEditProfileHandler = () => {
		router.push('/edit-profile')
		setUserMenuOpen(false)
	}

	return (
		<Container>
			<Item onClick={() => openProfileHandler()}>Profile</Item>
			<Divider />
			<Item onClick={() => openEditProfileHandler()}>Edit profile</Item>
			<Divider />
			<ThemeToggler />
			<Divider />
			<Item onClick={() => onLogoutClick()}>Log out</Item>
		</Container>
	)
}

export default UserMenu

// Menu
const fadeInAnimation = keyframes`
		0% {
      opacity: 0.2;
	
		}
		100% {
	    opacity: 1;
		}
`

const Container = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color')};
	border-radius: 0px;
	top: 64px;
	box-shadow: 0px 2px 12px 2px rgba(0, 0, 0, 0.08);
	right: 16px;
	position: fixed;
	width: 180px;
	z-index: 1000;

	animation: ${fadeInAnimation} linear 0.24s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
`

const Item = styled.div`
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	align-items: center;
	display: flex;
	font-size: 14px;
	padding: 6px 8px;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		background: ${getPaletteColor('card-hover')};
		color: ${getPaletteColor('text-muted-hover')};
	}
`

const Divider = styled.div`
	background: ${getPaletteColor('border-color')};
	height: 1px;
	width: 100%;
`
