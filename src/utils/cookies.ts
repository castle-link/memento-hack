import { Logger } from '@/utils/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

type CookieFn = (name: any, value: any, options: any) => void

type NextServerFunction = (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<void>

export type NextApiResponseWithCookie<T = any> = NextApiResponse<T> & {
	cookie: CookieFn
}

type NextServerFunctionWithCookie = (
	req: NextApiRequest,
	res: NextApiResponseWithCookie
) => Promise<void>

type WithCookiesComposer = (
	handler: NextServerFunctionWithCookie
) => NextServerFunction

/**
 * This sets `cookie` on `res` object
 */
const cookie = (
	res: NextApiResponse,
	name: any,
	value: any,
	options: any = {}
) => {
	const stringValue =
		typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

	if ('maxAge' in options) {
		options.expires = new Date(Date.now() + options.maxAge)
		options.maxAge /= 1000
	}

	res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
}

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
export const withCookies: WithCookiesComposer = (handler) => (req, res) => {
	Object.assign(res, {
		cookie: ((name, value, options) => {
			cookie(res, name, value, options)
		}) as CookieFn,
	})

	return handler(req, res as NextApiResponseWithCookie)
}

export const getCookieFromDocument = (name: string) => {
	if (typeof document === 'undefined') {
		return
	}
	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)
	if (parts.length === 2) return (parts.pop() as string).split(';').shift()
}
