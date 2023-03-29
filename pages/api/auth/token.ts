import { NextApiRequest, NextApiResponse } from 'next'
// Models
import { Token } from '@/models/Token'
import { User } from '@/models/User'

// Utils
import Cookies from 'cookies'
import { REFRESH_TOKEN_EXPIRY_MINUTES } from '@/models/User/user.constants'
import connectDatabase from '@/utils/connectDatabase'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	await connectDatabase()
	const cookies = new Cookies(req, res)

	switch (method) {
		case 'POST':
			try {
				const refreshToken = req.cookies['refreshToken']
				if (!refreshToken) {
					return res
						.status(400)
						.json({ error: 'Error finding token passed in' })
				}
				let tokenDoc = await Token.findOne({
					refreshToken,
				})
				if (!tokenDoc) {
					cookies.set('refreshToken')
					cookies.set('refreshAvailable')

					return res.status(401).json({
						error: 'Token expired / not found',
					})
				}

				const user = await User.findById(tokenDoc.userId.toString())

				if (!user) {
					cookies.set('refreshToken')
					cookies.set('refreshAvailable')
					return res.status(400).json({
						error: 'Invalid token',
					})
				}

				const { accessToken, accessTokenExpiry } =
					await user.createAccessToken()
				const { refreshToken: newRefreshtoken } =
					await user.createRefreshToken()
				await Token.deleteOne({
					refreshToken,
				})

				cookies.set('refreshToken', newRefreshtoken, {
					maxAge: REFRESH_TOKEN_EXPIRY_MINUTES * 60 * 1000, // convert from minute to milliseconds
					httpOnly: true,
					path: '/',
					secure: false,
				})

				cookies.set('refreshAvailable', 'true', {
					maxAge: REFRESH_TOKEN_EXPIRY_MINUTES * 60 * 1000,
					httpOnly: false,
					path: '/',
					secure: false,
				})

				return res.status(200).json({
					user: user.toJSON(),
					accessToken,
					accessTokenExpiry,
				})
			} catch (error) {
				return res.status(400).json({ error: 'Error creating refresh token' })
			}
		default:
			return res.status(405).send('Method not allowed')
	}
}
