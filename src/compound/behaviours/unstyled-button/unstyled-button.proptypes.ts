import { ContainerProps } from '../../mixins/container'
import { FocusEvents } from '../../mixins/focus'
import { SpaceProps } from '../../mixins/spacing/spacing.proptypes'
import { StackerProps } from '../../mixins/stacker/stacker.proptypes'
import { StackeeProps } from '../../mixins/stackee/stackee.proptypes'

import { SyntheticEvent, FocusEvent, KeyboardEvent } from 'react'

export interface UnstyledButtonProps
	extends ContainerProps,
		FocusEvents,
		SpaceProps,
		StackerProps,
		StackeeProps {
	type?: 'submit' | 'button'
	onClick?: (event: SyntheticEvent<HTMLElement>) => void
	onMouseEnter?: (a: FocusEvent<unknown>) => void
	onMouseLeave?: (a: FocusEvent<unknown>) => void
	onKeyDown?: (a: KeyboardEvent<any>) => void
	onFocus?: (a: FocusEvent<HTMLElement>) => void
	onBlur?: (a: FocusEvent<HTMLElement>) => void
	href?: string
	target?: string
	disabled?: boolean
	hasTransition?: boolean
	insetFocus?: boolean
	className?: string
}
