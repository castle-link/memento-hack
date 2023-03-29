import { ContainerProps } from '../../mixins/container'
import { SpaceProps } from '../../mixins/spacing'
import { StackerProps } from '../../mixins/stacker'

export type ModalBreakpoints = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalProps extends SpaceProps, StackerProps, ContainerProps {
	open: boolean
	onClose: () => void
	headerText?: string
	hideHeader?: boolean
	size?: 'sm' | 'md' | 'lg' | 'xl'
	title?: string
}
