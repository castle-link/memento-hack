import {
	MEMENTO_FACTORY,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY,
	MEMENTO_FACTORY_WITH_END_TIME,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME,
} from '@/constants/addresses'
import {
	MEMENTO_FACTORY_ABI,
	MEMENTO_FACTORY_WITH_END_TIME_ABI,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY_ABI,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME_ABI,
} from '@/constants/abis'
import { getInterface } from './blockchain'
import { BigNumberish } from 'ethers'

const baseTx = {
	value: '0',
}

export const getCreateCollectionTx = ({
	name,
	symbol,
	baseURI,
	startTime,
	admin,
	endTime,
	maxSupply,
}: {
	name: string
	symbol: string
	baseURI: string
	startTime: BigNumberish
	admin: string
	endTime?: BigNumberish
	maxSupply?: BigNumberish
}) => {
	let tx, functionName, factoryInterface
	if (!endTime && !maxSupply) {
		console.log('creating a basic erc721')
		factoryInterface = getInterface(MEMENTO_FACTORY_ABI)
		functionName = 'createERC721Collection'
		tx = {
			...baseTx,
			to: MEMENTO_FACTORY,
			data: factoryInterface.encodeFunctionData(
				'createERC721Collection',
				[name, symbol, baseURI, startTime, admin]
			),
		}
	} else if (endTime && !maxSupply) {
		console.log('creating a erc721 with end time')
		factoryInterface = getInterface(MEMENTO_FACTORY_WITH_END_TIME_ABI)
		functionName = 'createCollectionWithEndTime'
		tx = {
			...baseTx,
			to: MEMENTO_FACTORY_WITH_END_TIME,
			data: factoryInterface.encodeFunctionData(
				'createCollectionWithEndTime',
				[name, symbol, baseURI, startTime, admin, endTime]
			),
		}
	} else if (!endTime && maxSupply) {
		console.log('creating a erc721 with max supply')
		factoryInterface = getInterface(MEMENTO_FACTORY_WITH_MAX_SUPPLY_ABI)
		functionName = 'createCollectionWithMaxSupply'
		tx = {
			...baseTx,
			to: MEMENTO_FACTORY_WITH_MAX_SUPPLY,
			data: factoryInterface.encodeFunctionData(
				'createCollectionWithMaxSupply',
				[name, symbol, baseURI, startTime, admin, maxSupply]
			),
		}
	} else if (endTime && maxSupply) {
		console.log('creating a erc721 with max supply and end time')
		factoryInterface = getInterface(
			MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME_ABI
		)
		functionName = 'createERC721WithEndTimeAndMaxSupply'
		tx = {
			...baseTx,
			to: MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME,
			data: factoryInterface?.encodeFunctionData(
				'createERC721WithEndTimeAndMaxSupply',
				[name, symbol, baseURI, startTime, admin, endTime, maxSupply]
			),
		}
	} else {
		throw new Error('Invalid parameters') // Should never get here
	}
	return {
		tx,
		address: tx.to,
		functionName,
	}
}

export const handleAddress = (
	endTime?: BigNumberish,
	maxSupply?: BigNumberish
) => {
	if (!endTime && !maxSupply) {
		return MEMENTO_FACTORY
	} else if (endTime && !maxSupply) {
		return MEMENTO_FACTORY_WITH_END_TIME
	} else if (!endTime && maxSupply) {
		return MEMENTO_FACTORY_WITH_MAX_SUPPLY
	} else if (endTime && maxSupply) {
		return MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME
	} else {
		throw new Error('Invalid parameters') // Should never get here
	}
}

export const handleFunctionName = (
	endTime?: BigNumberish,
	maxSupply?: BigNumberish
) => {
	if (!endTime && !maxSupply) {
		return 'createERC721Collection'
	} else if (endTime && !maxSupply) {
		return 'createCollectionWithEndTime'
	} else if (!endTime && maxSupply) {
		return 'createCollectionWithMaxSupply'
	} else if (endTime && maxSupply) {
		return 'createERC721WithEndTimeAndMaxSupply'
	} else {
		throw new Error('Invalid parameters') // Should never get here
	}
}

export const handleAbi = (address: string) => {
	let abi
	switch (address) {
		case MEMENTO_FACTORY:
			abi = MEMENTO_FACTORY_ABI
			break
		case MEMENTO_FACTORY_WITH_END_TIME:
			abi = MEMENTO_FACTORY_WITH_END_TIME_ABI
			break
		case MEMENTO_FACTORY_WITH_MAX_SUPPLY:
			abi = MEMENTO_FACTORY_WITH_MAX_SUPPLY_ABI
			break
		case MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME:
		default:
			abi = MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME_ABI
			break
	}
	return abi
}
