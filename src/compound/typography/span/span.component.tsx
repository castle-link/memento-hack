import styled from 'styled-components'
import { getTypographyRules } from '../../mixins/typography'
import { SpanProps } from './span.proptypes'

export const Span = styled.span<SpanProps>`
	${getTypographyRules}
`
