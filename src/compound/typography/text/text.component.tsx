import styled from 'styled-components'
import { getTypographyRules } from '../../mixins/typography'
import { getSpacingRules } from '../../mixins/spacing'
import { getStackeeRules } from '../../mixins/stackee'
import { TextProps } from './text.proptypes'

export const Text = styled.p<TextProps>`
	${getTypographyRules}
	${getSpacingRules}
	${getStackeeRules}
`
