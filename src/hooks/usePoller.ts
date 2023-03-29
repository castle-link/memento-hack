import { Logger } from '@/utils/logger'
import { useEffect, useRef } from 'react'

interface UsePollerProps {
	callback: () => void
	active: boolean
	interval?: number
	timeout?: number
}

export const usePoller = ({
	callback,
	active,
	interval = 1000 * 3,
	timeout,
}: UsePollerProps) => {
	const callbackRef = useRef(callback)

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	useEffect(() => {
		const poll = () => {
			callbackRef.current()
		}

		if (interval != null && active) {
			const pollerId = setInterval(poll, interval)

			if (timeout != null) {
				const timeoutId = setTimeout(() => {
					Logger.info('Polling timeout reached. Stopping poll')
					// hasTimedOutRef.current = true
					clearInterval(pollerId)
				}, timeout)

				return () => {
					clearInterval(pollerId)
					clearInterval(timeoutId)
				}
			}

			return () => {
				clearInterval(pollerId)
			}
		}
	}, [callback, active, interval, timeout])
}
