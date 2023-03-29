import { getPaletteColor } from '@/compound'
import { useState } from 'react'
import styled from 'styled-components'

const Input = ({
	id,
	action,
	color,
	disabled,
	height,
	margin,
	name,
	placeholder,
	type,
	value,
	width,
	textAlign,
}: any) => {
	const [focus, setFocus] = useState(false)

	return (
		<Container
			id={id}
			color={color}
			disabled={disabled}
			onBlur={() => setFocus(false)}
			onChange={action}
			onFocus={() => setFocus(true)}
			focus={focus}
			height={height}
			margin={margin}
			name={name}
			placeholder={placeholder}
			textAlign={textAlign}
			type={type}
			value={value}
			width={width}
		/>
	)
}

export default Input

// Styles
const Container = styled.input<any>`
	background-color: ${getPaletteColor('text-input-bg-secondary')};
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${(props) =>
		props.color ? props.color : getPaletteColor('text-main')};
	font-size: 16px;
	height: ${(props) => (props.height ? props.height : '48px')};
	line-height: ${(props) => (props.height ? props.height : '48px')};
	margin: ${(props) => (props.margin ? props.margin : '0px')};
	text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
	padding: 0px 16px;
	transition: all 0.16s linear;
	width: ${(props) => (props.width ? props.width : '100%')};
`
