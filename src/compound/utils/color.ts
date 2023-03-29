import Color from 'color'
import { toNumber } from 'lodash'

export const BRACKET_REGEX = /\((.*)\)/

export const fadeColor = (color: string, fade: number) => {
	const colorObject = Color(color).fade(fade).string()

	const rgba = (colorObject.match(BRACKET_REGEX) as string[])[1].split(', ')

	const roundedValpha = parseFloat(rgba[3]).toFixed(2)
	return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${roundedValpha})`
}

export const hexToRgbA = (hex: string, opacity: number) => {
	var c
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('')
		if (c.length == 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]]
		}
		c = '0x' + c.join('')
		return (
			'rgba(' +
			[
				(toNumber(c) >> 16) & 255,
				(toNumber(c) >> 8) & 255,
				toNumber(c) & 255,
			].join(',') +
			`, ${opacity})`
		)
	}
	throw new Error('Bad Hex')
}
