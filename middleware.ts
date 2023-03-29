import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, type JWTPayload } from 'jose'

export const AUTHENTICATED_USER_ID_HEADER = 'x-authenticated-user-id'
export interface DecodedAccessToken {
	user: {
		id: string
		name?: string
		profilePicUrl?: string
		eoa?: string
		handle?: string
		multiSig?: string
		email?: string
	}
}

// Force-redirect every HTTP request to HTTPS
function forceHTTPS(req: NextRequest) {
	if (
		process.env.NODE_ENV === 'production' &&
		req.headers.get('x-forwarded-proto') === 'http' &&
		// This check prevents us from getting trapped in HTTPS localhost if we are
		// testing a production build locally via `next build && next start`; we
		// can use `req.headers.get('host')` to get the true host (e.g.
		// 'faithdashboard.com'), whereas `req.nextUrl.host` is always
		// 'localhost:3000'
		!req.headers.get('host')?.includes('localhost')
	) {
		return NextResponse.redirect(
			`https://${req.headers.get('host')}${req.nextUrl.pathname}${
				req.nextUrl.search
			}`,
			301
		)
	}
}

// Redirect every www request to the non-www equivalent
function redirectWwwToNonWww(req: NextRequest) {
	const host = req.headers.get('host') || ''
	const wwwRegex = /^www\./
	if (wwwRegex.test(host) && !req.headers.get('host')?.includes('localhost')) {
		const newHost = host.replace(wwwRegex, '')
		return NextResponse.redirect(
			`https://${newHost}${req.nextUrl.pathname}`,
			301
		)
	}
}

async function authenticate(req: NextRequest) {
	const accessToken = req.headers.get('x-access-token')
	const headers = new Headers(req.headers)
	// Ensure that the authenticatedUserId header cannot be passed in from the client
	headers.delete(AUTHENTICATED_USER_ID_HEADER)

	if (accessToken && process.env.NEXT_PUBLIC_JWT_SECRET) {
		try {
			const { payload } = (await jwtVerify(
				accessToken,
				new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
			)) as unknown as { payload: JWTPayload & DecodedAccessToken }

			headers.set(AUTHENTICATED_USER_ID_HEADER, payload.user.id)
		} catch (e: any) {
			console.error(e)
			return new NextResponse(
				JSON.stringify({ success: false, message: 'Authentication failed' }),
				{ status: 401, headers: { 'content-type': 'application/json' } }
			)
		}
	}

	return NextResponse.next({
		request: {
			headers,
		},
	})
}

// Sequentially process an array of middleware functions (this function is to
// avoid repetition and produce cleaner code)
function processMiddlewareFunctions(
	req: NextRequest,
	middlewareFns: Function[]
) {
	for (const middlewareFn of middlewareFns) {
		const fnResponse = middlewareFn(req)
		if (fnResponse) {
			return fnResponse
		}
	}
	return NextResponse.next()
}

export function middleware(req: NextRequest) {
	return processMiddlewareFunctions(req, [
		forceHTTPS,
		redirectWwwToNonWww,
		authenticate,
	])
}
