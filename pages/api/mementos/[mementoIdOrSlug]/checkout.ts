import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'
import {
	retrievePrice,
	retrieveProduct,
	createCheckoutSession,
} from '@/lib/stripe'
import { GetCheckoutSession, GetProductPrice } from '@/types'
import { Memento, PopulatedMemento } from '@/models/Memento'
import { isObjectIdOrHexString } from 'mongoose'
import { TUser } from '@/models/User'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<GetCheckoutSession.Response>
) => {
	const { mementoIdOrSlug, email } = req.query as {
		mementoIdOrSlug: string
		email: string
	}

	if (typeof mementoIdOrSlug !== 'string')
		return res.status(400).json({ error: 'Invalid memento ID' })

	const memento = isObjectIdOrHexString(mementoIdOrSlug)
		? await Memento.findById(mementoIdOrSlug).populate<{ user: TUser }>({
				path: 'user',
				model: 'User',
		  })
		: await Memento.findOne({ slug: mementoIdOrSlug }).populate<{
				user: TUser
		  }>({ path: 'user', model: 'User' })

	if (!memento) return res.status(404).send('Memento not found')

	switch (req.method) {
		case 'GET': {
			try {
				await connectDatabase()

				if (!memento.productId)
					return res.status(400).send('Memento does not have a product id')
				const product = await retrieveProduct(memento.productId)
				const price = await retrievePrice(product.default_price as string)

				console.log({ price })

				const session = await createCheckoutSession({
					email,
					priceId: price.id,
					userHandle: memento.user.handle || memento.user._id.toString(),
					mementoId: memento.slug || memento._id.toString(),
					merchantAccountId: memento.user.merchantAccountId as string,
				})

				return res.status(200).json({ session })
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
