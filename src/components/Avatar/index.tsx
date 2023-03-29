import { getPaletteColor } from '@/compound'
import styled from 'styled-components'

const Avatar = ({
	action,
	cursor,
	fontSize,
	height,
	margin,
	name,
	scale,
	width,
}: any) => {
	return (
		<Container
			cursor={cursor}
			fontSize={fontSize}
			height={height}
			margin={margin}
			onClick={action}
			scale={scale}
			width={width}
		>
			{name?.charAt(0)?.toUpperCase()}
		</Container>
	)
}

export default Avatar

const Container = styled.div<any>`
	align-items: center;
	background: ${getPaletteColor('icon-bg')};
	border: 1px solid ${getPaletteColor('border-color')};
	border-radius: 100%;
	color: ${getPaletteColor('icon-fg')};
	cursor: ${(props) => props.cursor && props.cursor};
	display: flex;
	font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
	font-weight: 600;
	height: ${(props) => (props.height ? props.height : '40px')};
	justify-content: center;
	margin: ${(props) => props.margin && props.margin};
	overflow: hidden;
	width: ${(props) => (props.width ? props.width : '40px')};

	&:hover {
		transform: ${(props) => props.scale && `scale(${props.scale})`};
	}
`
