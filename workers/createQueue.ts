import { REDIS_URL } from '@/lib/redis'
import Redis, { RedisOptions } from 'ioredis'
import Queue, { QueueOptions } from 'bull'

let client: Redis
let subscriber: Redis

const DEFAULT_OPTIONS: QueueOptions = {
	defaultJobOptions: {
		removeOnComplete: {
			age: 60 * 24 * 7, // Keep jobs for 7 days
		},
	},
}

// redisOpts here will contain at least a property of connectionName which will identify the queue based on its name
function createClient(type: string, redisOpts: RedisOptions) {
	switch (type) {
		case 'client':
			if (!client) {
				client = new Redis(REDIS_URL, redisOpts)
			}
			return client
		case 'subscriber':
			if (!subscriber) {
				subscriber = new Redis(REDIS_URL, {
					...redisOpts,
					maxRetriesPerRequest: null,
					enableReadyCheck: false,
				})
			}
			return subscriber
		case 'bclient':
			return new Redis(REDIS_URL, {
				...redisOpts,
				maxRetriesPerRequest: null,
				enableReadyCheck: false,
			})
		default:
			throw new Error(`Unexpected connection type: ${type}`)
	}
}

export const createQueue = <T = any>(
	name: string,
	options: QueueOptions = {}
) => new Queue<T>(name, { ...options, ...DEFAULT_OPTIONS, createClient })
