import { useState } from 'react'
import { Select, Option } from './select.component'

export default {
	component: Select,
	title: 'Inputs/Select',
}

const OPTIONS = [
	{
		label: 'Option 1',
		value: '1',
	},
	{
		label: 'Option 2',
		value: '2',
	},
	{
		label: 'Option 3',
		value: '3',
	},
]

export const Default = () => {
	const [value, setValue] = useState<string>()
	return <Select options={OPTIONS} onSelect={setValue} value={value} />
}

export const WithPlaceholder = () => {
	const [value, setValue] = useState<string>()
	return (
		<Select
			placeholder="Choose one"
			options={OPTIONS}
			onSelect={setValue}
			value={value}
		/>
	)
}

export const WithChildrenOptions = () => {
	const [value, setValue] = useState<string>()
	return (
		<Select placeholder="Choose one" onSelect={setValue} value={value}>
			{OPTIONS.map((optionProps, index) => (
				<Option {...optionProps} key={index} />
			))}
		</Select>
	)
}
