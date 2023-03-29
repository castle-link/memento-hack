import { useEffect, MutableRefObject, useCallback, useRef } from 'react'

export const useOutsideClick = (
	ref: MutableRefObject<any>,
	callback: (event: Event) => void
) => {
	useEffect(
		() => {
			const listener = (event: Event) => {
				// Do nothing if clicking ref's element or descendent elements
				if (!ref.current || ref.current.contains(event.target)) {
					return
				}
				callback(event)
			}
			document.addEventListener('mousedown', listener)
			document.addEventListener('touchstart', listener)
			return () => {
				document.removeEventListener('mousedown', listener)
				document.removeEventListener('touchstart', listener)
			}
		},
		// Add ref and callback to effect dependencies
		// It's worth noting that because passed in callback is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap callback in useCallback before ...
		// ... passing it into this hook.
		[ref, callback]
	)
}

export default useOutsideClick
