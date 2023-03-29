import { ethers } from 'ethers'
import { getContract, getInterface } from './blockchain'
import {
	C_CREATE2_SAFE_FACTORY,
	S_FALLBACK_HANDLER,
} from '@/constants/addresses'

import { C_CREATE2_SAFE_FACTORY_ABI } from '@/constants/abis'

const create2SafeFactoryInterface = getInterface(C_CREATE2_SAFE_FACTORY_ABI)

export const createDeployWalletTx = (salt: string) => {
	const data = create2SafeFactoryInterface.encodeFunctionData('createAccount', [
		[process.env.PUBLIC_ADDRESS],
		1,
		ethers.constants.AddressZero,
		0,
		S_FALLBACK_HANDLER,
		ethers.constants.AddressZero,
		0,
		ethers.constants.AddressZero,
		salt,
	])
	return {
		to: C_CREATE2_SAFE_FACTORY,
		value: '0',
		data,
	}
}

export const getDeploymentAddress = async (
	salt: string,
	providerUrl: string
) => {
	const create2SafeFactoryContract = getContract(
		C_CREATE2_SAFE_FACTORY,
		C_CREATE2_SAFE_FACTORY_ABI,
		providerUrl
	)
	const deploymentAddress: string =
		await create2SafeFactoryContract.callStatic.getDeploymentAddress(
			[process.env.PUBLIC_ADDRESS],
			1,
			ethers.constants.AddressZero,
			0,
			S_FALLBACK_HANDLER,
			ethers.constants.AddressZero,
			0,
			ethers.constants.AddressZero,
			salt
		)
	return deploymentAddress
}
