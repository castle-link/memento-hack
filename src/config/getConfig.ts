import { HttpError, NotFound } from '@/lib/errors'
import { EnhancedStore } from '@reduxjs/toolkit'
import Router from 'next/router'
import { getCookieFromDocument } from '@/utils/cookies'
import { refreshToken } from '@/lib/user'
import { Logger } from '@/utils/logger'
import { selectAuthState } from '@/redux/auth/auth.selectors'
import { RootState } from '@/redux/store'
import { PopulatedMemento } from '@/models/Memento'

interface HttpOptions<RequestBody> {
	headers?: {
		[name: string]: string
	}
	credentials?: 'omit' | 'same-origin' | 'include'
	body?: RequestBody
}

export type RequestMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'

const makeRequest = async <RequestBody = undefined>(
	method: RequestMethod,
	url: string,
	options?: HttpOptions<RequestBody> | null
): Promise<Response> => {
	const bodyPayload =
		['PUT', 'PATCH', 'POST', 'DELETE'].includes(method) && options?.body
			? { body: JSON.stringify(options.body) }
			: {}

	const settings = {
		method,
		...(options?.credentials ? { credentials: options?.credentials } : {}),
		headers: {
			...options?.headers,
		},
		...bodyPayload,
	}

	const response = await fetch(url, settings)

	if (!response.ok && !response.redirected) throw new HttpError(response)

	return response
}

class Config {
	store: Maybe<EnhancedStore<any>> = null

	get joinCodes() {
		return process.env.NEXT_PUBLIC_GROUP_CREATION
			? process.env.NEXT_PUBLIC_GROUP_CREATION.replace(/\s/g, '').split(',')
			: []
	}

	get http() {
		return {
			get: (url: string, options?: HttpOptions<undefined>) =>
				makeRequest<undefined>('GET', url, options),
			put: <RequestBody = any>(
				url: string,
				options?: HttpOptions<RequestBody>
			) => makeRequest<RequestBody>('PUT', url, options),
			post: <RequestBody = any>(
				url: string,
				options?: HttpOptions<RequestBody>
			) => makeRequest<RequestBody>('POST', url, options),
			patch: <RequestBody = any>(
				url: string,
				options?: HttpOptions<RequestBody>
			) => makeRequest<RequestBody>('PATCH', url, options),
			delete: <RequestBody = any>(
				url: string,
				options?: HttpOptions<RequestBody>
			) => makeRequest<RequestBody>('DELETE', url, options),
		}
	}
	get api() {
		return {
			get: <ResponseType = any>(
				path: string,
				apiOptions?: HttpOptions<undefined>
			) => this.makeApiRequest<ResponseType>('GET', path, apiOptions),
			put: <ResponseType = any, RequestBody = any>(
				path: string,
				apiOptions?: HttpOptions<RequestBody>
			) =>
				this.makeApiRequest<ResponseType, RequestBody>('PUT', path, apiOptions),
			post: <ResponseType = any, RequestBody = any>(
				path: string,
				apiOptions?: HttpOptions<RequestBody>
			) =>
				this.makeApiRequest<ResponseType, RequestBody>(
					'POST',
					path,
					apiOptions
				),
			patch: <ResponseType = any, RequestBody = any>(
				path: string,
				apiOptions?: HttpOptions<RequestBody>
			) =>
				this.makeApiRequest<ResponseType, RequestBody>(
					'PATCH',
					path,
					apiOptions
				),
			delete: <ResponseType = any, RequestBody = any>(
				path: string,
				apiOptions?: HttpOptions<RequestBody>
			) =>
				this.makeApiRequest<ResponseType, RequestBody>(
					'DELETE',
					path,
					apiOptions
				),
		}
	}

	private get state() {
		return this.store?.getState() as RootState
	}

	get currentUser() {
		return this.state.auth.user
	}

	get isAuthenticated() {
		const state = this.store?.getState()

		if (!state) return false

		const { isAuthenticated } = selectAuthState(state)

		return isAuthenticated
	}

