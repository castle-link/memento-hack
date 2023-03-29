import { ethers, providers } from 'ethers'

export const getMetaMaskAddress = async () => {
	await window.ethereum.enable()
	const provider = new providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const address = await signer.getAddress()
	return {
		address,
	}
}

export const connectMetaMask = async () => {
	await window.ethereum.enable()
	const provider = new providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const address = await signer.getAddress()
	const balance = await provider.getBalance(address)

	const data = ethers.utils.toUtf8Bytes('Connect to Castle')

	try {
		let signedMessage = await provider.send('personal_sign', [
			ethers.utils.hexlify(data),
			address.toLowerCase(),
		])
		return {
			address: address.toLowerCase(),
			balance: ethers.utils.formatEther(balance),
			provider,
			signedMessage,
		}
	} catch (error) {
		throw new Error(error.message)
	}
}
