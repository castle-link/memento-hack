import { ArgTypes } from '@storybook/api'
import { ContainerProps } from './container.proptypes'

const table = {
	category: 'Container',
}

export const ContainerArgTypes: Record<keyof ContainerProps, ArgTypes> = {
	children: { table },
}
