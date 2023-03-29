import { useRouter } from 'next/router'
import React, { useMemo, ReactNode } from 'react'
import styled from 'styled-components'

// Components
import LandingNavbar from '@/components/Navbar/Landing'
import MainNavbar from '@/components/Navbar'
import { useSelector } from '@/redux/hooks'
import { selectAuthState } from '@/redux/auth'

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const { user } = useSelector(selectAuthState)

	const navbarRender = useMemo(() => {
		if (router.pathname.includes('embed')) return null
		if (router.pathname === '/') return <LandingNavbar />
		if (user) return <MainNavbar />
		return null
	}, [router, user])

	return (
		<>
			{navbarRender}
			<PageContent escapseNavbar={!!navbarRender}>{children}</PageContent>
		</>
	)
}

const PageContent = styled.div<{ escapseNavbar: boolean }>`
	${({ escapseNavbar }) => (escapseNavbar ? 'padding-top: 64px' : '')}
`
