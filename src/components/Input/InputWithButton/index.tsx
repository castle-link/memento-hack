import { useState } from 'react'
import styled from 'styled-components'

const Input = ({
	action,
	buttonAction,
	disabled,
	height,
	margin,
	button,
	name,
	placeholder,
	type,
	value,
	width,
}: any) => {
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
			<Button onClick={buttonAction}>{button}</Button>
		</OuterContainer>
	)
}

export default Input

// Styles
const OuterContainer = styled.div<any>`
	background-color: ${(props) =>
		props.disabled ? '#0c0c0c' : 'var(--text-input-background-color)'};
	border: ${(props) =>
		props.focus ? '1px solid #666' : '1px solid rgb(47, 51, 54)'};

	display: flex;
	height: ${(props) => (props.height ? props.height : '56px')};
	margin: ${(props) => (props.margin ? props.margin : '0px')};
	overflow: hidden;
	width: ${(props) => (props.width ? props.width : '100%')};
`

const Container = styled.input`
	background-color: ${(props) =>
		props.disabled ? '#0c0c0c' : 'var(--text-input-background-color)'};
	border: none;
	color: ${(props) => (props.disabled ? '#b3b3b3' : '#fff')};
	flex: 1;
	padding: 0px 16px;
	transition: all 0.16s linear;
`

const Button = styled.div`
	align-items: center;
	color: #fff;
	cursor: pointer;
	display: flex;
	font-weight: 600;
	padding: 0px 16px;
	text-transform: uppercase;
`
