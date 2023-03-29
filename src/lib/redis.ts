import { Logger } from '@/utils/logger'

import RedisClient, { type RedisOptions } from 'ioredis'
import { isEqual, toNumber } from 'lodash'
import url from 'url'
import { RedisPool } from 'ioredis-conn-pool'
import { RequestTimeout } from './errors'

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24

export const REDIS_URL = process.env.REDIS_URL as string
const CONNECTION_TIMEOUT_WINDOW = 1000 * 2

let pool: RedisPool
const getPool = () => {
	if (pool) return pool
	try {
		console.info('Initializing Redis pool')
		pool = new RedisPool({
			redis: {
				...redisOptsFromUrl(REDIS_URL as string),
				maxRetriesPerRequest: 0,
			},
			pool: {
				min: 2,
				max: 10,
			},
		})
		return pool
	} catch (error: any) {
		Logger.logError(error, 'Error initializing redis client')
	}
}

interface SetOptions {
	expiry: number
}

class _Redis {
	enabled: boolean = true

	private _fetch =
		(redisClient?: RedisClient) =>
		async <T = any>(
			key: string,
			fetchFn: () => Promise<T>,
			options: { expiry?: number } = {}
		): Promise<T> => {
			if (redisClient?.status !== 'ready') {
				console.warn(
					'⚠️ Redis client not ready. Calling fetch function without cache'
				)
				return fetchFn()
			}

			console.info(`🔎 Searching for Redis value: ${key}`)
			const existingValue = await redisClient.get(key)
			if (existingValue) {
				console.info(`🎯 Found redis value for: ${key}`)
				return JSON.parse(existingValue)
			} else {
				console.info(`🆕 No redis value found for redis key: ${key}`)
				const newValue = await fetchFn()

				if (
					typeof newValue === 'undefined' ||
					!isEqual(newValue, JSON.parse(JSON.stringify(newValue)))
				) {
					Logger.warn(
						`Return value is not serializable. Skipping Redis storage for ${key}`
					)
					return newValue
				}

				console.info(`✅ Storing new value for redis key: ${key}`)

				redisClient.set(
					key,
					JSON.stringify(newValue),
					'EX',
					options.expiry || DEFAULT_EXPIRY_SECONDS
				)
				return newValue
			}
		}

	fetch = this.withPooledClient(this._fetch)

	private _set =
		(redisClient?: RedisClient) =>
		async (key: string, payload: any, options: SetOptions) => {
			if (redisClient?.status !== 'ready') {
				Logger.error('Called set when redis client is not ready')
				throw new Error('Called set when redis client is not ready')
			}

			const serializedPayload = JSON.stringify(payload)
			if (!isEqual(payload, JSON.parse(serializedPayload))) {
				throw new Error('Set value not serializable')
			}

			return redisClient.set(
				key,
				serializedPayload,
				'EX',
				options.expiry || DEFAULT_EXPIRY_SECONDS
			)
		}

	set = this.withPooledClient(this._set)

	private _get = (redisClient?: RedisClient) => async (key: string) => {
		if (redisClient?.status !== 'ready') {
			Logger.error('Called set when redis client is not ready')
			throw new Error('Called set when redis client is not ready')
		}

		return redisClient.get(key)
	}

	get = this.withPooledClient(this._get)

	private withPooledClient<
		FuncReturnType extends any,
		FuncType extends (...a: any[]) => Promise<FuncReturnType>
	>(fn: (a?: RedisClient) => FuncType): FuncType {
		const funcWithClient = (async (...args: any[]): Promise<FuncReturnType> => {
			if (!this.enabled) {
				console.warn(
					'⚠️ Redis client disabled. Calling function without redis cache'
				)
				const response: FuncReturnType = await fn(undefined)(...args)
				return response
			}

			let timeoutId
			const timeOutPromise = new Promise((_, reject) => {
				timeoutId = setTimeout(() => {
					reject(new RequestTimeout())
				}, CONNECTION_TIMEOUT_WINDOW)
			})

			let client: RedisClient | undefined = undefined
			try {
				try {
					client = await Promise.race([
						getPool()?.getConnection(),
						timeOutPromise,
					])
					clearTimeout(timeoutId)
				} catch (error: any) {
					clearTimeout(timeoutId)
					Logger.logError(error, '⚠️ Error fetching Redis client')
					this.enabled = false
					const response: FuncReturnType = await fn(undefined)(...args)
					return response
				}

				const response: FuncReturnType = await fn(client)(...args)
				return response
			} finally {
				if (client) {
					console.info('💥 Releasing redis client')
					await pool.release(client)
				}
			}
		}) as FuncType

		return funcWithClient
	}
}

function redisOptsFromUrl(urlString: string) {
	let redisOpts: RedisOptions = {}
	try {
		const redisUrl = url.parse(urlString, true, true)
		redisOpts.port = parseInt(redisUrl.port || '6379', 10)
		redisOpts.host = redisUrl.hostname ?? undefined
		redisOpts.db = redisUrl.pathname
			? toNumber(redisUrl.pathname.split('/')[1])
			: 0
		if (redisUrl.auth) {
			const columnIndex = redisUrl.auth.indexOf(':')
			redisOpts.password = redisUrl.auth.slice(columnIndex + 1)
			if (columnIndex > 0) {
				redisOpts.username = redisUrl.auth.slice(0, columnIndex)
			}
		}

		if (redisUrl.query) {
			redisOpts = { ...redisOpts, ...redisUrl.query }
		}
	} catch (e: any) {
		Logger.logError('Error fetching redis options')
		throw new Error(e.message)
	}
	return redisOpts
}

export const Redis = new _Redis()
