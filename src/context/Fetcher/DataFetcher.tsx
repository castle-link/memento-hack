// React
import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'

// Redux
import { useDispatch, useSelector } from '@/redux/hooks'

import { store } from '@/redux/store'

import { ContainerProps } from '@/compound/mixins'
import { LoadingIndicator } from '@/compound/feedback'

import { getConfig } from '@/config'
import { useUser } from '@/hooks/useUser'
import { usePoller } from '@/hooks/usePoller'
import { refreshToken } from '@/lib/user'
import { selectAuthState } from '@/redux/auth'
import { fetchUserAction } from '@/redux/user/user.actions'
import { toast } from 'react-toastify'

// This component let's us fetch data needed for each page load
// It also let's us customize the criteria by which show full page loading indicator
export const DataFetcher = ({ children }: ContainerProps) => {
	const { isLoadingUser, disconnectUser } = useUser()
	const { isAuthenticated, user } = useSelector(selectAuthState)

	const dispatch = useDispatch()

	useMemo(() => {
		getConfig().configureStore(store)
	}, [])

	useEffect(() => {
		;(async () => {
			if (user?._id) {
				dispatch(fetchUserAction({ userId: user?._id }))
			}
		})()
	}, [user?._id])

	const refreshTokenCatchError = async () => {
		try {
			refreshToken()
		} catch (e: any) {
			await disconnectUser()
			toast.error('Session expired, please login again.')
		}
	}

	usePoller({
		callback: refreshTokenCatchError,
		interval: 60 * 1000 * 5,
		active: isAuthenticated,
	})

	// Add full page loading indicator rules here
	const showFullPageLoader = useMemo(() => {
		return isLoadingUser
	}, [isLoadingUser])

	return (
		<LoadingIndicator minHeight="100vh" ready={!showFullPageLoader}>
			{children}
		</LoadingIndicator>
	)
}
