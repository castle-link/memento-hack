import { BreakPoint } from './../../utils/breakpoints'
import { SpaceProps } from '../../mixins/spacing/spacing.proptypes'
import { StackeeProps } from './../../mixins/stackee/stackee.proptypes'
import { ContainerProps } from '../../mixins/container/container.proptypes'
import { CSSObject } from 'styled-components'

export interface DropdownItemProps {
	onClick: () => void
	text: string
}

type DropdownType = 'burger' | 'ellipses' | 'title' | 'search'

export interface DropdownProps
	extends ContainerProps,
		StackeeProps,
		SpaceProps {
	onClose: () => void
	onOpen: () => void
	open: boolean
	type: DropdownType | Record<BreakPoint, DropdownType>
	alignment?: 'left' | 'right'
	title?: string
	iconStyles?: CSSObject
	selectedFieldStyles?: CSSObject
	selectedFieldIcon?: 'arrow' | 'power'
	dropdownOffset?: number
}
