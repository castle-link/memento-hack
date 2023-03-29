import type { DomainError } from '@/lib/errors'
import type { SerializedError } from '@reduxjs/toolkit'
import type { Logger } from 'winston'

const getHttpTransportOptions = ({ service }: { service: string }) => ({
	port: 443,
	host: 'http-intake.logs.us3.datadoghq.com',
	path: `/api/v2/logs?dd-api-key=${process.env.NEXT_PUBLIC_DATADOG_API_KEY}&ddsource=nodejs&service=${service}&ddtags=env:${process.env.NEXT_PUBLIC_APP_ENV}`,
	ssl: true,
	emitErrs: true,
})

export class ServerLogger {
	private logger?: Logger
	private isInitialized = false

	private context: Record<string, any> = {}
	private configOptions: { service: string } = {
		service: 'memento-app-server',
	}

	config = ({ service }: { service: string }) => {
		this.configOptions = { service }
		this.initiallize()
	}

	private initiallize() {
		// console.warn('server logging not implemented yet')
		console.log('Initializing server logger')
		return
		try {
			// const { createLogger, format, transports } = require("winston");
			// this.logger = createLogger({
			//   exitOnError: false,
			//   format: format.json(),
			//   transports: [
			//     new transports.Console({
			//       silent: false,
			//       format: format.combine(
			//         format.colorize(),
			//         format.prettyPrint({ colorize: true }),
			//         format.simple()
			//       ),
			//     }),
			//     new transports.Http(getHttpTransportOptions(this.configOptions)),
			//   ],
			// });
			// this.isInitialized = true;
		} catch (e: any) {}
	}

	setContext = (_context: Record<string, any>) => {
		this.context = _context
	}

	error = (message: string, messageContext?: Record<string, any>) => {
		console.error(message)
		// console.warn('server logging not implemented yet')
		return
		;(this.logger as Logger).error(message, {
			...this.context,
			...messageContext,
		})
	}

	logError = (
		error: Error | string | SerializedError | DomainError,
		message?: string,
		messageContext?: Record<string, any>
	) => {
		console.error(error, { message, ...messageContext })
		// console.warn('server logging not implemented yet')
		return
		// const errorMessage =
		//   (typeof error === "object" ? error.message : error) ||
		//   "An error occurred";
		// const logMessage = message || errorMessage;
		// const stack =
		//   typeof error === "object" && "stack" in error ? error.stack : null;
		// const name =
		//   typeof error === "object" && "name" in error ? error.name : null;
		// const code =
		//   typeof error === "object" && "code" in error ? error.code : null;
		// const details =
		//   typeof error === "object" && "details" in error
		//     ? { details: error.details }
		//     : {};

		// this.error(logMessage, {
		//   error: errorMessage,
		//   stack,
		//   name,
		//   code,
		//   ...details,
		//   ...messageContext,
		// });
	}

	info = (message: string, messageContext?: Record<string, any>) => {
		// console.warn('server logging not implemented yet')
		console.log(message)
		return
		if (!this.isInitialized) this.initiallize()
		;(this.logger as Logger).info(message, {
			...this.context,
			...messageContext,
		})
	}

	warn = (message: string, messageContext?: Record<string, any>) => {
		// console.warn('server logging not implemented yet')
		console.warn(message)
		return
		if (!this.isInitialized) this.initiallize()
		;(this.logger as Logger).warn(message, {
			...this.context,
			...messageContext,
		})
	}
}
