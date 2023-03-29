import styled, {
	CSSObject,
	DefaultTheme,
	keyframes,
	ThemeProps,
} from 'styled-components'
import {
	Menu as _BurgerIcon,
	EllipsisHorizontal as _EllipsesIcon,
} from '@styled-icons/ionicons-solid'
import { Close } from '@styled-icons/ionicons-outline'
import {
	ArrowIosDownwardOutline as _DownArrowIcon,
	SearchOutline as _SearchIcon,
} from '@styled-icons/evaicons-outline'
import { Power as _PowerIcon } from '@styled-icons/evaicons-solid'
import { UnstyledButton } from '../../behaviours/unstyled-button/unstyled-button.component'
import { Box } from '../../primitives'
import { getPaletteColor } from '@/compound/themes'

export const BurgerIcon = styled(_BurgerIcon)<{
	customStyles?: CSSObject
	theme: DefaultTheme
}>(({ customStyles, theme }) => ({
	color: getPaletteColor('text-muted')({ theme }),
	height: '40px',
	width: '40px',
	padding: '4px',
	...customStyles,
}))

export const SearchIcon = styled(_SearchIcon)<{
	customStyles?: CSSObject
	theme: DefaultTheme
}>(({ customStyles, theme }) => ({
	color: getPaletteColor('text-muted')({ theme }),
	height: '40px',
	width: '40px',
	padding: '4px',
	...customStyles,
}))

export const EllipsesIcon = styled(_EllipsesIcon)<{
	customStyles?: CSSObject
}>(({ customStyles }) => ({
	color: 'rgba(255, 255, 255, 0.6)',
	height: '40px',
	width: '40px',
	padding: '4px',
	...customStyles,
}))

export const CloseIcon = styled(Close)`
	color: ${getPaletteColor('text-muted')};
	height: 32px;
	width: 32px;
	padding: 4px;
`

export const DownArrowIcon = styled(_DownArrowIcon)<{ open: boolean }>`
	color: ${getPaletteColor('text-muted')};
	opacity: 0.6;
	transition: all 0.16s ease;
	${({ open }) => (open ? '' : 'transform: rotate(-90deg);')}
`

export const PowerIcon = styled(_PowerIcon)`
	color: ${getPaletteColor('text-muted')};
	opacity: 0.6;
	transition: all 0.16s ease;
`

const fadeInAnimation = keyframes`
0% {
  opacity: 0.2;	
}
100% {
	opacity: 1;
}
`

export const DropdownContainer = styled(Box)`
	position: relative;
`

const commonMenuContentStyles = (props: ThemeProps<DefaultTheme>) => `
background: #0c0c0c;
border: 1px solid ${getPaletteColor('border-color-op')(props)};
border-radius: 8px;
`

export const MenuContent = styled(Box)<{ dropdownOffset: number }>`
	${commonMenuContentStyles}
	box-shadow: 0px 2px 16px 3px rgba(0, 0, 0, 1);
	padding: 4px 0px;
	top: ${({ dropdownOffset }) => `${dropdownOffset}px`};
	position: absolute;
	width: 180px;

	z-index: 3;
	animation: ${fadeInAnimation} linear 0.24s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
`

export const FullScreenMenuContent = styled(Box)<{ dropdownOffset: number }>`
	${commonMenuContentStyles}
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	z-index: 100;

	> button {
		font-size: 16px;
		text-align: center;
		padding: 18px 24px;
	}
`

export const MenuItem = styled(UnstyledButton)`
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	align-items: center;
	display: flex;
	font-size: 14px;
	padding: 8px 8px;
	transition: all 0.24s ease-in-out;

	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;

	&:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}
`

export const SelectedField = styled(Box)<{
	customStyles?: string
	theme: DefaultTheme
}>`
	${({ customStyles, theme }) => `
	align-items: center;
	background: #040404;
	border: 1px solid ${getPaletteColor('border-color-op')({ theme })};
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	height: 48px;
	justify-content: space-between;
	width: 180px;
	padding: 0px 8px;

	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;

	&:hover {
		border: 1px solid #333;
		transition: all 0.24s linear;
	}
	${customStyles}`}
`
