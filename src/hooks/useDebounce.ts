import { useEffect, useState } from 'react'

export const useDebounce = (value: string | undefined, delay: number = 500) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler: NodeJS.Timeout = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		// Cancel the timeout if value changes (also on delay change or unmount)
		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}
