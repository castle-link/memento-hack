import { lightTheme, darkTheme, ThemeName, ColorPaletteKey } from './themes'
import React, {
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { GlobalStyles } from './GlobalStyle'
import { ThemeProvider as _ThemeProvider } from 'styled-components'
import { BreakPoint, breakPointSizes } from '../utils'
import { SkeletonTheme } from 'react-loading-skeleton'

export const ThemeContext = React.createContext({
	mainContentWidth: 800,
	breakpoint: 'laptop' as BreakPoint,
	toggleTheme: () => {},
	theme: darkTheme,
	getPaletteColor: (key: ColorPaletteKey) => '' as string,
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [themeKey, setThemeKey] = useState<ThemeName>(
		(window.localStorage.getItem('theme') as ThemeName) || 'light'
	)

	const activeTheme = useMemo(
		() => (themeKey === 'light' ? lightTheme : darkTheme),
		[themeKey]
	)

	const setMode = useCallback((mode: ThemeName) => {
		window.localStorage.setItem('theme', mode)
		setThemeKey(mode)
	}, [])

	const toggleTheme = useCallback(() => {
		themeKey === 'light' ? setMode('dark') : setMode('light')
	}, [themeKey, setMode])

	const onStorageChange = useCallback((e: StorageEvent) => {
		if (e.key === 'theme') {
			setThemeKey(e.newValue as ThemeName)
		}
	}, [])

	useEffect(() => {
		window.addEventListener('storage', onStorageChange)

		return () => {
			window.removeEventListener('storage', onStorageChange)
		}
	}, [onStorageChange])

	const [mainContentWidth, setMainContentWidth] = useState<number>(800)
	const [breakpoint, setBreakpoint] = useState<BreakPoint>('laptop')

	const calculateBreakpoint = useCallback(() => {
		console.log('calculate breakpoint')
		const width = document.body?.offsetWidth

		const _breakpoint: BreakPoint = (() => {
			if (!width) return 'laptop'
			if (width < breakPointSizes.mobile) {
				return 'mobile'
			} else if (width < breakPointSizes.tablet) {
				return 'tablet'
			} else if (width < breakPointSizes.laptop) {
				return 'laptop'
			} else if (width < breakPointSizes.desktop) {
				return 'desktop'
			} else if (width < breakPointSizes.wideScreen) {
				return 'wideScreen'
			}
			return 'laptop'
		})()

		setBreakpoint(_breakpoint)
		setMainContentWidth(width)
	}, [])

	useEffect(() => {
		window.addEventListener('resize', calculateBreakpoint)
		calculateBreakpoint()

		return () => {
			window.removeEventListener('resize', calculateBreakpoint)
		}
	}, [])

	const getPaletteColor = useCallback(
		(colorNameKey: ColorPaletteKey) =>
			colorNameKey ? activeTheme.colorPalette?.[colorNameKey] : '',
		[activeTheme]
	)

	return (
		// Light mode isn't supported yet so we default to dark always
		<_ThemeProvider theme={activeTheme}>
			<ThemeContext.Provider
				value={{
					breakpoint,
					mainContentWidth,
					toggleTheme,
					theme: activeTheme,
					getPaletteColor,
				}}
			>
				<SkeletonTheme
					baseColor={getPaletteColor('skeleton-base')}
					highlightColor={getPaletteColor('skeleton-highlight')}
				>
					<GlobalStyles />
					{children}
				</SkeletonTheme>
			</ThemeContext.Provider>
		</_ThemeProvider>
	)
}

export const useBreakPoint = () => {
	const { breakpoint } = React.useContext(ThemeContext)

	return breakpoint
}

export const useTheme = () => {
	const { toggleTheme, theme, getPaletteColor } = React.useContext(ThemeContext)

	return { toggleTheme, theme, getPaletteColor }
}