	get navigation() {
		return {
			goToDashboard: () => {
				if (!this.isAuthenticated && !this.state)
					return this.navigation.goToNearestPublicScreen()

				return Router.push(`/home`)
			},
			goToProfile: () => {
				const userId = this.currentUser?.handle || this.currentUser?._id

				if (!userId) return Router.push('/')
				return Router.push(`/${userId}`)
			},

			goToNearestPublicScreen: () => {
				console.log('going to nearest public screen for', Router.pathname)
				if (Router.pathname === '/') return
				if (Router.pathname === '/connect') return
				if (Router.pathname === '/connect/auth') return
				if (Router.pathname === '/[userIdOrHandle]/[mementoId]') return
				if (Router.pathname === '/[userIdOrHandle]/[mementoId]/claims') return
				if (Router.pathname === '/[userIdOrHandle]') return
				if (Router.pathname === '/share/[mementoId]') return
				if (Router.pathname === '/[userIdOrHandle]/[mementoId]/embed') return
				if (Router.pathname === '/[userIdOrHandle]/[mementoId]/test-embed')
					return

				return Router.push('/')
			},
			goToCollection: (memento: PopulatedMemento) => {
				return Router.push(this.navigation.getCollectionRoute(memento))
			},
			getCollectionRoute: (
				memento: PopulatedMemento,
				{ withBaseUrl = false }: { withBaseUrl?: boolean } | undefined = {}
			) => {
				const userHandle = (memento?.user?.handle ||
					memento?.user?._id) as string

				const path = `/${userHandle}/${memento.slug}`
				if (withBaseUrl) {
					return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
				} else {
					return path
				}
			},
			getEmbedUrl: (memento: PopulatedMemento) => {
				return `${this.navigation.getCollectionRoute(memento, {
					withBaseUrl: true,
				})}/embed`
			},
			goToHomeScreen: () => {
				if (!this.isAuthenticated) return Router.push('/')

				return Router.push(`/home`)
			},
			goToPostLoginScreen: async ({
				onboard = true,
				redirectTo,
			}: { onboard?: boolean; redirectTo?: string } = {}) => {
				if (!this.isAuthenticated && !this.state)
					return this.navigation.goToNearestPublicScreen()

				const user = (this.state as RootState)?.auth?.user

				if (redirectTo) {
					return Router.push(redirectTo)
				}

				if (onboard) {
					if (!user?.name || !user?.bio) {
						return Router.push('/edit-profile')
					}

					if (!user?.handle) {
						return Router.push('/choose-handle')
					}
				}

				return this.navigation.goToDashboard()
			},
		}
	}

	configureStore(store: EnhancedStore<any>) {
		this.store = store
	}

	private makeApiRequest = async <ResponseType, RequestBody = undefined>(
		method: RequestMethod,
		path: string,
		apiOptions?: HttpOptions<RequestBody> | null
	): Promise<ResponseType> => {
		const bodyPayload =
			['PUT', 'PATCH', 'POST', 'DELETE'].includes(method) && apiOptions?.body
				? { body: JSON.stringify(apiOptions.body) }
				: {}

		let accessToken = this.store?.getState()?.auth?.accessToken
		const accessTokenExpiry = this.store?.getState()?.auth?.accessTokenExpiry

		const refreshTokenAvailable =
			getCookieFromDocument('refreshAvailable') === 'true'
		const accessTokenValid =
			accessToken &&
			accessTokenExpiry &&
			new Date().getTime() < accessTokenExpiry

		console.log({ accessTokenValid })

		let authPayload: Record<string, string> | undefined = undefined

		if (accessTokenValid) {
			authPayload = { 'X-ACCESS-TOKEN': accessToken }
		} else if (refreshTokenAvailable) {
			console.warn(
				'Request initiated with expired access token. Fetching new access token before request'
			)
			if (!this.store?.dispatch) throw 'Request made before store configured'

			try {
				const {
					accessToken: newAccessToken,
					accessTokenExpiry: newAccessTokenExpiry,
				} = await refreshToken()

				accessToken = newAccessToken
				authPayload = newAccessToken
					? { 'X-ACCESS-TOKEN': accessToken }
					: undefined
			} catch (e: any) {
				Logger.logError(
					e,
					'An error occured while prefetching new access token'
				)
			}
		}

		const headers =
			apiOptions?.headers instanceof Headers
				? apiOptions?.headers
				: new Headers()

		const headersObject: Record<string, string> = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...authPayload,
			...(!(apiOptions?.headers instanceof Headers)
				? { ...apiOptions?.headers }
				: {}),
		}
		Object.keys(headersObject).forEach((key) => {
			headers.append(key, headersObject[key])
		})

		const settings = {
			method,
			headers,
			...bodyPayload,
		}

		const response = await fetch(path, settings)

		if (!response.ok && !response.redirected) throw new HttpError(response)
		if (response.ok && !response.redirected) {
			console.log('Response ok', { response })
			return response.json()
		} else {
			console.log('Response redirected', { response })
			return response as ResponseType
		}
	}
}

const configSingleton = new Config()
export const getConfig = () => configSingleton
