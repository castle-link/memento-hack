import { getPaletteColor, UnstyledButton, useTheme } from '@/compound'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { MoonIcon } from './MoonIcon'
import { SunIcon } from './SunIcon'

export const ThemeToggler = () => {
	const { theme, toggleTheme } = useTheme()
	const SwitchIcon = useMemo(
		() => (theme.name === 'dark' ? MoonIcon : SunIcon),
		[theme.name]
	)

	return (
		<Switch onClick={toggleTheme} spacing="p1">
			<Text>Switch appearance</Text>
			<SwitchIcon />
		</Switch>
	)
}

const Switch = styled(UnstyledButton)`
	color: ${getPaletteColor('text-muted')};
	display: flex;
	justify-content: space-between;
	width: 100%;

	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		background-color: ${getPaletteColor('card-hover')};
		color: ${getPaletteColor('text-muted-hover')};
	}
`

const Text = styled.div``
