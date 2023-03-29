import type { DomainError } from '@/lib/errors'
import type { SerializedError } from '@reduxjs/toolkit'
import { ServerLogger } from './server-logger'
import { WebLogger } from './web-logger'

class LoggerClass {
	logger: ServerLogger | WebLogger | null = null

	init() {
		console.log('initializing logger')
		this.logger =
			typeof window === 'undefined' ? new ServerLogger() : new WebLogger()
	}

	warn(message: string, messageContext?: Record<string, any>) {
		if (!this.logger) {
			console.warn(
				'Logger not initialized. Call "Logger.init()" before using the logger.'
			)
		}
		return this.logger?.warn(message, messageContext)
	}
	info(message: string, messageContext?: Record<string, any>) {
		if (!this.logger) {
			console.warn(
				'Logger not initialized. Call "Logger.init()" before using the logger.'
			)
		}
		return this.logger?.info(message, messageContext)
	}
	error(message: string, messageContext?: Record<string, any>) {
		if (!this.logger) {
			console.warn(
				'Logger not initialized. Call "Logger.init()" before using the logger.'
			)
		}
		return this.logger?.error(message, messageContext)
	}
	logError(
		error: Error | string | SerializedError | DomainError,
		message?: string,
		messageContext?: Record<string, any>
	) {
		if (!this.logger) {
			console.warn(
				'Logger not initialized. Call "Logger.init()" before using the logger.'
			)
		}
		return this.logger?.logError(error, message, messageContext)
	}
}

export const Logger = new LoggerClass()
