import mongoose from 'mongoose'
import moment from 'moment'
import { ethers } from 'ethers'
import { PromisePool } from '@supercharge/promise-pool'
import { dateFromBlock } from '@/lib/ethDater'
import { getAlchemyProvider } from '@/lib/alchemy'

// Types
import { TransactionDoc, TransactionModel } from './transaction.types'
import { TransactionStatics } from './transaction.types'

// Logger
import { Logger } from '@/utils/logger'
import { getTaskStatus } from '@/lib/gelato'
import { Memento } from '../Memento'

const TransactionSchema = new mongoose.Schema<TransactionDoc, TransactionModel>(
	{
		transactionType: { type: String },
		transactionHash: { type: String },
		executed: { type: Boolean, default: false },
		executedAt: { type: Date },
		executionStatus: { type: String },
		blockNumber: { type: Number },
		updatedAt: { type: Date },
		from: {
			type: String,
			set: (address?: string) => address && ethers.utils.getAddress(address),
			index: true,
		},
		to: {
			type: String,
			set: (address?: string) => address && ethers.utils.getAddress(address),
		},
		value: { type: String },
		gasPrice: { type: String },
		gasLimit: { type: String },
		data: { type: String },
		gelatoTaskId: { type: String },
	}
)

TransactionSchema.statics.getTransactionHashesForGelatoTasks = async function (
	this: TransactionModel
) {
	Logger.info('Getting transaction hashes from gelato tasks')
	const allTransactionsWithGelatoTaskIdAndWithoutTransactionHashes =
		await this.find({
			$and: [
				{ gelatoTaskId: { $exists: true, $ne: null } },
				{ transactionHash: { $exists: false } },
			],
		})

	Logger.info(
		`Found ${allTransactionsWithGelatoTaskIdAndWithoutTransactionHashes.length} transactions with gelato task id and without transaction hashes`
	)

	await PromisePool.withConcurrency(3)
		.for(allTransactionsWithGelatoTaskIdAndWithoutTransactionHashes)
		.process(async (transaction) => {
			Logger.info(
				`Updating tx status for gelato task ${transaction.gelatoTaskId}`
			)
			if (transaction.gelatoTaskId) {
				const gelatoTask = await getTaskStatus(
					transaction.gelatoTaskId,
					process.env.GELATO_API_KEY
				)
				if (gelatoTask?.transactionHash) {
					Logger.info(
						`Transaction hash found for gelato task ${transaction.gelatoTaskId}. Updating tx record `
					)
					await this.findOneAndUpdate(
						{
							_id: transaction._id,
						},
						{
							transactionHash: gelatoTask.transactionHash,
						}
					)
					await Memento.findOneAndUpdate(
						{
							gelatoTaskId: transaction.gelatoTaskId,
						},
						{ transactionHash: gelatoTask.transactionHash }
					)
				} else {
					Logger.info(
						`Transaction hash not ready for gelato task ${transaction.gelatoTaskId}`
					)
				}
			}
		})
}

TransactionSchema.statics.updateStatuses = async function (
	this: TransactionModel,
	{
		maxAgeMinutes,
		frequencyMinutes,
	}: Parameters<TransactionStatics['updateStatuses']>['0']
) {
	Logger.info('Updating transaction statuses')

	const allUnexecutedTransactions = await this.find({
		$and: [
			{
				$or: [
					{ executed: { $exists: false } },
					{ executed: { $eq: false } },
					{ blockNumber: { $exists: false } },
					{ blockNumber: { $eq: null } },
					{ executionStatus: { $eq: null } },
				],
			},
			{
				$or: [
					{ safeTxHash: { $exists: true, $ne: null } },
					{ transactionHash: { $exists: true, $ne: null } },
				],
			},
			{
				$or: [
					{
						updatedAt: {
							$lt: moment().subtract(frequencyMinutes, 'minutes').toDate(),
						},
					},
					{ updatedAt: { $exists: false } },
				],
			},
			{
				$expr: {
					$gte: [
						{ $toDate: '$_id' },
						moment().subtract(maxAgeMinutes, 'minutes').toDate(),
					],
				},
			},
		],
	})

	Logger.info(`Found ${allUnexecutedTransactions.length} requiring execution`)

	const wasUpdatedToExecuted: string[] = []
	const isStillNotExecuted: string[] = []
	const failures: string[] = []

	await PromisePool.withConcurrency(5)
		.for(allUnexecutedTransactions)
		.process(async (transaction) => {
			try {
				Logger.info(`Updating statuses for ${transaction._id}`, {
					executed: transaction.executed,
				})

				let transactionHash: string,
					isExecuted: boolean,
					executedAt: Date | undefined,
					blockNumber: number | undefined,
					executionStatus: 'success' | 'failed'

				const blockchainTransaction =
					// Need to create a new provider that handles base rpcs
					await getAlchemyProvider().getTransactionReceipt(
						transaction.transactionHash as string
					)
				transactionHash = transaction.transactionHash as string
				isExecuted = true
				blockNumber = blockchainTransaction.blockNumber
				executedAt =
					blockNumber && blockNumber > 0
						? await dateFromBlock(blockNumber)
						: undefined

				if (blockchainTransaction.status === 1) {
					executionStatus = 'success'
				} else if (blockchainTransaction.status === 0) {
					executionStatus = 'failed'
				}

				if (isExecuted && blockNumber) {
					await this.findOneAndUpdate(
						{ _id: transaction._id },
						{
							transactionHash,
							blockNumber,
							executed: true,
							updatedAt: new Date(),
							executedAt,
						},
						{ new: true, runValidators: true }
					)

					wasUpdatedToExecuted.push(transaction._id.toString())
				} else {
					await this.findOneAndUpdate(
						{ _id: transaction._id },
						{ updatedAt: new Date() },
						{ new: true, runValidators: true }
					)
					isStillNotExecuted.push(transaction._id.toString())
				}
			} catch (error: any) {
				console.error(error)
				const errorMessage = typeof error === 'object' ? error.message : error
				Logger.error(`Error while updating transaction status`, {
					error: errorMessage,
					transactionId: transaction._id,
				})
				failures.push(transaction._id.toString())
			}
		})

	Logger.info('Finished updating transaction values', {
		wasUpdatedToExecuted: wasUpdatedToExecuted.length,
		isStillNotExecuted: isStillNotExecuted.length,
		failures: failures.length,
	})

	return { wasUpdatedToExecuted, isStillNotExecuted, failures }
}

export const Transaction = (mongoose.models.Transaction ||
	mongoose.model('Transaction', TransactionSchema)) as TransactionModel
