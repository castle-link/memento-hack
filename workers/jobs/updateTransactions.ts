import { Transaction } from '@/models/Transaction/transaction.model'
import { connectDatabase } from '@/utils/connectDatabase'
import { Logger } from '@/utils/logger'
import { WORKERS_QUEUES } from '../constants'
import { createQueue } from '../createQueue'

export const updateTransactionsQueue = createQueue<{
	maxAgeMinutes: number
	frequencyMinutes: number
}>(WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES)

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 3

export function initialize() {
	updateTransactionsQueue.process(
		WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES,
		maxJobsPerWorker,
		async ({ data: { maxAgeMinutes, frequencyMinutes } }) => {
			Logger.info(
				`Starting worker: ${WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES}`
			)
			try {
				await connectDatabase()

				const response = await Transaction.updateStatuses({
					maxAgeMinutes,
					frequencyMinutes,
				})

				Logger.info(
					`Worker completed task: ${WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES}`
				)

				return Promise.resolve(response)
			} catch (error: any) {
				Logger.logError(
					error,
					`Error occurred during worker:  ${WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES}`
				)
				return Promise.reject(error)
			}
		}
	)
}
