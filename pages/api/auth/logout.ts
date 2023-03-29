import { connectDatabase } from '@/utils/connectDatabase'
import { NextApiRequest, NextApiResponse } from 'next'
import { Token } from '@/models/Token'
import Cookies from 'cookies'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectDatabase()

	const { method } = req

	switch (method) {
		case 'POST':
			try {
				const refreshToken = req.cookies['refreshToken']
				if (!refreshToken) {
					return res.status(307).redirect('/')
					// res.writeHead(307, { Location: '/' })
					// res.end()
					// break
				}
				const tokenDoc = await Token.deleteOne({
					refreshToken,
				})
				if (!tokenDoc) {
					return res.status(307).redirect('/')
					// res.writeHead(307, { Location: '/' })
					// res.end()
					// break
				}

				const cookies = new Cookies(req, res)

				cookies.set('refreshToken')
				cookies.set('refreshAvailable')

				// Q: Should we delete the token too or do we want to keep track of tokens?
				// res.writeHead(307, { Location: '/' })
				return res.status(307).redirect('/')
				// res.end()
				// break
			} catch (error) {
				console.error('Error logging out')
				return res.status(400).json({
					error: 'Error logging out',
				})
			}
	}
}
