import { NextApiResponse, NextApiRequest } from 'next'

// Models
import connectDatabase from '@/utils/connectDatabase'
import { User } from '@/models/User/user.model'
import { Memento, MementoDoc } from '@/models/Memento'
import { Claim } from '@/models/Claim'

import { getAddressFromMintTx } from '@/utils/getAddressFromMintTx'
import { getTaskStatus } from '@/lib/gelato'
import { CHAIN_CONFIG } from '@/constants/chainConfig'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { address } = req.query as { address: string }

	if (typeof address !== 'string') {
		return res.status(400).json({ message: 'Bad request' })
	}

	switch (req.method) {
		case 'GET':
			try {
				await connectDatabase()

				const user = await User.findOne({
					$or: [
						{
							multiSig: {
								$exists: true,
								$eq: address?.toLowerCase(),
								$ne: null,
							},
						},
						{
							eoa: {
								$exists: true,
								$eq: address?.toLowerCase(),
								$ne: null,
							},
						},
					],
				})

				// Return error if user not found
				if (!user) {
					return res.status(200).json({ user: null, message: 'User not found' })
				}

				const created = await Memento.find({
					user: user._id,
					transactionHash: { $exists: true },
				})
					.populate({ path: 'user' })
					.sort({ _id: -1 })

				let decorated: any[] = []
				for (let collection of created) {
					const claimed = await Claim.find({
						memento: collection._id,
					})
					if (!collection.address) {
						let { transactionHash } = collection.toJSON()
						if (!transactionHash) {
							const { gelatoTaskId } = collection.toJSON()
							const taskStatus = await getTaskStatus(
								gelatoTaskId as unknown as string,
								process.env.GELATO_API_KEY
							)
							if (!taskStatus) throw new Error('Task not found')
							transactionHash = taskStatus.transactionHash
						}
						const mementoAddress = await getAddressFromMintTx(
							transactionHash as string,
							CHAIN_CONFIG.rpcTarget
						)
						if (mementoAddress) {
							await collection.update({
								address: mementoAddress,
							})
							decorated.push({
								...collection.toJSON(),
								address: mementoAddress,
								claimed: claimed.length,
							})
						} else {
							decorated.push({
								...collection.toJSON(),
								claimed: claimed.length,
								status: 'pending',
							})
						}
					} else {
						decorated.push({
							...collection.toJSON(),
							claimed: claimed.length,
						})
					}
				}

				const collected = await Claim.find({ user: user._id })
					.populate({
						path: 'memento',
						populate: [{ path: 'user' }],
					})
					.populate({ path: 'user' })
					.sort({ _id: -1 })

				const collectors = await Claim.find({
					memento: {
						$in: created.map((collection) => collection._id),
					},
				})
					.populate({
						path: 'memento',
					})
					.populate({ path: 'user' })
				// Return user
				return res.status(200).json({
					user: user.toJSON(),
					created: decorated,
					collected,
					collectors,
				})
			} catch (error: any) {
				console.error(error)
				return res.status(500).json({ error: error.message })
			}

		case 'PATCH':
			try {
				await connectDatabase()
				const {
					email,
					phone,
					eoa,
					multiSig,
					eoaCreated,
					multiSigCreated,
					multiSigTransferred,
					emailVerified,
					phoneVerified,
					name,
					bio,
					profilePicUrl,
				} = req.body

				// Find user and update
				const user = await User.findOneAndUpdate(
					{
						$or: [
							{
								multiSig: {
									$exists: true,
									$eq: address,
									$ne: null,
								},
							},
							{
								eoa: {
									$exists: true,
									$eq: address,
									$ne: null,
								},
							},
						],
					},
					{
						email,
						phone,
						eoa,
						multiSig,
						eoaCreated,
						multiSigCreated,
						multiSigTransferred,
						emailVerified,
						phoneVerified,
						name,
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
