import { createMerchantAccount } from './../../../src/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'
import { User } from '@/models/User/user.model'
import { AUTHENTICATED_USER_ID_HEADER } from '@/middleware'
import { retrieveMerchantAccount } from '@/lib/stripe'
import Stripe from 'stripe'
import { GetMerchantAccount } from '@/types'

Stripe.CustomersResource
const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<GetMerchantAccount.Response>
) => {
	const { method } = req

	const userId = req.headers[AUTHENTICATED_USER_ID_HEADER]

	if (!userId) return res.status(401).json({ error: 'Unauthorized' })

	switch (method) {
		case 'GET': {
			try {
				await connectDatabase()

				const user = await User.findById(userId)

				if (!user) {
					return res.status(400).json({
						error: 'Unable to create user. Please contact admin',
					})
				}

				if (user.merchantAccountId) {
					const merchantAccount = await retrieveMerchantAccount(
						user.merchantAccountId
					)
					return res.status(200).json({ merchantAccount })
				} else {
					if (!user.email) {
						return res.status(400).json({
							error: 'Unable to create merchant account. Email required',
						})
					}
					const merchantAccount = await createMerchantAccount(user.email)

					await user.update({ merchantAccountId: merchantAccount.id })

					return res.status(200).json({ merchantAccount })
				}
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
