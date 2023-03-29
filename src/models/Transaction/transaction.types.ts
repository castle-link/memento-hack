import { HydratedDocument, Model } from 'mongoose'

export interface ITransaction {
	transactionType?: string
	transactionHash?: string
	executed?: boolean
	executedAt?: Date
	executionStatus: 'failed' | 'success'
	blockNumber: number | null
	updatedAt: Date
	from?: string
	to?: string
	value?: string
	gasPrice?: string
	gasLimit?: string
	data?: string
	gelatoTaskId?: string
}

export type TransactionDoc = HydratedDocument<ITransaction>
// Need to add the instance methods here once they are defined

export interface TransactionStatics {
	updateStatuses(args: {
		maxAgeMinutes: number
		frequencyMinutes: number
	}): Promise<{
		isStillNotExecuted: number
		wasUpdatedToExecuted: number
		failures: number
	}>
	getTransactionHashesForGelatoTasks(): void
}

export interface TransactionModel
	extends Model<TransactionDoc>,
		TransactionStatics {}

export interface TTransaction {
	_id: string
	transactionType?: string
	transactionHash?: string
	executed?: boolean
	executedAt?: Date
	executionStatus: 'failed' | 'success'
	blockNumber: number | null
	updatedAt: Date
	from?: string
	to?: string
	value?: string
	gasPrice?: string
	gasLimit?: string
	data?: string
}
