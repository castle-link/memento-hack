import { setUser } from '@/redux/auth'
import { store } from '@/redux/store'
import { AuthenticateUser, RefreshToken, WalletProviderArgs } from '@/types'
import { getCookieFromDocument } from '@/utils/cookies'
import { Logger } from '@/utils/logger'
import { getConfig } from './../config/getConfig'
type CreateUserProps = {
	email?: string
	owner?: string
	id?: string
	address?: string
	type?: string
}

export let inMemoryExpiry: number | null

const updateInMemoryExpiry = (accessTokenExpiry: number | null) => {
	inMemoryExpiry = accessTokenExpiry
}

export const authenticateUser = async (props: AuthenticateUser.RequestBody) => {
	const response = await getConfig().http.post('/api/auth/connect', {
		body: props,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
		},
	})

	const { accessToken, accessTokenExpiry, user } =
		(await response.json()) as AuthenticateUser.ResponseData

	updateInMemoryExpiry(accessTokenExpiry)

	store.dispatch(
		setUser({
			user,
			accessToken,
			accessTokenExpiry,
		})
	)

	return { accessToken, accessTokenExpiry, user }
}

export async function refreshToken() {
	try {
		const shouldAttemptAuth =
			getCookieFromDocument('refreshAvailable') === 'true'

		if (!shouldAttemptAuth) {
			console.warn('refreshToken called when no refresh token available')
			return Promise.reject(
				new Error('refreshToken called when no refresh token available')
			)
		}

		console.log('refreshing token')
		const response = await getConfig().http.post('/api/auth/token', {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
			},
		})

		const { accessToken, accessTokenExpiry, user } =
			(await response.json()) as AuthenticateUser.ResponseData

		updateInMemoryExpiry(accessTokenExpiry)

		store.dispatch(
			setUser({
				user,
				accessToken,
				accessTokenExpiry,
			})
		)
		return { accessToken, accessTokenExpiry, user }
	} catch (error: any) {
		Logger.logError(error, 'Authentication failure')
		return Promise.reject(error)
	}
}
