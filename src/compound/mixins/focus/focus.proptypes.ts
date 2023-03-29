import { FocusEvent } from 'react'
export interface FocusStateOptions {
	baseTransition?: boolean
	hoverTransition?: boolean
	activeTransition?: boolean
	pointerCursor?: boolean
}
export interface FocusEvents<ElementType = HTMLInputElement> {
	onFocus?: (a: FocusEvent<ElementType>) => void
	onBlur?: (a: FocusEvent<ElementType>) => void
}
