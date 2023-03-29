import { ArgTypes } from '@storybook/api'
import { FocusEvents } from './focus.proptypes'

const table = {
	category: 'Focus',
}

export const FocusEventsArgTypes: Record<keyof FocusEvents, ArgTypes> = {
	onFocus: { table },
	onBlur: { table },
}
