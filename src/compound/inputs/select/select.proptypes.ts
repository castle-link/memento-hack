import { ContainerProps } from '../../mixins/container/container.proptypes'
import { SpaceProps } from './../../mixins/spacing/spacing.proptypes'
import { StackeeProps } from './../../mixins/stackee/stackee.proptypes'

interface Option {
	value: string
	label: string
}

export interface SelectProps extends StackeeProps, SpaceProps, ContainerProps {
	options?: Option[]
	onSelect: (value: string) => void
	value?: string
	placeholder?: string
}
