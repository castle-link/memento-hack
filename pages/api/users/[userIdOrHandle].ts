import { GetUser, UpdateUser } from '@/types'
import { NextApiResponse, NextApiRequest } from 'next'

// Models
import connectDatabase from '@/utils/connectDatabase'
import { User } from '@/models/User/user.model'
import { Memento, MementoDoc } from '@/models/Memento'
import { Claim } from '@/models/Claim'
import { AUTHENTICATED_USER_ID_HEADER } from 'middleware'
import { isObjectIdOrHexString } from 'mongoose'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<GetUser.Response | UpdateUser.Response>
) => {
	const { userIdOrHandle } = req.query as { userIdOrHandle: string }

	switch (req.method) {
		case 'GET':
			try {
				await connectDatabase()

				const user = isObjectIdOrHexString(userIdOrHandle)
					? (await User.findById(userIdOrHandle)) ||
					  (await User.findByHandle(userIdOrHandle))
					: await User.findByHandle(userIdOrHandle)

				// Return error if user not found
				if (!user) {
					return res.status(404).json({ message: 'User not found' })
				}

				let collections = await Memento.find({
					user: user._id,
					$or: [
						{ transactionHash: { $exists: true } },
						{ gelatoTaskId: { $exists: true } },
					],
				})
					.populate({ path: 'user' })
					.sort({ _id: -1 })

				const decoratedCollections = await Promise.all(
					collections.map(async (collection) => collection.fetchDecorated())
				)

				const collected = await Claim.find({ user: user._id })
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
					.sort({ _id: -1 })

				const collectors = await Claim.find({
					memento: {
						$in: collections.map((collection) => collection._id),
					},
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

				// Return user
				return res.status(200).json({
					user: user.toJSON(),
					collections: decoratedCollections,
					collected: collected.map((claim) => claim.toJSON()),
					collectors: collectors.map((collector) => collector.toJSON()),
				})
			} catch (error: any) {
				console.error(error)
				return res.status(500).json({ error: error.message })
			}

		case 'PATCH':
			try {
				await connectDatabase()
				const { name, bio, profilePicUrl, handle } = req.body

				const userId = req.headers[AUTHENTICATED_USER_ID_HEADER]

				if (!userId) return res.status(401).json({ error: 'Unauthorized' })

				if (handle) {
					if (handle.length < 3)
						return res
							.status(400)
							.json({ message: 'Must be atleast 3 characters' })

					if (handle.length > 30)
						return res
							.status(400)
							.json({ message: 'Must be less than 30 characters' })
				}

				// Find user and update
				const user = await User.findByIdAndUpdate(
					userId,
					{
						name,
						handle,
						bio,
						profilePicUrl,
					},
					{
						new: true,
						runValidators: true,
					}
				)

				if (!user) return res.status(404).json({ error: 'User not found' })

				// Return user
				return res.status(200).json({
					user: user.toJSON(),
				})
			} catch (error: any) {
				console.error(error)
				return res.status(400).json({ error: error.message })
			}

		default:
			return res.status(405).send('Method not allowed')
	}
}

export default handler
