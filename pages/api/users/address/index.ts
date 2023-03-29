import { NextApiRequest, NextApiResponse } from 'next'
import { connectDatabase } from '@/utils/connectDatabase'

import { User } from '@/models/User/user.model'
import type { UserDoc } from '@/models/User/user.types'

import { checkDeployed } from '@/lib/blockchain'
import { CHAIN_CONFIG } from '@/constants/chainConfig'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	switch (method) {
		case 'POST': {
			try {
				await connectDatabase()

				// Check
				const { address } = req.body

				const isMultisig = await checkDeployed(CHAIN_CONFIG.rpcTarget, address)

				if (isMultisig)
					return res.status(404).json({
						error:
							'Smart contract wallets are not supported as users at this time',
					})

				const user: UserDoc = await User.findOneAndUpdate(
					{
						eoa: address,
						eoaCreated: true,
					},
					{},
					{ upsert: true, returnDocument: 'after' }
				)

				if (!user) {
					return res.status(400).json({
						error: 'Unable to create user. Please contact admin',
					})
				}

				// At this point, create a safe with us as the user

				return res.status(200).json({
					user: {
						eoa: address,
						eoaCreated: true,
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
