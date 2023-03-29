import { ThemeName } from '@/compound/themes/themes'
import { useEffect, useState, useCallback } from 'react'

interface ThemeConfig {
	theme: ThemeName
	toggleTheme: () => void
	mountedComponent: boolean
}

export const useTheme = (): ThemeConfig => {
	const [theme, setTheme] = useState<ThemeName>('dark')

	const [mountedComponent, setMountedComponent] = useState(false)

	const setMode = useCallback((mode) => {
		window.localStorage.setItem('theme', mode)
		setTheme(mode)
	}, [])

	const toggleTheme = useCallback(() => {
		theme === 'light' ? setMode('dark') : setMode('light')
	}, [theme, setMode])

	useEffect(() => {
		const localTheme = window.localStorage.getItem('theme') as ThemeName
		localTheme ? setTheme(localTheme) : setMode('light')
		setMountedComponent(true)
	}, [])

	return { theme, toggleTheme, mountedComponent }
}
