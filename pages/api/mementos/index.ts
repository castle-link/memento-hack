import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'
import { Memento } from '@/models/Memento/memento.model'
import type { MementoDoc } from '@/models/Memento/memento.types'
import { User } from '@/models/User/user.model'
import { getCreateCollectionTx } from '@/lib/memento'
import { BigNumber, ethers } from 'ethers'
import { sendTransaction } from '@/lib/blockchain'
import { Transaction } from '@/models/Transaction/transaction.model'
import { handleSponsorTransaction, getTaskStatus } from '@/lib/gelato'
import { AUTHENTICATED_USER_ID_HEADER } from '@/middleware'
import { createProduct } from '@/lib/stripe'
import { Stripe } from 'stripe'
import { CreateMemento } from '@/types'
import { CHAIN_CONFIG } from '@/constants/chainConfig'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<CreateMemento.Response>
) => {
	const { method } = req

	switch (method) {
		case 'POST': {
			try {
				await connectDatabase()

				const {
					title,
					symbol,
					description,
					media, // This is the base64
					uploadedAsset,
					start,
					end,
					numberOfEditions,
					creator,
					isOngoing,
					isUnlimited,
					email,
					address,
					price,
					snapshotUrl,
				} = req.body

				const userId = req.headers[AUTHENTICATED_USER_ID_HEADER]

				if (!userId) return res.status(401).json({ error: 'Unauthorized' })

				const user = await User.findById(userId)

				if (!user) return res.status(404).json({ error: 'User not found' })

				if (!user.email && !user.eoa)
					return res
						.status(400)
						.json({ error: 'User does not have an email or EOA' })

				let memento
				if (user.email) {
					console.log({
						name: title,
						symbol,
						baseURI: media,
						startTime: BigNumber.from(start).div(1000),
						admin: creator ?? process.env.PUBLIC_ADDRESS, // Should be us for now?
						endTime: isOngoing ? undefined : BigNumber.from(end).div(1000),
						maxSupply: isUnlimited
							? undefined
							: BigNumber.from(numberOfEditions),
						description,
						uploadedAsset,
						editions: isUnlimited ? 'Unlimited' : 'Fixed',
						editionSize: numberOfEditions,
						userId: user._id,
						snapshotUrl,
					})
					const { memento: mementoNew, transaction } =
						await handleUserWithEmail({
							name: title,
							symbol,
							baseURI: media,
							startTime: start,
							admin: creator ?? process.env.PUBLIC_ADDRESS, // Should be us for now?
							endTime: isOngoing ? undefined : end,
							maxSupply: isUnlimited
								? undefined
								: BigNumber.from(numberOfEditions),
							description,
							uploadedAsset,
							editions: isUnlimited ? 'Unlimited' : 'Fixed',
							editionSize: isUnlimited ? undefined : numberOfEditions,
							userId: user._id,
							snapshotUrl,
						})

					memento = mementoNew
				} else if (address) {
					const { transactionHash } = req.body

					if (!transactionHash)
						return res
							.status(400)
							.json({ error: 'No transaction hash provided' })

					const { memento: mementoNew, transaction } =
						await handleUserWithAddress({
							name: title,
							description,
							uploadedAsset,
							symbol,
							editions: isUnlimited ? 'Unlimited' : 'Fixed',
							editionSize: isUnlimited ? undefined : numberOfEditions,
							startTime: start,
							endTime: isOngoing ? undefined : end,
							userId: user._id,
							snapshotUrl,
							transactionHash,
							providerUrl: CHAIN_CONFIG.rpcTarget,
							address,
						})

					memento = mementoNew
				}

				if (!memento)
					return res.status(400).json({ error: 'Memento not created' })

				let product: Stripe.Product | null = null
				if (price && price > 0) {
					if (!user.merchantAccountId)
						return res
							.status(400)
							.json({ error: 'User does not have a merchant account' })

					product = await createProduct({
						name: memento.name,
						mementoId: memento._id.toString(),
						price: Math.round(price * 100), // change to cents
						mementoSlug: memento.slug,
						userId: user._id?.toString(),
						userHandle: user.handle,
					})

					await memento.update({ productId: product.id })
				}

				const updatedMemento = (await Memento.findById(memento._id).populate({
					path: 'user',
				})) as MementoDoc

				// Return new list of transactions
				const collections = await Memento.find({
					user: user._id,
					transactionHash: { $exists: true },
				})
					.populate({ path: 'user' })
					.sort({ _id: -1 })

				return res
					.status(200)
					.json({ memento: updatedMemento.toJSON(), collections, product })
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

const createSlug = (name: string) => {
	const slug = name
		.toLowerCase()
		.trim()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '')
	return slug
}

const handleSlug = async (name: string) => {
	let existingMemento: MementoDoc | null = null
	let slug: string | null = null
	let v = 0
	do {
		existingMemento = await Memento.findOne({
			slug: v === 0 ? createSlug(name) : `${createSlug(name)}-${v}`,
		})
		if (existingMemento) {
			v++
		} else {
			slug = v === 0 ? createSlug(name) : `${createSlug(name)}-${v}`
		}
	} while (!slug)
	return slug
}

const handleUserWithEmail = async ({
	name,
	symbol,
	baseURI,
	startTime,
	admin,
	endTime,
	maxSupply,
	description,
	uploadedAsset,
	editions,
	editionSize,
	userId,
	snapshotUrl,
}: {
	name: any
	symbol: any
	baseURI: any
	startTime: any
	admin: any
	endTime: any
	maxSupply: any
	description: any
	uploadedAsset: any
	editions: any
	editionSize: any
	userId: any
	snapshotUrl: any
}) => {
	// User has email so we need to pay for them
	// Create the createCollectionTx
	const { tx } = getCreateCollectionTx({
		name,
		symbol,
		baseURI,
		startTime: BigNumber.from(startTime).div(1000),
		admin,
		endTime: endTime && BigNumber.from(endTime).div(1000),
		maxSupply,
	})
	const { taskId } = await handleSponsorTransaction(
		tx.to,
		tx.data,
		84531,
		process.env.GELATO_API_KEY
	)
	const transaction = await Transaction.findOneAndUpdate(
		{ gelatoTaskId: taskId },
		{
			transactionType: 'createCollection',
			to: tx.to,
			value: tx.value,
			data: tx.data,
		},
		{
			upsert: true,
			returnDocument: 'after',
		}
	)
	const slug = await handleSlug(name)
	const memento = await Memento.findOneAndUpdate(
		{
			metadata: {
				title: name,
				description,
				mediaUrl: uploadedAsset,
			},
			name,
			symbol,
			editions,
			editionSize,
			startDate: startTime,
			endDate: endTime,
			user: userId,
			slug,
			snapshotUrl,
			gelatoTaskId: taskId,
		},
		{},
		{ upsert: true, returnDocument: 'after' }
	)
	return {
		memento: memento as MementoDoc,
		transaction,
	}
}
const handleUserWithAddress = async ({
	name,
	description,
	uploadedAsset,
	symbol,
	editions,
	editionSize,
	startTime,
	endTime,
	userId,
	snapshotUrl,
	transactionHash,
	providerUrl,
	address,
}: {
	name: any
	description: any
	uploadedAsset: any
	symbol: any
	editions: any
	editionSize: any
	startTime: any
	endTime: any
	userId: any
	snapshotUrl: any
	transactionHash: any
	providerUrl: any
	address: any
}) => {
	// For this type of user, they've paid
	// for their own transaction so we need to get
	// the transaction hash from this person
	const slug = await handleSlug(name)
	console.log({ providerUrl })
	const provider = new ethers.providers.JsonRpcProvider(providerUrl)
	console.log({ transactionHash })
	const tx = await provider.getTransaction(transactionHash)
	console.log({ tx })
	const transaction = await Transaction.findOneAndUpdate(
		{
			transactionHash,
		},
		{
			transactionType: 'createCollection',
			to: tx?.to,
			value: tx?.value,
			data: tx?.data,
			from: address,
		},
		{
			upsert: true,
			returnDocument: 'after',
		}
	)
	const memento = await Memento.findOneAndUpdate(
		{
			metadata: {
				title: name,
				description,
				mediaUrl: uploadedAsset,
			},
			name,
			symbol,
			editions,
			editionSize,
			startDate: startTime,
			endDate: endTime,
			user: userId,
			slug,
			snapshotUrl,
			transactionHash,
		},
		{},
		{ upsert: true, returnDocument: 'after' }
	)
	return {
		memento: memento as MementoDoc,
		transaction,
	}
}
