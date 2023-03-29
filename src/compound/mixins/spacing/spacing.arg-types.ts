import { ArgTypes } from '@storybook/api'
import { SpaceProps } from './spacing.proptypes'

const table = {
	category: 'Spacing',
}

export const SpaceArgTypes: Record<keyof SpaceProps, ArgTypes> = {
	spacing: { table },
}
