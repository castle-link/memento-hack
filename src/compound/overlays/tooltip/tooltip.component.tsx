import { TooltipProps } from './tooltip.proptypes'
import { usePopper } from 'react-popper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { InformationCircle } from '@styled-icons/ionicons-sharp'
import { InformationCircle as InformationCircleOutline } from '@styled-icons/ionicons-outline'
import styled, { CSSObject, DefaultTheme, ThemeProps } from 'styled-components'
import { UnstyledButton } from '../../behaviours/unstyled-button'
import { Box } from '../../primitives/Box'
import { getPaletteColor } from '@/compound/themes'

export const Tooltip = ({
	text,
	placement = 'bottom',
	fallbackPlacements,
	buttonStyles,
	iconStyles,
	height,
	width,
	children,
	allowOverflow = false,
	icon = 'information-circle',
	customPopperStyles,
}: TooltipProps) => {
	const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
		null
	)
	const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)
	const [visible, setVisible] = useState(false)

	const {
		styles,
		attributes,
		update: updatePopperPosition,
	} = usePopper(referenceElement, popperElement, {
		placement,
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } },
			{ name: 'eventListeners', enabled: visible }, // only add event listeners when visible
			{ name: 'preventOverflow', enabled: !allowOverflow },
			...(fallbackPlacements
				? [{ name: 'flip', options: { fallbackPlacements } }]
				: []),
		],
	})

	const showPopper = useCallback(() => {
		setVisible(true)
		popperElement?.setAttribute('data-show', 'true')
		updatePopperPosition && updatePopperPosition()
	}, [popperElement])

	const hidePopper = useCallback(() => {
		setVisible(false)
		popperElement?.setAttribute('data-show', 'false')
		updatePopperPosition && updatePopperPosition()
	}, [popperElement])

	useEffect(() => {
		const showEvents = ['mouseenter', 'focus']
		const hideEvents = ['mouseleave', 'blur']

		showEvents.forEach((event) => {
			referenceElement?.addEventListener(event, showPopper)
		})

		hideEvents.forEach((event) => {
			referenceElement?.addEventListener(event, hidePopper)
		})

		updatePopperPosition && updatePopperPosition()
	}, [referenceElement])

	const IconComponent = useMemo(
		() =>
			icon === 'information-circle'
				? InformationCircleIcon
				: InformationCircleOutlineIcon,
		[icon]
	)

	return (
		<>
			{children ? (
				<Box ref={setReferenceElement} stacked="row" align="center">
					{children}
				</Box>
			) : (
				<Button styles={buttonStyles} ref={setReferenceElement}>
					<IconComponent styles={iconStyles} height={height} width={width} />
				</Button>
			)}
			<Popper
				ref={setPopperElement}
				style={{ ...styles.popper, ...customPopperStyles }}
				{...attributes.popper}
			>
				{text}
				<Arrow data-popper-arrow ref={setArrowElement} style={styles.arrow} />
			</Popper>
		</>
	)
}

const getDefaultIconStyles = (props: ThemeProps<DefaultTheme>) => ({
	color: getPaletteColor('icon-fg')(props),
	height: '24px',
	width: '24px',
})

const InformationCircleOutlineIcon = styled(InformationCircleOutline)<{
	width?: string
	height?: string
	styles?: CSSObject
	theme: DefaultTheme
}>(({ width, height, styles, theme }) => ({
	...getDefaultIconStyles({ theme }),
	...(height ? { height } : {}),
	...(width ? { width } : {}),
	...styles,
}))

const InformationCircleIcon = styled(InformationCircle)<{
	width?: string
	height?: string
	styles?: CSSObject
	theme: DefaultTheme
}>(({ width, height, styles, theme }) => ({
	...getDefaultIconStyles({ theme }),
	...(height ? { height } : {}),
	...(width ? { width } : {}),
	...styles,
}))

const Popper = styled(Box)`
	background-color: #333;
	color: rgba(255, 255, 255, 0.7);
	max-width: 200px;
	padding: 8px 8px;
	border-radius: 5px;
	font-size: 14px;
	display: none;
	line-height: 1.3;
	z-index: 1000;

	&[data-show='true'] {
		display: block;
	}
`

const Arrow = styled(Box)`
	&,
	&::before {
		position: absolute;
		width: 8px;
		height: 8px;
		background-color: inherit;
	}

	visibility: hidden;

	&::before {
		content: '';
		visibility: visible;
		transform: rotate(45deg);
	}

	[data-popper-placement^='top'] > & {
		bottom: -4px;
	}

	[data-popper-placement^='bottom'] > & {
		top: -4px;
	}

	[data-popper-placement^='right'] > & {
		left: -4px;
	}

	[data-popper-placement^='left'] > & {
		right: -4px;
	}
`

const Button = styled(UnstyledButton)<{ styles?: CSSObject }>(({ styles }) => ({
	...styles,
}))
