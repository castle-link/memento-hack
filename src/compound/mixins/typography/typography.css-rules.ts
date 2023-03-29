import { ThemeProps, DefaultTheme } from 'styled-components'
import { ColorPaletteKey } from './../../themes/themes'
import { getPaletteColor } from '@/compound/themes/utils'
import { FONT_SIZES } from './../../themes/font-size'
import { TypographyProps } from './typography.proptypes'

export const getFontWeightRule = ({
	bold = false,
	medium = false,
}: TypographyProps) => `font-weight: ${bold ? '700' : medium ? '500' : '400'};}`

export const getSmoothingRule = ({
	bold = false,
	smooth = false,
}: TypographyProps) =>
	`${bold || smooth ? '-webkit-font-smoothing: antialiased;' : ''}
`

export const getFontSizeRule = ({ fontSize }: TypographyProps) =>
	`font-size: ${
		!fontSize
			? '14px'
			: typeof fontSize === 'number'
			? `${fontSize}px`
			: FONT_SIZES[fontSize]
	};`

export const getTextAlignmentRule = ({ align }: TypographyProps) =>
	align ? `text-align: ${align};` : ''

export const getFontColorRule = ({
	fontColor,
	theme,
}: TypographyProps & ThemeProps<DefaultTheme>) => `
	color: ${
		fontColor
			? getPaletteColor(fontColor)({ theme })
			: getPaletteColor('text-main')({ theme })
	};
	
`

export const getLineHeightRule = ({ lineHeight }: TypographyProps) =>
	lineHeight != null ? `line-height: ${lineHeight};` : ''

const getWhiteSpaceRules = ({ nowrap }: TypographyProps) =>
	`white-space: ${nowrap ? 'nowrap' : `pre-wrap`};`

const getTextOverflowRules = ({ ellipsis }: TypographyProps) =>
	`${ellipsis ? 'text-overflow: ellipsis; overflow: hidden;' : ``}`

export const getTypographyRules = (
	props: TypographyProps & ThemeProps<DefaultTheme>
) => `
	${getTextOverflowRules(props)}
	${getWhiteSpaceRules(props)}
	${getFontWeightRule(props)}
	${getLineHeightRule(props)}
	${getFontSizeRule(props)}
	${getTextAlignmentRule(props)}
	${getFontColorRule(props)}
	${getSmoothingRule(props)}
`
