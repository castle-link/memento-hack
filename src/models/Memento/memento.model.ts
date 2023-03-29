import {
	MEMENTO_FACTORY_WITH_MAX_SUPPLY,
	MEMENTO_FACTORY_WITH_END_TIME,
	MEMENTO_MULTISEND,
	MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME,
} from './../../constants/addresses'
import { MEMENTO_ABI, MEMENTO_MULTISEND_ABI } from './../../constants/abis'
import { getInterface, sendTransaction } from '@/lib/blockchain'
import mongoose from 'mongoose'
import type {
	DecoratedMemento,
	MementoDoc,
	MementoMethods,
	MementoModel,
} from './memento.types'
import type {
	TransactionDoc,
	TransactionModel,
} from '../Transaction/transaction.types'
import type { ClaimModel } from '../Claim'
import { ethers, providers } from 'ethers'
import { MEMENTO_FACTORY } from '@/constants/addresses'
import { UserDoc } from '../User'
import { getDeploymentAddress } from '@/lib/safe'
import { CHAIN_CONFIG } from '@/constants/chainConfig'
import { FEATURE_CONFIG } from '@/lib/features'
import { handleSponsorTransaction } from '@/lib/gelato'

const MementoSchema = new mongoose.Schema<MementoDoc, MementoModel>(
	{
		metadata: {
			// Need to update this later (name, description, image or media (check), external_url, and attributes)
			mediaUrl: { type: String },
			title: { type: String },
			description: { type: String },
		},
		name: { type: String, required: true },
		symbol: { type: String },
		editionSize: { type: Number, default: null },
		editions: { type: String },
		startDate: { type: Date },
		endDate: { type: Date },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		transactionHash: { type: String },
		address: { type: String },
		slug: { type: String, unique: true, required: true },
		snapshotUrl: { type: String },
		gelatoTaskId: { type: String },
		productId: { type: String },
	},
	{
		timestamps: true,
	}
)

const methods: MementoMethods = {
	createClaim: async function ({ user, checkoutSessionId }) {
		console.log('creating claim')
		if (!user.eoa && !user.multiSig && !user.email) {
			throw new Error('User does not have anything to send claim to')
		}
		const mintAddress =
			user?.email && user?.multiSig
				? user?.multiSig
				: user?.eoa
				? user?.eoa
				: await getDeploymentAddress(user?.salt, CHAIN_CONFIG.rpcTarget)

		// Otherwise, time to send the memento
		const tokenInterface = getInterface(MEMENTO_ABI)

		let transaction: TransactionDoc | null = null
		if (this.address) {
			const data = tokenInterface.encodeFunctionData('mint', [mintAddress])

			if (FEATURE_CONFIG.transactionRelayEnabled) {
				console.log('creating claim with relayer')
				const multisendInterface = getInterface(MEMENTO_MULTISEND_ABI)
				const multisendData = multisendInterface.encodeFunctionData(
					'multisend',
					[[[this.address, 0, data]]]
				)
				const relayResponse = await handleSponsorTransaction(
					MEMENTO_MULTISEND,
					multisendData,
					84531,
					process.env.GELATO_API_KEY
				)

				transaction = await (
					mongoose.models.Transaction as TransactionModel
				).findOneAndUpdate(
					{ gelatoTaskId: relayResponse?.taskId },
					{
						transactionType: 'claimMemento',
						to: MEMENTO_MULTISEND,
						value: 0,
						data: multisendData,
					},
					{ upsert: true, returnDocument: 'after' }
				)
			} else {
				console.log('creating claim without gelato relayer')
				const tx = await sendTransaction(
					{
						to: this.address,
						data,
					},
					process.env.PRIVATE_KEY as string,
					CHAIN_CONFIG.rpcTarget
				)

				transaction = await (
					mongoose.models.Transaction as TransactionModel
				).findOneAndUpdate(
					{ transactionHash: tx.hash },
					{
						transactionHash: tx.hash,
						transactionType: 'claimMemento',
						from: process.env.PUBLIC_ADDRESS,
						to: tx.to,
						value: tx.value,
						data: tx.data,
					},
					{ upsert: true, returnDocument: 'after' }
				)
			}
		} else {
			console.error('Memento does not have an address, skipping mint')
		}

		const claim = await (mongoose.models.Claim as ClaimModel).create({
			user: user._id,
			memento: this._id,
			checkoutSessionId,
			transaction: transaction?._id ?? null,
		})

		return { claim }
	},
	fetchDecorated: async function () {
		const claimed = await (mongoose.models.Claim as ClaimModel).countDocuments({
			memento: this._id,
		})
		const provider = new providers.JsonRpcProvider(CHAIN_CONFIG.rpcTarget)

		let status: 'pending' | 'minted'
		let address: string | null = null
		let memento: MementoDoc = this

		const owner = (await mongoose.models.User.findById(
			this.user
		)) as UserDoc | null
		if (!owner) throw new Error('Memento missing owner not found')

		if (!memento.address) {
			const transactionHash = memento.transactionHash
			console.log({ transactionHash })
			const tx = await provider.getTransactionReceipt(transactionHash as string)
			if (tx) {
				const event = tx.logs.filter(
					(log) =>
						ethers.utils.getAddress(log.address) ===
							ethers.utils.getAddress(MEMENTO_FACTORY) ||
						ethers.utils.getAddress(log.address) ===
							ethers.utils.getAddress(MEMENTO_FACTORY_WITH_MAX_SUPPLY) ||
						ethers.utils.getAddress(log.address) ===
							ethers.utils.getAddress(MEMENTO_FACTORY_WITH_END_TIME) ||
						ethers.utils.getAddress(log.address) ===
							ethers.utils.getAddress(
								MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME
							)
				)
				if (event[0]?.topics[2]) {
					address = ethers.BigNumber.from(event[0].topics[2])._hex
					const updatedMemento = await memento.update(
						{ address },
						{ returnDocument: 'after' }
					)

					if (updatedMemento) {
						memento = updatedMemento
					}

					status = 'minted'
				} else {
					// Address not ready yet, collection creation in progress
					status = 'pending'
				}
			} else {
				status = 'pending'
			}
		} else {
			status = 'minted'
		}

		console.log({ toJson: memento.toJSON })
		return { ...memento.toJSON?.(), claimed, status } as DecoratedMemento
	},
}
MementoSchema.methods = methods

export const Memento = (mongoose.models.Memento ||
	mongoose.model('Memento', MementoSchema)) as MementoModel

export default Memento
