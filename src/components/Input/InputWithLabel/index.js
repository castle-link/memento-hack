import { useState } from 'react'
import styled from 'styled-components'

const Input = ({
	action,
	disabled,
	height,
	margin,
	label,
	name,
	placeholder,
	type,
	value,
	width,
}) => {
	const [focus, setFocus] = useState(false)
	return (
		<OuterContainer
			focus={focus}
			height={height}
			margin={margin}
			value={value}
			width={width}
		>
			<Container
				disabled={disabled}
				name={name}
				onBlur={() => setFocus(false)}
				onChange={action}
				onFocus={() => setFocus(true)}
				placeholder={placeholder}
				type={type}
			/>
			<Label>{label}</Label>
		</OuterContainer>
	)
}

export default Input

// Styles
const OuterContainer = styled.div`
	background-color: ${(props) => (props.disabled ? '#0c0c0c' : '#040404')};
	border: ${(props) =>
		props.focus ? '1px solid #666' : '1px solid rgb(255,255,255,0.16)'};

	display: flex;
	height: ${(props) => (props.height ? props.height : '48px')};
	margin: ${(props) => (props.margin ? props.margin : '0px')};
	overflow: hidden;
	width: ${(props) => (props.width ? props.width : '100%')};
`

const Container = styled.input`
	background-color: ${(props) => (props.disabled ? '#0c0c0c' : '#040404')};
	border: none;
	color: ${(props) => (props.disabled ? '#b3b3b3' : '#fff')};
	padding: 0px 16px;
	transition: all 0.16s linear;
	width: 100%;
`

const Label = styled.div`
	align-items: center;
	background: #0c0c0c;
	color: #b3b3b3;
	border-left: 1px solid rgb(47, 51, 54);
	display: flex;
	font-size: 14px;
	font-weight: 600;
	padding: 0px 24px;
	// text-transform: uppercase;
`
