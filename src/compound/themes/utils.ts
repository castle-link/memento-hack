import { ThemeProps, DefaultTheme } from 'styled-components'
import { ColorPaletteKey } from './themes'

export const getPaletteColor =
	(colorNameKey: ColorPaletteKey) =>
	({ theme }: ThemeProps<DefaultTheme>): string =>
		colorNameKey ? theme.colorPalette?.[colorNameKey] : ''
