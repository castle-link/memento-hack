import { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'
import { getSpacingRules, getStackeeRules } from '../../mixins'
import { SelectProps } from './select.proptypes'

interface OptionProps {
	label?: string
	value: string
	disabled?: boolean
}
export const Option = ({ label, value, disabled }: OptionProps) => (
	<option value={value} disabled={disabled} key={value}>
		{label}
	</option>
)

export const Select = ({
	value: selectedValue,
	options,
	onSelect,
	placeholder,
	children,
	...props
}: SelectProps) => {
	const onChange = useCallback(
		(event: ChangeEvent<{ value: string }>) => {
			onSelect(event.target.value)
		},
		[onSelect]
	)

	return (
		<SelectElement
			value={selectedValue || (placeholder && 'PLACEHOLDER') || undefined}
			placeholder={placeholder}
			onChange={onChange}
			{...props}
		>
			{placeholder && (
				<Option value="PLACEHOLDER" label={placeholder} disabled />
			)}
			{options &&
				options.map(({ label, value: optionValue }, index) => (
					<Option label={label} value={optionValue} key={index} />
				))}
			{children}
		</SelectElement>
	)
}

const SelectElement = styled.select<
	Omit<SelectProps, 'children' | 'options' | 'onSelect'>
>`
	${getSpacingRules}
	${getStackeeRules}
	
	&& {
		color: white;
		appearance: none;
		border: 1px solid #212121;
		border-radius: 8px;
		cursor: pointer;
		background: #040404;
		background: transparent;
		padding: 0px 8px;
		height: 48px;
		min-width: 160px;
	}
`
