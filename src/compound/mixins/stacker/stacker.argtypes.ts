import { ArgTypes } from '@storybook/api'
import { StackerProps } from './stacker.proptypes'

const table = {
	category: 'Stacked',
}

export const StackerArgTypes: Record<keyof StackerProps, ArgTypes> = {
	stacked: { table },
	justify: { table },
	align: { table },
	wrap: { table },
	gap: { table },
}
