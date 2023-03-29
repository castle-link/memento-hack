import 'styled-components'

declare module 'styled-components' {
	export type ThemeName = 'light' | 'dark'

	export interface DefaultTheme {
		name: ThemeName

		colorPalette: {
			black: string
			white: string

			// Backgrounds
			'text-main': string
			'text-muted': string
			'text-muted-hover': string
			background: string
			'background-hover': string

			// Greys
			'greyscale-muted': string

			// Brand colours - primary
			'primary-base': string
			'primary-fg': string
			'primary-bg': string

			// Brand colours - secondary
			'secondary-base': string
			'secondary-fg': string
			'secondary-bg': string

			// Flash messages
			'error-fg': string
			'error-bg': string
			'success-fg': string
			'success-bg': string
			'info-fg': string
			'info-bg': string
			'disabled-fg': string

			// Card
			'card-bg': string
			'card-hover': string

			// text input
			'text-input-bg': string
			'text-input-bg-secondary': string
			'text-input-bg-disabled': string
			'text-input-label-bg': string

			'button-bg-disabled': string
			'border-color': string
			'border-color-lighter': string
			'border-color-op': string
			'border-color-hover': string
			'border-color-navbar': strin
			'dark-overlay-pill-bg': string

			'canvas-bg': string

			'icon-bg': string
			'icon-fg': string

			'aux-blue': string
			'aux-light-blue': string
			'aux-green': string
			'aux-red': string
			'aux-yellow': string

			'skeleton-base': string
			'skeleton-highlight': string
		}
		spacing: {
			s1: string
			s2: string
			s3: string
			s4: string
			s5: string
			s6: string
			s7: string
			s8: string
			s9: string
			s10: string
		}
	}
}
