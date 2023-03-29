import { AUTHENTICATED_USER_ID_HEADER } from 'middleware'
import { User } from '@/models/User'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

// Create a nextjs api endpoint that accepts a handle as a query string, checks if it's used by any user in the database and returns a JSON response of {available: boolean} based on the result
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		switch (req.method) {
			case 'GET': {
				const { search: handle } = req.query

				if (typeof handle !== 'string')
					return res.status(400).json({ message: 'Bad request' })

				if (handle.length < 3)
					return res
						.status(400)
						.json({ message: 'Must be atleast 3 characters' })

				if (handle.length > 30)
					return res
						.status(400)
						.json({ message: 'Must be less than 30 characters' })

				const existingsUser = await User.findByHandle(handle)

				return res.status(200).json({ available: !existingsUser })
			}
			default: {
				return res.status(405).json({ message: 'Method not allowed' })
			}
		}
	} catch {
		return res.status(500).json({ message: 'Internal server error' })
	}
}
