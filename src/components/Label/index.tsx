import { getPaletteColor } from '@/compound'
import styled from 'styled-components'

interface LabelProps {
	color?: string
	fontSize?: string
	margin?: string
	opacity?: string
	text?: string
	textAlign?: string
	width?: string
}

export const Label = ({
	color,
	fontSize,
	margin,
	opacity,
	text,
	textAlign,
	width,
}: LabelProps) => {
	return (
		<Text
			color={color}
			fontSize={fontSize}
			margin={margin}
			opacity={opacity}
			textAlign={textAlign}
			width={width}
		>
			{text}
		</Text>
	)
}

export default Label

// Styles
const Text = styled.div<Omit<LabelProps, 'text'>>`
	color: ${(props) =>
		props.color ? props.color : getPaletteColor('text-main')(props)};
	font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : '13px')};
	font-weight: 600;
	-webkit-font-smoothing: antialiased;
	margin: ${(props) => props.margin && props.margin};
	opacity: ${(props) => props.opacity && props.opacity};
	text-align: ${(props) => props.textAlign && props.textAlign};
	text-transform: uppercase;
	width: ${(props) => props.width && props.width};
`
