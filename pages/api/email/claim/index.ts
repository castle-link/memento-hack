import { sendClaimEmail } from '@/lib/sendgrid'
import { User } from '@/models/User'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	switch (method) {
		case 'POST':
			try {
				const { email, name, imageUrl } = req.body
				if (typeof email !== 'string' || typeof name !== 'string')
					return res.status(400).json({ error: 'Missing required fields' })

				const user = await User.findByEmail(email)

				if (!user) return res.status(404).json({ error: 'User not found' })

				await sendClaimEmail({
					to: email,
					name,
					imageUrl,
					url: `${process.env.NEXT_PUBLIC_APP_URL}/${user.getHandle()}}`,
				})

				return res.status(200).json({ message: 'Claim email sent' })
			} catch (e: any) {
				console.error(e)
			}
	}
}

export default handler
