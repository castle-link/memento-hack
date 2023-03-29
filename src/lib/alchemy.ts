import { Logger } from '@/utils/logger'
import { ethers } from 'ethers'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')

class Alchemy {
	web3
	constructor() {
		this.web3 = createAlchemyWeb3(
			((process.env.NEXT_PUBLIC_ALCHEMY_URL as string) +
				process.env.NEXT_PUBLIC_ALCHEMY_API) as string
		)
	}

	getNFTsByOwner = async (ownerAddress: string) => {
		// Works ok; need to see what info is missing
		try {
			const nfts = await this.web3.alchemy.getNfts({ owner: ownerAddress })
			return nfts.ownedNfts
		} catch (error) {
			Logger.error('Error getting NFTs by owner from Alchemy')
		}
	}

	getNFTMetadata = async (contractAddress: string, tokenId: string) => {
		// Brings min data for now (only specific to the nft...)
		try {
			const nftMetadata = await this.web3.alchemy.getNftMetadata({
				contractAddress,
				tokenId,
			})
			return nftMetadata
		} catch (error) {
			Logger.error('Error getting NFT metadata from Alchemy')
		}
	}

	getTransactionReceipts = async (txHashes: any[]) => {
		try {
			const txHashStatuses = await this.web3.alchemy.getTransactionReceipts(
				txHashes
			)
			return txHashStatuses
		} catch (e) {
			Logger.error('Error checking txHash with Alchemy')
		}
	}
}
export default Alchemy

let alchemyProvider: ethers.providers.AlchemyProvider

export const getAlchemyProvider = () => {
	if (alchemyProvider) return alchemyProvider
	alchemyProvider = new ethers.providers.AlchemyProvider(
		'matic', // Change as needed
		process.env.NEXT_PUBLIC_ALCHEMY_API
	)
	return alchemyProvider
}
