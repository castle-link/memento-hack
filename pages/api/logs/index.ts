import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query, body } = req

	switch (method) {
		case 'POST': {
			const { ddforward } = query

			try {
				const resp = await fetch(ddforward as string, {
					method: 'POST',
					body,
				})

				const response = await resp.json()

				return res.status(200).json(response)
			} catch (error) {
				return res.status(400).json({ error: 'Error creating log' })
			}
		}
		default:
			return res.status(400)
	}
}
