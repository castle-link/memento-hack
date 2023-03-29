import { NextApiRequest, NextApiResponse } from 'next'
import { Memento } from '@/models/Memento/memento.model'
import { User } from '@/models/User/user.model'
import { Claim } from '@/models/Claim/claim.model'
import { connectDatabase } from '@/utils/connectDatabase'
import { getDeploymentAddress } from '@/lib/safe'
import { checkDeployed, getInterface, sendTransaction } from '@/lib/blockchain'
import { MEMENTO_ABI, MEMENTO_MULTISEND_ABI } from '@/constants/abis'
import { MEMENTO_MULTISEND } from '@/constants/addresses'
import { sendClaimEmail } from '@/lib/sendgrid'
import { Logger } from '@/utils/logger'
import { Transaction } from '@/models/Transaction/transaction.model'
import { getTaskStatus, handleSponsorTransaction } from '@/lib/gelato'
import { CreateClaim } from '@/types'
import { getAddressFromMintTx } from '@/utils/getAddressFromMintTx'
import { v4 as uuidv4 } from 'uuid'
import { CHAIN_CONFIG } from '@/constants/chainConfig'
import { MementoDoc } from '@/models/Memento'

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<CreateClaim.Response>
) => {
	const { method } = req

	await connectDatabase()
	try {
		switch (method) {
			case 'POST': {
				try {
					// Get info from request
					const { mementoId, email, address, name } =
						req.body as CreateClaim.RequestBody
					// See if user exists with the email or address provided
					let user = await User.findOne({
						$or: [
							{
								email: {
									$exists: true,
									$eq: email,
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
					// If user does not exist, create one
					if (!user) {
						// Create one!
						const salt = uuidv4()
						if (email) {
							console.log('Creating user with email: ', email)
							user = await User.findOneAndUpdate(
								{
									name,
									email,
									eoa: null,
									eoaCreated: false,
									emailVerified: false,
									salt,
									multiSig: await getDeploymentAddress(
										salt,
										CHAIN_CONFIG.rpcTarget
									),
								},
								{},
								{ upsert: true, returnDocument: 'after' }
							)
						} else if (address) {
							console.log('Creating user with address: ', address)
							user = await User.findOneAndUpdate(
								{
									// id null for now
									// email null for now
									eoa: address,
									eoaCreated: true,
									multiSig: await getDeploymentAddress(
										salt,
										CHAIN_CONFIG.rpcTarget
									),
									salt,
								},
								{},
								{ upsert: true, returnDocument: 'after' }
							)
						} else {
							// If email or address not provided, return error
							console.error('No email or address provided')
							return res
								.status(400)
								.json({ error: 'No email or address provided' })
						}
					}

					if (!user) {
						// If user no found or error creating user, return error
						console.error('Unable to create user with details provided')
						return res
							.status(400)
							.json({ error: 'Unable to create user with details provided' })
					}

					// Now see if the memento exists in the database
					let memento = await Memento.findOne({ slug: mementoId })

					// If not, then return an error
					if (!memento) {
						console.error('Memento not found')
						return res.status(404).json({ error: 'Memento not found' })
					}
					// Otherwise, get the address of the memento
					let mementoAddress = memento.address
					if (!mementoAddress) {
						// If there is no address, then we have to
						// fetch it from the on chain transaction...

						// See if there is a hash for this memento
						let { transactionHash } = memento.toJSON()
						if (!transactionHash) {
							const { gelatoTaskId } = memento.toJSON()
							const taskStatus = await getTaskStatus(
								gelatoTaskId as unknown as string,
								process.env.GELATO_API_KEY
							)
							if (!taskStatus) throw new Error('Task not found')
							transactionHash = taskStatus.transactionHash
						}

						mementoAddress = await getAddressFromMintTx(
							transactionHash as string,
							CHAIN_CONFIG.rpcTarget
						)

						memento = (await memento.update(
							{
								address: mementoAddress,
							},
							{ returnDocument: 'after' }
						)) as MementoDoc
					}

					const deployed = await checkDeployed(
						CHAIN_CONFIG.rpcTarget,
						mementoAddress
					)

					if (!deployed) {
						console.error(
							'Memento not deployed yet. Please try again in a few minutes'
						)
						return res.status(404).json({
							error:
								'Memento not deployed yet. Please try again in a few minutes.',
						})
					}

					// // Otherwise, time to send the memento

					const mintAddress =
						user?.email && user?.multiSig ? user?.multiSig : user?.eoa
					if (!mintAddress) {
						console.error('Invalid mint address')
						return res.status(400).json({ error: 'Invalid mint address' })
					}

					const { claim } = await memento.createClaim({ user })

					if (!claim) {
						return res.status(404).json({ error: 'Claim not found' })
					}

					email &&
						(await sendClaimEmail({
							to: email,
							name: memento.metadata.title,
							imageUrl: memento.snapshotUrl || memento.metadata.mediaUrl,
							url: `${process.env.NEXT_PUBLIC_APP_URL}/${user.getHandle()}`,
						}))

					return res.status(200).json({ claim: claim.toJSON() })
				} catch (error: any) {
					console.error(error.message)
					return res.status(400).json({
						error: error.message,
					})
				}
			}
			case 'GET': {
				const { checkoutSessionId } = req.query as { checkoutSessionId: string }
				console.log({ checkoutSessionId, type: typeof checkoutSessionId })
				if (typeof checkoutSessionId !== 'string') {
					return res.status(400).json({ error: 'Invalid checkoutSessionId' })
				}

				const claim = await Claim.findOne({ checkoutSessionId }).populate({
					path: 'user',
				})
				if (!claim) {
					return res.status(404).json({ error: 'Claim not found' })
				}

				return res.status(200).json({ claim: claim.toJSON() })
			}
			default:
				return res.status(405).send('Method not allowed')
		}
	} catch (e: any) {
		Logger.logError(e, 'An error occurred while processing the claim request')
	}
}

export default handler
