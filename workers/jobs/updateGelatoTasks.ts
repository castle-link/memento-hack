import { Transaction } from '@/models/Transaction/transaction.model'
import { connectDatabase } from '@/utils/connectDatabase'
import { Logger } from '@/utils/logger'
import { WORKERS_QUEUES } from '../constants'
import { createQueue } from '../createQueue'

export const updateGelatoTasksQueue = createQueue(
	WORKERS_QUEUES.UPDATE_GELATO_TASKS
)

const maxJobsPerWorker = 3

export function initialize() {
	updateGelatoTasksQueue.process(
		WORKERS_QUEUES.UPDATE_GELATO_TASKS,
		maxJobsPerWorker,
		async () => {
			Logger.info(`Starting worker: ${WORKERS_QUEUES.UPDATE_GELATO_TASKS}`)
			try {
				await connectDatabase()

				const response = await Transaction.getTransactionHashesForGelatoTasks()

				Logger.info(
					`Worker completed task: ${WORKERS_QUEUES.UPDATE_GELATO_TASKS}`
				)

				return Promise.resolve(response)
			} catch (error: any) {
				Logger.logError(
					error,
					`Error occurred during worker:  ${WORKERS_QUEUES.UPDATE_GELATO_TASKS}`
				)
				return Promise.reject(error)
			}
		}
	)
}
