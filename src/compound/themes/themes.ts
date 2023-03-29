import { DefaultTheme } from 'styled-components'
import { SPACING } from './spacing'
export type ThemeName = 'light' | 'dark'

export type ColorPaletteKey = keyof DefaultTheme['colorPalette']

export const lightTheme: DefaultTheme = {
	name: 'light',
	colorPalette: {
		black: '#000',
		white: '#fff',

		// Backgrounds
		'text-main': '#191414',
		'text-muted': 'rgba(0, 0, 0, 0.67)',
		'text-muted-hover': 'rgba(0, 0, 0, 0.87)',
		background: '#F1F1F3',
		'background-hover': 'rgba(0, 0, 0, 0.03)',

		// Greys
		'greyscale-muted': 'rgba(255, 255, 255, 0.67)',

		// Brand colours - primary
		'primary-base': '#000',
		'primary-fg': '#fff',
		'primary-bg': '#000',

		// Brand colours - secondary
		'secondary-base': '#000',
		'secondary-fg': '#fff',
		'secondary-bg': '#000',

		// Flash messages
		'error-fg': '#f75050',
		'error-bg': '#FFEBE6',
		'success-fg': '#377674',
		'success-bg': '#e5f1f1',
		'info-fg': '#A85A00',
		'info-bg': '#fff6e6',
		'disabled-fg': '#b3b3b3',

		// Card
		'card-bg': '#fff',
		'card-hover': 'rgba(0, 0, 0, 0.03)',

		// Text input
		'text-input-bg': '#fff',
		'text-input-bg-secondary': '#F2F2F2',
		'text-input-bg-disabled': 'rgba(0,0,0, 0.1)',
		'text-input-label-bg': 'rgba(0,0,0, 0.1)',

		'button-bg-disabled': 'rgba(255,255,255,0.08)',

		'border-color': '#e6e6e6', // use primarily
		'border-color-lighter': 'rgba(0, 0, 0, 0.1)', // used for image container borders
		'border-color-op': '#d1d1d1', // Opaque border color, use when you don't want to the border to be slightly transparent
		'border-color-hover': 'rgba(0, 0, 0, 0.24)',
		'border-color-navbar': 'rgba(23, 24, 26, 0.11)', // use for bottom border on navbar
		'dark-overlay-pill-bg': 'rgba(255, 255, 255, 0.08)', // use pill that are onto of a dark overlay

		'canvas-bg': 'rgba(0, 0, 0, 0.1)', // used for image placeholder bgs, icon bgs, etc

		'icon-bg': 'rgba(0, 0, 0, 0.04)',
		'icon-fg': 'rgba(0, 0, 0, 0.4)',

		'aux-blue': '#1725eb',
		'aux-light-blue': '#def6ff',
		'aux-green': '#3BB583',
		'aux-red': '#EC3F21',
		'aux-yellow': 'rgb(28, 176, 255)',

		'skeleton-base': 'rgba(0, 0, 0, 0.05)',
		'skeleton-highlight': 'rgba(0, 0, 0, 0.06)',
	},
	spacing: SPACING,
}

export const darkTheme: DefaultTheme = {
	name: 'dark',
	colorPalette: {
		black: '#000',
		white: '#fff',

		// Backgrounds
		'text-main': '#ffffff',
		'text-muted': 'rgba(255, 255, 255, 0.67)',
		'text-muted-hover': 'rgba(255, 255, 255, 0.87)',
		background: '#000',
		'background-hover': 'rgba(255, 255, 255, 0.03)',

		// Greys
		'greyscale-muted': 'rgba(255,255,255,0.67)',

		// Brand colours - primary
		'primary-base': '#fff',
		'primary-fg': '#000',
		'primary-bg': '#fff',

		// Brand colours - secondary
		'secondary-base': '#000',
		'secondary-fg': '#fff',
		'secondary-bg': '#000',

		// Flash messages
		'error-fg': '#f75050',
		'error-bg': '#FFEBE6',
		'success-fg': '#377674',
		'success-bg': '#e5f1f1',
		'info-fg': '#A85A00',
		'info-bg': '#fff6e6',

		// Card
		'card-bg': '#000',
		'card-hover': 'rgba(255, 255, 255, 0.03)',

		// Text input
		'text-input-bg': '#000000',
		'text-input-bg-secondary': '#000000',
		'text-input-bg-disabled': 'rgba(255,255,255, 0.1)',
		'text-input-label-bg': '#0c0c0c',

		'button-bg-disabled': 'rgba(255,255,255,0.08)',

		'disabled-fg': '#b3b3b3',

		'border-color': '#292929', // use primarily
		'border-color-lighter': 'rgba(255, 255, 255, 0.1)', // used for image container borders
		'border-color-op': '#212121', // Opaque border color, use when you don't want to the border to be slightly transparent
		'border-color-hover': 'rgba(255, 255, 255, 0.24)',
		'border-color-navbar': 'rgba(255, 255, 255, 0.08)', // use for bottom border on navbar
		'dark-overlay-pill-bg': 'rgba(255, 255, 255, 0.08)', // use pill that are onto of a dark overlay

		'canvas-bg': 'rgba(255, 255, 255, 0.1)', // used for image placeholder bgs, icon bgs, etc

		'icon-bg': 'rgba(255, 255, 255, 0.04)',
		'icon-fg': 'rgba(255, 255, 255, 0.4)',

		'aux-blue': '#1725eb',
		'aux-light-blue': '#def6ff',
		'aux-green': '#3BB583',
		'aux-red': '#EC3F21',
		'aux-yellow': 'rgb(28, 176, 255)',
		'skeleton-base': '#141414',
		'skeleton-highlight': '#181818',
	},
	spacing: SPACING,
}
