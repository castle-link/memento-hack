import { NextApiRequest, NextApiResponse } from 'next'
import { createFile, uploadMetadata } from '@/lib/web3Storage'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	switch (method) {
		case 'POST': {
			const { title, description, mediaUrl } = req.body
			if (!title || !description) {
				return res.status(404).send('Metadata missing')
			}
			const file = createFile(title, description, mediaUrl)
			const cid = await uploadMetadata(file)
			// If file is uploaded correctly, return cid
			return res.status(200).json({ cid })
		}
		default:
			return res.status(405).send('Method not allowed')
	}
}

export default handler
