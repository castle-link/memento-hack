import { BeatLoader } from 'react-spinners'
import { getPaletteColor, UnstyledButton, useTheme } from '@/compound'
import styled from 'styled-components'
import { noop } from 'lodash'

interface ButtonProps {
	onClick?: () => void
	action?: () => void
	fontSize?: string
	height?: string
	margin?: string
	scale?: string
	text?: string
	type?: 'primary' | 'secondary' | 'disabled' | 'danger'
	width?: string
	loading?: boolean
	disabled?: boolean
}

export const Button = ({
	onClick,
	action,
	fontSize,
	height,
	margin,
	scale,
	text,
	type = 'primary',
	width = '100%',
	loading,
	disabled,
}: ButtonProps) => {
	const { getPaletteColor } = useTheme()
	return (
		<Container
			fontSize={fontSize}
			height={height}
			margin={margin}
			onClick={disabled ? noop : onClick || action}
			scale={scale}
			styleType={type}
			width={width}
			disabled={disabled}
		>
			{loading ? (
				<BeatLoader
					size={'8px'}
					color={
						type === 'primary'
							? getPaletteColor('primary-fg')
							: type === 'secondary'
							? getPaletteColor('secondary-fg')
							: type === 'disabled'
							? getPaletteColor('disabled-fg')
							: getPaletteColor('primary-fg')
					}
				/>
			) : (
				text
			)}
		</Container>
	)
}

export default Button

// Styles
const Container = styled(UnstyledButton)<
	Omit<ButtonProps, 'text'> & {
		styleType: 'primary' | 'secondary' | 'disabled' | 'danger'
	}
>`
	align-items: center;
	background: ${(props) => {
		return props.styleType === 'primary'
			? getPaletteColor('primary-base')(props)
			: props.styleType === 'secondary'
			? getPaletteColor('secondary-base')(props)
			: props.styleType === 'disabled' || props.disabled
			? getPaletteColor('button-bg-disabled')(props)
			: props.styleType === 'danger'
			? 'rgba(247, 80, 80, 0.14)'
			: getPaletteColor('primary-base')(props)
	}};
	border: ${(props) =>
		props.styleType === 'disabled' || props.disabled
			? `1px solid ${getPaletteColor('button-bg-disabled')(props)}`
			: props.styleType === 'primary'
			? `1px solid ${getPaletteColor('primary-base')(props)}`
			: props.styleType === 'secondary'
			? `1px solid ${getPaletteColor('border-color')(props)}`
			: props.styleType === 'danger' && '1px solid rgb(247, 80, 80, 0.14)'};
	color: ${(props) =>
		props.styleType === 'primary'
			? getPaletteColor('primary-fg')(props)
			: props.styleType === 'secondary'
			? getPaletteColor('secondary-fg')(props)
			: props.styleType === 'disabled' || props.disabled
			? '#b3b3b3'
			: props.styleType === 'danger' && '#f75050'};
	cursor: ${(props) =>
		props.styleType === 'disabled' || props.disabled ? 'default' : 'pointer'};
	display: flex;
	font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
	font-weight: 600;
	height: ${(props) => (props.height ? props.height : '48px')};
	justify-content: center;
	line-height: ${(props) => (props.height ? props.height : '40px')};
	margin: ${(props) => props.margin && props.margin};
	padding: 0px 24px;
	text-transform: uppercase;
	width: ${(props) => props.width && props.width};

	&:hover {
		border: ${(props) =>
			props.styleType === 'primary'
				? '1px solid rgba(0, 200, 5,0.16)'
				: props.styleType === 'secondary'
				? '1px solid rgb(255, 255, 255,0.24)'
				: props.styleType === 'disabled' || props.disabled
				? '1px solid rgba(255,255,255,0.04)'
				: props.styleType === 'danger' && '1px solid rgb(247, 80, 80, 0.24)'};
	}
`
