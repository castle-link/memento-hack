import { ReactNode, useMemo, ChangeEvent } from 'react'
import styled, { CSSObject } from 'styled-components'
import { Box } from '../../primitives'
import { Text } from '../../typography'
import { FocusStateOptions, SpaceProps, StackeeProps } from '../../mixins'
import MaskedInput from 'cleave.js/react'
// import type { ChangeEvent } from 'cleave.js/react/props'
// import { CleaveOptions } from 'cleave.js/options'
import ClipLoader from 'react-spinners/ClipLoader'
import { getPaletteColor, useTheme } from '../../themes'

interface TextInputProps extends StackeeProps, SpaceProps, FocusStateOptions {
	value?: string
	onChange: (a: string) => void
	onBlur?: () => void
	children?: ReactNode
	disabled?: boolean
	width?: string
	placeholder?: string
	maxLength?: number
	spellCheck?: boolean
	error?: string | null
	labelText?: string
	loading?: boolean
	className?: string
	prefix?: React.ReactNode
	suffix?: React.ReactNode
	elementType?: 'input' | 'textarea'
	inputStyle?: CSSObject
	type?: 'text' | 'number'
}

export const TextInput = ({
	value,
	onChange,
	children,
	disabled,
	placeholder,
	maxLength,
	spellCheck,
	error,
	spacing,
	width,
	grow,
	loading,
	className,
	labelText,
	suffix,
	prefix,
	elementType = 'input',
	inputStyle,
	type,
	...styleProps
}: TextInputProps) => {
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (!disabled) onChange(e.target.value)
	}

	const { getPaletteColor } = useTheme()

	return (
		<FieldWrapper grow={grow} stacked="column" width={width} spacing={spacing}>
			<InputWrapper
				{...styleProps}
				labelText={labelText}
				disabled={disabled}
				stacked="row"
				className={className}
				elementType={elementType}
			>
				{prefix && <>{prefix}</>}

				{elementType === 'textarea' && (
					<StyledTextarea
						value={value}
						onChange={handleChange}
						disabled={disabled}
						placeholder={placeholder}
						maxLength={maxLength}
						spellCheck={false}
						style={inputStyle}
					/>
				)}
				{elementType === 'input' && (
					<StyledInput
						value={value}
						onChange={handleChange}
						disabled={disabled}
						placeholder={placeholder}
						maxLength={maxLength}
						spellCheck={false}
						type={type}
						style={inputStyle}
					/>
				)}

				{children}
				{loading && (
					<LoaderContainer>
						<ClipLoader
							loading={loading}
							size={18}
							color={getPaletteColor('text-muted')}
							speedMultiplier={0.5}
						/>
					</LoaderContainer>
				)}
				{labelText && <Label>{labelText}</Label>}
				{suffix && <>{suffix}</>}
			</InputWrapper>
			{error && (
				<Text spacing={['mt2']} fontSize={14} fontColor="error-fg">
					{error}
				</Text>
			)}
		</FieldWrapper>
	)
}

const FieldWrapper = styled(Box)<Pick<TextInputProps, 'width'>>`
	width: ${(props) => (props.width ? props.width : '100%')};
`

const inputStyles = (
	props: Pick<TextInputProps, 'disabled' | 'placeholder'> & {
		theme: any
	}
) => `
color: inherit;
font-size: inherit;
flex-grow: 1;
max-width: 100%;
background-color: transparent;
outiline: none;
border: none;

&::-webkit-outer-spin-button {
	display:none;
}

&:focus {
	border: none;
	outline: none;
}
`

const StyledInput = styled.input<
	Pick<TextInputProps, 'disabled' | 'placeholder'>
>`
	${(props) => inputStyles(props)}
`

const StyledTextarea = styled.textarea<
	Pick<TextInputProps, 'disabled' | 'placeholder'>
>`
	${(props) => inputStyles(props)}
	resize: none;
	height: 100% !important;
`

const StyledMaskedInput = styled(MaskedInput)<
	Pick<TextInputProps, 'disabled' | 'placeholder'>
>`
	${(props) => inputStyles(props)}
`

const InputWrapper = styled(Box)<
	Pick<
		TextInputProps,
		'disabled' | 'width' | 'placeholder' | 'labelText' | 'elementType'
	>
>`
	background-color: ${(props) =>
		props.disabled
			? `${getPaletteColor('text-input-bg-disabled')}`
			: `${getPaletteColor('text-input-bg')}`};
	border: 1px solid ${getPaletteColor('border-color')}};
	border-radius: var(--text-input-border-radius);
	overflow: hidden;
	color: ${(props) =>
		props.disabled
			? getPaletteColor('text-muted')
			: getPaletteColor('text-main')};
	${(props) =>
		props.labelText
			? 'padding-left: 16px; padding-right: 0px'
			: 'padding-left: 16px; padding-right: 16px'};
	font-size: 16px;
	position: absolute;
	height: 48px;
	cursor: text;

	transition: box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1);

	${(props) =>
		props.elementType === 'textarea'
			? 'padding-top: 8px; padding-bottom: 8px;height: 104px;'
			: ''};

	position: relative;

	&:focus-within {
		box-shadow: 0 0 0 1px ${getPaletteColor('border-color')};
	}
`

const Label = styled.div`
	align-items: center;
	background: ${getPaletteColor('text-input-label-bg')};
	color: ${getPaletteColor('text-muted')};
	border-left: 1px solid ${getPaletteColor('border-color')};
	height: 100%;
	display: flex;
	font-size: 14px;
	font-weight: 600;
	padding: 0px 24px;
	margin-left: 16px;
	text-transform: uppercase;

	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;
`

const LoaderContainer = styled.div`
	align-items: center;
	display: flex;
	width: 24px;
	margin-left: 8px;
`
