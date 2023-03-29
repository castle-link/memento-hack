import {
	MEMENTO_FACTORY,
	MEMENTO_FACTORY_WITH_END_TIME,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME,
} from '@/constants/addresses'
import { ethers } from 'ethers'

// This will take mint transaction data and return the address of the memento
export const getAddressFromMintTx = async (
	transactionHash: string,
	providerUrl: string
) => {
	const provider = new ethers.providers.JsonRpcProvider(providerUrl)
	const tx = await provider.getTransactionReceipt(transactionHash as string)
	if (!tx) {
		throw new Error('Transaction not found on this network')
	}
	const event = tx.logs.filter(
		(log) =>
			ethers.utils.getAddress(log.address) ===
				ethers.utils.getAddress(MEMENTO_FACTORY) ||
			ethers.utils.getAddress(log.address) ===
				ethers.utils.getAddress(MEMENTO_FACTORY_WITH_MAX_SUPPLY) ||
			ethers.utils.getAddress(log.address) ===
				ethers.utils.getAddress(MEMENTO_FACTORY_WITH_END_TIME) ||
			ethers.utils.getAddress(log.address) ===
				ethers.utils.getAddress(MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME)
	)
	if (event[0]?.topics[2]) {
		const mementoAddress = ethers.BigNumber.from(event[0].topics[2])._hex
		return mementoAddress
	} else {
		console.error(
			'Memento address not found. Please try again in a few minutes'
		)
		throw new Error(
			'Memento address not found. Please try again in a few minutes'
		)
	}
}
