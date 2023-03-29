import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'
import { User } from '@/models/User/user.model'
import type { UserDoc } from '@/models/User/user.types'

import { createDeployWalletTx, getDeploymentAddress } from '@/lib/safe' // Update this so that we can create a new safe deployment contract that allows us to predict the address of a safe with an email, social, number, etc.
import { sendTransaction, checkDeployed } from '@/lib/blockchain'
import { Transaction } from '@/models/Transaction/transaction.model'
import { getTaskStatus, handleSponsorTransaction } from '@/lib/gelato'

import { v4 as uuidv4 } from 'uuid'
import { CHAIN_CONFIG } from '@/constants/chainConfig'
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	switch (method) {
		case 'POST': {
			try {
				await connectDatabase()

				if (!process.env.PRIVATE_KEY || !process.env.PUBLIC_ADDRESS) {
					return res.status(404).json({
						error: 'Castle not configured properly. Please contact admin',
					})
				}
				const { id, email, phone, owner } = req.body
				const salt = uuidv4()
				const user: UserDoc = await User.findOneAndUpdate(
					{
						id,
						email,
						phone,
						eoa: owner,
						eoaCreated: !!owner,
						emailVerified: !!owner,
						salt,
					},
					{},
					{ upsert: true, returnDocument: 'after' }
				)

				if (!user) {
					return res.status(400).json({
						error: 'Unable to create user. Please contact admin',
					})
				}

				const deploymentAddress = await getDeploymentAddress(
					salt,
					CHAIN_CONFIG.rpcTarget
				)

				const deployed = await checkDeployed(
					CHAIN_CONFIG.rpcTarget,
					deploymentAddress
				)

				if (!deployed) {
					const tx = await createDeployWalletTx(salt)

					const relayResponse = await handleSponsorTransaction(
						tx.to,
						tx.data,
						84531,
						process.env.GELATO_API_KEY
					)

					await Transaction.findOneAndUpdate(
						{
							gelatoTaskId: relayResponse?.taskId,
						},
						{
							transactionType: 'createWallet',
							to: tx.to,
							value: tx.value,
							data: tx.data,
						},
						{
							upsert: true,
							returnDocument: 'after',
						}
					)
				}

				const updated = await user.update({
					multiSig: deploymentAddress,
					multiSigCreated: true,
				})

				if (!updated) {
					return res.status(400).json({
						error: 'Unable to update user. Please contact admin',
					})
				}

				// At this point, create a safe with us as the user

				return res.status(200).json({
					user: {
						id,
						email,
						eoa: owner,
						multiSig: deploymentAddress,
						eoaCreated: !!owner,
						multiSigCreated: true,
						multiSigTransferred: false,
						emailVerified: !!owner,
						salt,
					},
				})
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
