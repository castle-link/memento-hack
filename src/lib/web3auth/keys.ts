import { ExternalProvider } from '@ethersproject/providers'
import fs from 'fs'
import { resolve } from 'path'
import crypto from 'crypto'
import * as jose from 'jose'
import { Web3Auth } from '@web3auth/node-sdk'
import { CHAIN_CONFIG } from '../../constants/chainConfig'
import { ethers } from 'ethers'

const KEY_ID = process.env.WEB3_AUTH_VERIFIER_KEY_ID

export class Verifier {
	private privateKey: crypto.KeyObject
	constructor() {
		const path = resolve('./src/lib/web3auth/privateKey.pem')
		const privateKeyBuffer = fs.readFileSync(path, { encoding: 'utf-8' })
		const encryptedPrivateKey = privateKeyBuffer.toString()

		this.privateKey = crypto.createPrivateKey({
			key: encryptedPrivateKey,
			format: 'pem',
			type: 'pkcs1',
			passphrase: process.env.WEB3_AUTH_VERIFIER_ENCRYPTION_PASSPHRASE,
		})
	}

	async createSignedJwt(payload: { sub: string }) {
		return new jose.SignJWT(payload)
			.setProtectedHeader({
				alg: 'RS256',
				kid: KEY_ID,
			})
			.setIssuedAt()
			.setIssuer('CastleVerifierClass')

			.setExpirationTime('5m')
			.sign(this.privateKey)
	}

	async getAddressForIdentifier(identifier: string) {
		const adminWeb3auth = new Web3Auth({
			clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // get from https://dashboard.web3auth.io
			web3AuthNetwork: process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK,
			chainConfig: CHAIN_CONFIG,
		})

		const adminToken = await this.createSignedJwt({
			sub: identifier,
		})

		adminWeb3auth.init()

		const web3authProvider = await adminWeb3auth.connect({
			verifier: 'castle-custom-verifier',
			verifierId: identifier,
			idToken: adminToken,
		})
		if (!web3authProvider) throw new Error('Failed to connect to Web3Auth')

		const provider = new ethers.providers.Web3Provider(
			web3authProvider as ExternalProvider
		)

		const signer = provider.getSigner()
		const address = await signer.getAddress()
		return address
	}

	async verifyJwt(jwt: string) {
		const JWKS = jose.createRemoteJWKSet(
			new URL(`${process.env.NEXT_PUBLIC_APP_URL}/.well-known/jwks.json`)
		)

		await new Promise((resolve) => setTimeout(resolve, 2000))

		const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
			issuer: 'CastleVerifierClass',
			algorithms: ['RS256'],
			maxTokenAge: 60 * 5,
		})

		return { payload, protectedHeader }
	}
}
