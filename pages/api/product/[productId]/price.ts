import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'
import { retrievePrice, retrieveProduct } from '@/lib/stripe'
import { GetProductPrice } from '@/types'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<GetProductPrice.Response>
) => {
	const { productId } = req.query as { productId: string }

	if (typeof productId !== 'string')
		return res.status(400).json({ error: 'Invalid product ID' })

	switch (req.method) {
		case 'GET': {
			try {
				await connectDatabase()

				const product = await retrieveProduct(productId)
				const price = await retrievePrice(product.default_price as string)
				return res.status(200).json({ price })
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
