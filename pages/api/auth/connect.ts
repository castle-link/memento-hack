import { User, UserDoc } from '@/models/User'
import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import { WalletProviderArgs } from '@/types'
import { getMagicAdminSdk } from '@/lib/magic'
import { createDeployWalletTx, getDeploymentAddress } from '@/lib/safe'
import { checkDeployed, sendTransaction } from '@/lib/blockchain'
import Cookies from 'cookies'
import { REFRESH_TOKEN_EXPIRY_MINUTES } from '@/models/User/user.constants'
import connectDatabase from '@/utils/connectDatabase'
import { Verifier } from '@/lib/web3auth/keys'
import { Transaction } from '@/models/Transaction/transaction.model'
import { handleSponsorTransaction } from '@/lib/gelato'
import { CHAIN_CONFIG } from '@/constants/chainConfig'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {
		signedMessage,
		address,
		providerApplication,
		providerIdentifier,
		providerMethod,
	} = req.body as {
		signedMessage: string
		address: string
	} & WalletProviderArgs

	if (typeof address !== 'string') {
		return res.status(400).json({ message: 'Bad request' })
	}
	if (typeof signedMessage !== 'string') {
		return res.status(400).json({ message: 'Bad request' })
	}

	await connectDatabase()

	try {
		switch (req.method) {
			case 'POST': {
				// Get verified wallet address
				console.log('checking which address signed the message')
				const verifiedAddress = ethers.utils.verifyMessage(
					'Connect to Memento',
					signedMessage
				)

				console.log({ verifiedAddress })

				console.log('ensiuring that the signer and the requester are a match')
				// Check if verified wallet address matches one that is passed in
				if (address.toLowerCase() !== verifiedAddress.toLowerCase()) {
					return res.status(400).json({
						error: 'Wallet address could not be verified',
					})
				}

				console.log('looking up user')
				let user: UserDoc

				console.log({ verifiedAddress })
				console.log('looking up user insensitively')
				const foundUser =
					(await User.findByAddress(verifiedAddress)) ||
					(providerIdentifier
						? await User.findByEmail(providerIdentifier)
						: null)

				if (foundUser) {
					console.log('user found. returning found user')
					user = foundUser
				} else {
					console.log('user not found creating new user')
					const createdUser: UserDoc = await User.create({
						eoa: verifiedAddress,
						eoaCreated: true,
					})

					user = createdUser
				}

				console.log({ user })

				// Add and verify email if not yet added or verified
				if (
					(providerMethod === 'emailOtp' ||
						providerMethod === 'emailMagicLink' ||
						providerApplication === 'safeAuthKit') &&
					(!user.email || !user.emailVerified)
				) {
					console.log('verifying email')
					if (!providerIdentifier)
						return res.status(400).json({ message: 'Bad request' })

					let verifiedEmail: string | undefined | null = undefined

					if (providerApplication === 'magic') {
						console.log('checking magic for email associated with address')
						const magicUserMetadata =
							await getMagicAdminSdk().users.getMetadataByPublicAddress(
								verifiedAddress
							)

						verifiedEmail = magicUserMetadata.email

						if (
							verifiedEmail?.toLowerCase() !== providerIdentifier?.toLowerCase()
						) {
							console.error(
								'email provider by user doesnt match email registered with wallet'
							)
							return res.status(401).json({
								error: 'Unauthorized',
							})
						}
					} else if (providerApplication === 'web3auth') {
						console.log('checking web3 auth for address associated with email')
						const verifier = new Verifier()

						const web3AuthWalletAddress =
							await verifier.getAddressForIdentifier(providerIdentifier)

						console.log({ web3AuthWalletAddress, verifiedAddress })

						if (
							web3AuthWalletAddress.toLowerCase() ===
							verifiedAddress.toLowerCase()
						) {
							verifiedEmail = providerIdentifier
						} else {
							console.error(
								'email provider by user doesnt match email registered with wallet'
							)
							return res.status(401).json({
								error: "Identifier doesn't match address on signed message",
							})
						}
					} else if (providerApplication === 'safeAuthKit') {
						// Safe auth kit doesnt provide a way for us to know the email address
						// associated with the wallet. So we just have to trust that the email the user
						// gave us is the same email they gave to web3auth for now

						verifiedEmail = providerIdentifier
					}

					if (!verifiedEmail) {
						console.error('not verified email found')
						return res.status(401).json({
							error: 'Unauthorized',
						})
					}

					console.log({ verifiedEmail, user })

					console.log('email verified updated user')

					console.log('clearing any other users with this email')
					await User.deleteMany({
						email: verifiedEmail,
						_id: { $ne: user._id },
					})

					await user.update({
						email: verifiedEmail,
						emailVerfied: true,
					})
				}

				if (!user.multiSigCreated) {
					const deploymentAddress = await getDeploymentAddress(
						user.salt,
						CHAIN_CONFIG.rpcTarget
					)

					const deployed = await checkDeployed(
						CHAIN_CONFIG.rpcTarget,
						deploymentAddress
					)

					if (!deployed) {
						const tx = await createDeployWalletTx(user.salt)

						const relayResponse = await handleSponsorTransaction(
							tx.to,
							tx.data,
							84531,
							process.env.GELATO_API_KEY
						)

						await Transaction.findOneAndUpdate({
							transactionType: 'createWallet',
							to: tx.to,
							value: tx.value,
							data: tx.data,
							gelatoTaskId: relayResponse?.taskId,
						})

						await user.update({
							multiSig: deploymentAddress,
							multiSigCreated: true,
						})
					}
				}

				// Create access and refresh tokens
				const { accessToken, accessTokenExpiry } =
					await user.createAccessToken()
				const { refreshToken } = await user.createRefreshToken()

				const cookies = new Cookies(req, res)

				cookies.set('refreshToken', refreshToken, {
					maxAge: REFRESH_TOKEN_EXPIRY_MINUTES * 60 * 1000, // convert from minute to milliseconds
					httpOnly: true,
					path: '/',
					secure: false,
				})

				cookies.set('refreshAvailable', 'true', {
					maxAge: REFRESH_TOKEN_EXPIRY_MINUTES * 60 * 1000,
					httpOnly: false,
					path: '/',
					secure: false,
				})

				return res.status(200).json({
					user: user.toJSON(),
					accessToken,
					accessTokenExpiry,
				})
			}
			default: {
				return res.status(405).json({ message: 'Method not allowed' })
			}
		}
	} catch (e: any) {
		console.log(e.message)
		return res.status(500).json({ message: e.message })
	}
}
