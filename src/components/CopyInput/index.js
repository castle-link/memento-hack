import { useState, useRef } from 'react'
import styled from 'styled-components'

// Toast
import { toast } from 'react-toastify'

const CopyInput = ({
	background,
	copyText,
	height,
	textColor,
	margin,
	width,
}) => {
	const [copied, setCopied] = useState(false)

	const copyRef = useRef()

	const copyHandler = (e) => {
		copyRef.current.select()

		document.execCommand('copy')
		setCopied(true)
		toast.success('Copied!', {
			position: toast.POSITION.BOTTOM_RIGHT,
		})
	}

	return (
		<Container
			background={background}
			height={height}
			margin={margin}
			width={width}
		>
			<CopyText
				autoComplete='off'
				background={background}
				readOnly
				ref={copyRef}
				textColor={textColor}
				type='text'
				value={copyText}
			/>

			<Button onClick={(e) => copyHandler(e)}>
				{copied ? 'COPIED!' : 'COPY'}
			</Button>
		</Container>
	)
}

export default CopyInput

const Container = styled.div`
	align-items: center;
	background: ${(props) => (props.background ? props.background : '#040404')};
	border: 1px solid rgb(47, 51, 54);
	border-radius: 8px;
	display: inline-flex;
	height: ${(props) => (props.height ? props.height : '48px')};
	justify-content: space-between;
	margin: ${(props) => props.margin && props.margin};
	padding: 0px 16px;
	width: ${(props) => (props.width ? props.width : '100%')};
`

const CopyText = styled.input`
	background: ${(props) => (props.background ? props.background : '#040404')};
	border: 0px;
	color: ${(props) => (props.textColor ? props.textColor : '#fff')};
	font-size: 14px;
	margin-right: 16px;
	width: 100%;
`

const Button = styled.div`
	color: #f9d649;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	// text-transform: uppercase;

	&:hover {
		transform: scale(1.03);
	}
`
