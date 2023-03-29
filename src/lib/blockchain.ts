import { ethers, UnsignedTransaction } from 'ethers'
import { arrayify } from 'ethers/lib/utils'

export const getInterface = (abi: any) => {
	return new ethers.utils.Interface(abi)
}

export const getContract = (
	address: string,
	abi: any,
	providerUrl?: string
) => {
	return new ethers.Contract(
		address,
		abi,
		new ethers.providers.JsonRpcProvider(providerUrl)
	)
}

export const sendTransaction = async (
	tx: UnsignedTransaction,
	pk: string,
	providerUrl: string
) => {
	const provider = new ethers.providers.JsonRpcProvider(providerUrl)
	const wallet = new ethers.Wallet(pk, provider)

	const estimatedGas = await provider.estimateGas({
		value: tx.value || '0',
		to: tx.to,
		data: tx.data,
		from: wallet.address,
	})
	const gasPrice = await provider.getGasPrice()

	const transaction = await wallet.sendTransaction({
		value: tx.value || '0',
		to: tx.to,
		data: tx.data,
		// Note: Removed .mul(5) from estimatedGas since something
		// else solved the large user operation calldata gas
		// estimation issue (see userOperationVerificationGas)
		// Note: Need this .mul(5) actually lmao:
		// Note: Use feeData = await provider.getFeeData()
		gasPrice,
		// gasLimit: estimatedGas.mul(5),
		gasLimit: estimatedGas,
	})

	return transaction
}

export const signMessage = async (
	privateKey: string,
	message: string,
	providerUrl: string
) => {
	const provider = new ethers.providers.JsonRpcProvider(providerUrl)
	const wallet = new ethers.Wallet(privateKey, provider)
	const signedMessage = await wallet.signMessage(arrayify(message))
	return signedMessage
}

export const checkDeployed = async (
	providerUrl: string,
	contractAddress: string
) => {
	const provider = new ethers.providers.JsonRpcProvider(providerUrl)
	const code = await provider.getCode(contractAddress)
	if (code !== '0x') return true
	return false
}
