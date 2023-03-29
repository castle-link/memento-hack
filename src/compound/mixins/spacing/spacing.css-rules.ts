import { breakPointSizes } from './../../utils/breakpoints'
import { SPACING, type SpacingKey } from '../../themes/spacing'
import { compact } from 'lodash'
import {
	SpaceProps,
	SpaceValue,
	ResponsiveSpaceValue,
} from './spacing.proptypes'
import { mediaSelector, breakPoints, BreakPoint } from '../../utils/breakpoints'

const _getSpacingAmount = (regex: RegExp, key: SpaceValue) => {
	const keys = Array.isArray(key) ? key : [key]
	const [heightKey] = keys.filter((k) => regex.test(k))

	if (!heightKey) {
		return
	}
	const regexResult = regex.exec(heightKey)
	if (regexResult === null) return '0'
	const [, level] = regexResult
	if (level === '0' || level === 'auto') {
		return level
	}
	return level != null ? SPACING[`s${level}` as SpacingKey] : '0'
}

export const getSpacingTop = (key: SpaceValue, mOrP: 'm' | 'p') =>
	_getSpacingAmount(
		mOrP === 'm' ? /^m[vt]?([0-9]{1,2})$/ : /^p[vt]?([0-9]{1,2})$/,
		key
	)

export const getSpacingRight = (key: SpaceValue, mOrP: 'm' | 'p') =>
	_getSpacingAmount(
		mOrP === 'm' ? /^m[hr]?([0-9]{1,2}|auto)$/ : /^p[hr]?([0-9]{1,2})$/,
		key
	)

export const getSpacingBottom = (key: SpaceValue, mOrP: 'm' | 'p') =>
	_getSpacingAmount(
		mOrP === 'm' ? /^m[vb]?([0-9]{1,2}|auto)$/ : /^p[bv]?([0-9]{1,2})$/,
		key
	)

export const getSpacingLeft = (key: SpaceValue, mOrP: 'm' | 'p') =>
	_getSpacingAmount(
		mOrP === 'm' ? /^m[hl]?([0-9]{1,2}|auto)$/ : /^p[hl]?([0-9]{1,2})$/,
		key
	)

const getSpacingOptions = (spacing?: SpaceValue): string => {
	if (!spacing) {
		return ''
	}

	// Set spacing for all breakpoints.
	const marginTop = getSpacingTop(spacing, 'm')
	const marginRight = getSpacingRight(spacing, 'm')
	const marginBottom = getSpacingBottom(spacing, 'm')
	const marginLeft = getSpacingLeft(spacing, 'm')
	const paddingTop = getSpacingTop(spacing, 'p')
	const paddingRight = getSpacingRight(spacing, 'p')
	const paddingBottom = getSpacingBottom(spacing, 'p')
	const paddingLeft = getSpacingLeft(spacing, 'p')

	const rules = []
	if (marginTop) {
		rules.push(`margin-top: ${marginTop};`)
	}
	if (marginRight) {
		rules.push(`margin-right: ${marginRight};`)
	}
	if (marginBottom) {
		rules.push(`margin-bottom: ${marginBottom};`)
	}
	if (marginLeft) {
		rules.push(`margin-left: ${marginLeft};`)
	}
	if (paddingTop) {
		rules.push(`padding-top: ${paddingTop};`)
	}
	if (paddingRight) {
		rules.push(`padding-right: ${paddingRight};`)
	}
	if (paddingBottom) {
		rules.push(`padding-bottom: ${paddingBottom};`)
	}
	if (paddingLeft) {
		rules.push(`padding-left: ${paddingLeft};`)
	}

	return rules.join('\n')
}

// For embedding in a template string.
export const getSpacingRules = ({ spacing }: SpaceProps): string => {
	if (!spacing) {
		return ''
	}

	if (typeof spacing === 'string' || Array.isArray(spacing)) {
		return getSpacingOptions(spacing)
	}

	const rules = []
	if (spacing.mobile != null) {
		rules.push(
			`@media ${mediaSelector.mobile} {${getSpacingOptions(spacing.mobile)}}`
		)
	}

	if (spacing.tablet != null || spacing.mobile != null) {
		rules.push(
			`@media ${mediaSelector.tablet} {${getSpacingOptions(
				spacing.tablet || spacing.mobile
			)}}`
		)
	}

	if (
		spacing.laptop != null ||
		spacing.tablet != null ||
		spacing.mobile != null
	) {
		rules.push(
			`@media ${mediaSelector.laptop} {${getSpacingOptions(
				spacing.laptop || spacing.tablet || spacing.mobile
			)}}`
		)
	}

	if (
		spacing.desktop != null ||
		spacing.laptop != null ||
		spacing.tablet != null ||
		spacing.mobile != null
	) {
		rules.push(
			`@media ${mediaSelector.desktop} {${getSpacingOptions(
				spacing.desktop || spacing.laptop || spacing.tablet || spacing.mobile
			)}}`
		)
	}

	return rules.join('\n')
}

const getEffectiveBreakPoint = (
	spacing: ResponsiveSpaceValue,
	currentBreakPoint: BreakPoint
): BreakPoint => {
	const currentIndex = breakPoints.findIndex((bp) => bp === currentBreakPoint)
	const candidateBreakPoints = compact(
		breakPoints
			.slice(0, currentIndex + 1)
			.filter((bp) => !!spacing[bp])
			.reverse()
	)

	return candidateBreakPoints[0] ?? 'mobile'
}

// Gets the space value that's active in the current breakpoint.
export const getEffectiveSpaceValue = (
	spacing: SpaceValue | ResponsiveSpaceValue | undefined | null,
	currentBreakPoint: BreakPoint
): SpaceValue | undefined | null => {
	if (
		spacing == null ||
		typeof spacing === 'string' ||
		Array.isArray(spacing)
	) {
		return spacing as SpaceValue
	}

	return spacing[getEffectiveBreakPoint(spacing, currentBreakPoint)]
}

export const getResponsiveSpacing = ({
	maxWidth = '1320px',
}: {
	maxWidth: string
}) => {
	return `
		${maxWidth ? `max-width: ${maxWidth};` : ''} 
		margin: 0 auto;
		width: 100%;

		padding-left: 16px;
		padding-right: 16px;

		@media (min-width: ${breakPointSizes.tablet}px) {
			padding-left: 40px;
			padding-right: 40px;								
		}	
	`
}
