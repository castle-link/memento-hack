import { useState, useRef } from 'react'

import styled from 'styled-components'

// Components
import UserMenu from './UserMenu'

// Hooks
import useOutsideClick from '@/hooks/useOutsideClick'

// Icons
import { Person } from '@styled-icons/ionicons-outline'
import LetterAvatar from '@/components/Avatar'
import { useUser } from '@/hooks/useUser'
import { Box, getPaletteColor } from '@/compound'
import Image from 'next/image'

export const UserButton = () => {
	const { user } = useUser()
	const [userMenuOpen, setUserMenuOpen] = useState(false)

	const userMenuRef = useRef<HTMLDivElement>(null)

	useOutsideClick(userMenuRef, () => {
		setUserMenuOpen(false)
	})

	return (
		<Container ref={userMenuRef}>
			<Box onClick={() => setUserMenuOpen(!userMenuOpen)}>
				{user?.profilePicUrl ? (
					<ProfilePic
						alt="profile picture"
						src={user?.profilePicUrl}
						width={40}
						height={40}
						priority
					/>
				) : user?.name ? (
					<LetterAvatar cursor="pointer" name={user?.name} />
				) : (
					<Avatar>
						<PersonIcon size="18" />
					</Avatar>
				)}
			</Box>

			{userMenuOpen && (
				<div>
					<UserMenu setUserMenuOpen={setUserMenuOpen} />
				</div>
			)}
		</Container>
	)
}

const Container = styled.div``

const Avatar = styled.div`
	align-items: center;
	background: ${getPaletteColor('icon-bg')};
	border-radius: 100%;
	cursor: pointer;
	display: flex;
	height: 40px;
	justify-content: center;
	width: 40px;
`

const PersonIcon = styled(Person)`
	color: ${getPaletteColor('icon-fg')};
`

const ProfilePic = styled(Image)`
	border-radius: 100%;
	cursor: pointer;
	justify-content: center;
	object-fit: cover;
`
