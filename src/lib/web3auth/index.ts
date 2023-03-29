import { CHAIN_CONFIG } from '../../constants/chainConfig'
import SingleFactorAuth from '@web3auth/single-factor-auth'
import { ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'

class Web3Auth {
	authenticator: SingleFactorAuth

	constructor() {
		this.authenticator = this.createAuthenticator()
		this.authenticator.init()
	}

	createAuthenticator() {
		return new SingleFactorAuth({
			clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // get from https://dashboard.web3auth.io
			web3AuthNetwork: process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK,
			chainConfig: CHAIN_CONFIG,
		})
	}

	async disconnect() {
		// Override the current authenticator with a new one
		this.authenticator = this.createAuthenticator()
		this.authenticator.init()
	}

	async getSigner() {
		return this.provider?.getSigner()
	}

	async getAddress() {
		const signer = await this.getSigner()
		const address = await signer?.getAddress()
		return address
	}

	async getWeb3State() {
		const provider = this.provider

		const signer = await this.getSigner()
		const address = await this.getAddress()

		if (!provider || !address || !signer) return

		return { provider, address, signer }
	}

	async sendOTPCode() {}

	async connectWithToken(token: string, verifierId: string) {
		console.log({ token, verifierId })
		const web3authProvider = await this.authenticator.connect({
			verifier: 'castle-custom-verifier',
			verifierId,
			idToken: token,
		})

		if (!web3authProvider) throw 'Failed to connect to Web3Auth'

		this.authenticator.provider = web3authProvider

		const web3State = await this.getWeb3State()
		if (!web3State) throw new Error('Failed to get web3 state')

		return web3State
	}

	get provider() {
		if (!this.authenticator.provider) return

		return new ethers.providers.Web3Provider(
			this.authenticator.provider as ExternalProvider
		)
	}
}

export const Web3AuthClient = (
	typeof window === 'undefined' ? undefined : new Web3Auth()
) as Web3Auth
