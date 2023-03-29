import { StackeeProps, StackeeOptions } from './stackee.proptypes'
import {
	BreakPoint,
	breakPoints,
	deviceMaximums,
} from '../../utils/breakpoints'

const getStackeeOptions = ({ grow, shrink, basis }: StackeeOptions): string => {
	const rules = []

	if (grow != null) {
		rules.push(`flex-grow: ${grow};`)
	}

	if (shrink != null) {
		rules.push(`flex-shrink: ${shrink};`)
	}

	if (basis != null) {
		rules.push(`flex-basis: ${basis}px;`)
	}

	return rules.join(' ')
}

export const getStackeeRules = (stackeeProps: StackeeProps): string => {
	const rules = []

	const globalOptions: StackeeOptions = {
		grow: typeof stackeeProps.grow === 'number' ? stackeeProps.grow : undefined,
		shrink:
			typeof stackeeProps.shrink === 'number' ? stackeeProps.shrink : undefined,
		basis:
			typeof stackeeProps.basis === 'number' ? stackeeProps.basis : undefined,
	}

	rules.push(getStackeeOptions(globalOptions))

	const optionsByBreakpoint: {
		[k in BreakPoint]: StackeeOptions
	} = breakPoints.reduce<{
		[k in BreakPoint]: StackeeOptions
	}>(
		(acc, bp) => {
			if (
				(stackeeProps.grow instanceof Object && stackeeProps.grow?.[bp]) ||
				(stackeeProps.shrink instanceof Object && stackeeProps.shrink?.[bp]) ||
				(stackeeProps.basis instanceof Object && stackeeProps.basis?.[bp])
			) {
				acc[bp] = {
					grow:
						stackeeProps.grow instanceof Object
							? stackeeProps.grow?.[bp]
							: undefined,
					shrink:
						stackeeProps.shrink instanceof Object
							? stackeeProps.shrink?.[bp]
							: undefined,
					basis:
						stackeeProps.basis instanceof Object
							? stackeeProps.basis?.[bp]
							: undefined,
				}
			}

			return acc
		},
		{
			mobile: {},
			tablet: {},
			laptop: {},
			desktop: {},
			wideScreen: {},
		}
	)

	if (optionsByBreakpoint.mobile) {
		rules.push(
			`@media ${deviceMaximums.mobile} {${getStackeeOptions(
				optionsByBreakpoint.mobile
			)}}`
		)
	}

	if (optionsByBreakpoint.tablet) {
		rules.push(
			`@media ${deviceMaximums.tablet} {${getStackeeOptions(
				optionsByBreakpoint.tablet
			)}}`
		)
	}

	if (optionsByBreakpoint.laptop) {
		rules.push(
			`@media ${deviceMaximums.laptop} {${getStackeeOptions(
				optionsByBreakpoint.laptop
			)}}`
		)
	}

	if (optionsByBreakpoint.desktop) {
		rules.push(
			`@media ${deviceMaximums.desktop} {${getStackeeOptions(
				optionsByBreakpoint.desktop
			)}}`
		)
	}

	return rules.join('\n')
}
