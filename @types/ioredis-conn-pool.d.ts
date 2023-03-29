declare module 'ioredis-conn-pool' {
	import type { RedisOptions } from 'ioredis'

	interface PoolOptions {
		min: number
		max: number
	}
	export class RedisPool {
		constructor({ redis: RedisOptions, pool: PoolOptions }): void
		getConnection(priority?: number): Promise<RedisClient>
		release(client: RedisClient): Promise<void>
		disconnect(client: RedisClient): Promise<void>
		end(): Promise<void>
	}
}
