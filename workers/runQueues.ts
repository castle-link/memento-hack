import { Queue } from 'bull'
import throng from 'throng'
import { loadEnvConfig } from '@next/env'
import { resolve } from 'path'

const rootDir = resolve('.')
loadEnvConfig(rootDir)

import { WORKERS_QUEUES } from './constants'
import {
	initialize as initializeUpdateTransactionsWorker,
	updateTransactionsQueue,
} from './jobs/updateTransactions'
import {
	initialize as initializeUpdateGelatoTasksWorker,
	updateGelatoTasksQueue,
} from './jobs/updateGelatoTasks'

import { Logger } from '@/utils/logger'

// Fetch isn't defined be default in this runtime enviroment so
// we need to define it here
globalThis.fetch = fetch

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 1
Logger.init()
// Logger.config({ service: 'memento-workers' }) // Note: Add config to Logger class

function start() {
	Logger.info('Initializing workers')
	initializeUpdateTransactionsWorker()
	initializeUpdateGelatoTasksWorker()
}

const removeRepeatableJobs = async (queue: Queue) => {
	const repeatables = await queue.getRepeatableJobs()

	Logger.info(`Removing old repeatable jobs for ${queue.name}`)
	await Promise.all(
		repeatables.map(({ key }) => queue.removeRepeatableByKey(key))
	)
}

;(async () => {
	// Initialize the clustered worker process
	// See: https://devcenter.heroku.com/articles/node-concurrency for more info

	await throng({ workers, start })

	await removeRepeatableJobs(updateTransactionsQueue)
	await removeRepeatableJobs(updateGelatoTasksQueue)

	// make sure to run jobs on only one instance per db enviroment
	if (
		['prod', 'development', 'experimental'].includes(
			process.env.NEXT_PUBLIC_APP_ENV as string
		)
	) {
		Logger.info('Kicking off repeatable jobs')

		await updateTransactionsQueue.add(
			WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES,
			{ frequencyMinutes: 15, maxAgeMinutes: 60 * 24 * 7 },
			{
				repeat: { every: 1000 * 60 * 15 },
				jobId: 'updateOlderTransactionStatusesRecurringly',
			}
		)

		await updateTransactionsQueue.add(
			WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES,
			{ frequencyMinutes: 5, maxAgeMinutes: 30 },
			{
				repeat: { every: 1000 * 60 * 5 },
				jobId: 'updateRecentTransactionStatusesRecurringly',
			}
		)

		await updateTransactionsQueue.add(
			WORKERS_QUEUES.UPDATE_TRANSACTION_STATUSES,
			{ frequencyMinutes: 0.5, maxAgeMinutes: 10 },
			{
				repeat: { every: 1000 * 30 },
				jobId: 'updateNewTransactionStatusesRecurringly',
			}
		)

		await updateGelatoTasksQueue.add(
			WORKERS_QUEUES.UPDATE_GELATO_TASKS,
			{ frequencyMinutes: 15, maxAgeMinutes: 60 * 24 * 7 },
			{
				repeat: { every: 1000 * 60 * 15 },
				jobId: 'updateOlderGelatoTasksRecurringly',
			}
		)

		await updateGelatoTasksQueue.add(
			WORKERS_QUEUES.UPDATE_GELATO_TASKS,
			{ frequencyMinutes: 5, maxAgeMinutes: 30 },
			{
				repeat: { every: 1000 * 60 * 5 },
				jobId: 'updateRecentGelatoTasksRecurringly',
			}
		)

		await updateGelatoTasksQueue.add(
			WORKERS_QUEUES.UPDATE_GELATO_TASKS,
			{ frequencyMinutes: 0.5, maxAgeMinutes: 10 },
			{
				repeat: { every: 1000 * 30 },
				jobId: 'updateNewGelatoTasksRecurringly',
			}
		)
	} else {
		Logger.info(
			`Skipping reapeatable jobs for ${process.env.NEXT_PUBLIC_APP_ENV} env`
		)
	}
})()
