import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'
import { User } from '@/models/User/user.model'
import { AUTHENTICATED_USER_ID_HEADER } from '@/middleware'
import { createMerchantAccountLink } from '@/lib/stripe'
import { GetAccountLink } from '@/types'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<GetAccountLink.Response>
) => {
	const { method } = req

	const userId = req.headers[AUTHENTICATED_USER_ID_HEADER]

	if (!userId) return res.status(401).json({ error: 'Unauthorized' })

	switch (method) {
		case 'POST': {
			try {
				await connectDatabase()

				const user = await User.findById(userId)

				if (!user?.merchantAccountId) {
					return res.status(400).json({
						error:
							'User does not have a merchant account. Create one using the GET /api/merchant-account endpoint',
					})
				}

				const accountLink = await createMerchantAccountLink(
					user.merchantAccountId
				)
				return res.status(200).json({ accountLink })
			} catch (error: any) {
				console.error(error)
				return res.status(400).json({
					error: error.message,
				})
			}
		}
		default:
			return res.status(405).send('Method not allowed')
	}
}

export default handler
