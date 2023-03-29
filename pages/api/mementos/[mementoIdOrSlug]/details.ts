import { NextApiResponse, NextApiRequest } from 'next'
import connectDatabase from '@/utils/connectDatabase'
import { Memento } from '@/models/Memento'
import { Claim } from '@/models/Claim'
import { isObjectIdOrHexString } from 'mongoose'
import { GetMemento } from '@/types'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<GetMemento.Response>
) => {
	const {
		query: { mementoIdOrSlug },
		method,
	} = req

	switch (method) {
		case 'GET': {
			try {
				await connectDatabase()

				const memento = isObjectIdOrHexString(mementoIdOrSlug)
					? await Memento.findById(mementoIdOrSlug)
					: await Memento.findOne({ slug: mementoIdOrSlug })

				if (!memento) return res.status(404).send('Memento not found')

				await memento.populate({
					path: 'user',
				})

				const claims = await Claim.find({
					memento: memento?._id,
				})
					.populate({
						path: 'memento',
						model: 'Memento',
						populate: {
							path: 'user',
							model: 'User',
						},
					})
					.populate({ path: 'user', model: 'User' })
					.populate({ path: 'transaction', model: 'Transaction' })

				return res.status(200).send({
					memento: memento?.toJSON(),
					claims: claims.map((claim) => claim.toJSON()),
				})
			} catch (e: any) {
				return res.status(400).json({ error: e.message })
			}
		}
		default: {
			return res.status(405).send('Method not allowed')
		}
	}
}

export default handler
