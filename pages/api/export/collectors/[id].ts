import { NextApiResponse, NextApiRequest } from 'next'

// Models
import { User } from '@/models/User/user.model'
import connectDatabase from '@/utils/connectDatabase'
import { Memento } from '@/models/Memento'
import { Claim } from '@/models/Claim'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query as { id: string }

	switch (req.method) {
		case 'GET':
			try {
				await connectDatabase()

				let user = await User.findOne({
					$or: [
						{
							email: {
								$exists: true,
								$eq: id?.toLowerCase(),
								$ne: null,
							},
						},
						{
							eoa: {
								$exists: true,
								$eq: id,
								$ne: null,
							},
						},
					],
				})

				// Return error if user not found
				if (!user) {
					return res.status(200).json({ user: null, message: 'User not found' })
				}

				const mementos = await Memento.find({ user: user._id })
				const mementoIds = mementos.map((memento) => memento._id)

				// Gets list of mementos
				const claims = await Claim.find({
					memento: { $in: mementoIds },
				})
					.populate({ path: 'user' })
					.populate({ path: 'memento' })

				const emails = new Set(claims.map((claim: any) => claim?.user?.email))

				console.log({ emails })
				// Return user
				return res.status(200).json({
					emails: Array.from(emails).filter((email) => email),
				})
			} catch (error: any) {
				console.error(error)
				return res.status(500).json({ error: error.message })
			}

		default:
			return res.status(405).send('Method not allowed')
	}
}

export default handler
