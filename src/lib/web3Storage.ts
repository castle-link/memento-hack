import { File, Web3Storage } from 'web3.storage'

export const uploadMetadata = async (file: File) => {
	const token = process.env.WEB3_STORAGE_API_TOKEN
	if (!token)
		throw new Error('Configuration not complete. Please contact admin.')

	const storage = new Web3Storage({ token })
	const cid = await storage.put([file])
	return cid
}
export const createFile = (
	title: string,
	description: string,
	mediaUrl: string
) => {
	const json = JSON.stringify({
		name: title,
		description,
		image: mediaUrl,
		external_url: mediaUrl,
	})
	const buffer = Buffer.from(json)
	const file = new File([buffer], 'metadata.json')
	return file
}
