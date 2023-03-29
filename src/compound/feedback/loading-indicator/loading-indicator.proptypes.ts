import { ContainerProps } from '../../mixins/container'

export interface LoadingIndicatorProps extends ContainerProps {
	ready?: boolean
	minHeight?: string
}
