import { getSpacingRules } from '../../mixins/spacing'
import { getStackeeRules } from '../../mixins/stackee'
import { getStackerRules } from '../../mixins/stacker'
import styled from 'styled-components'
import { BoxProps } from './box.proptypes'

export const Box = styled.div<BoxProps>`
	${getStackerRules}
	${getStackeeRules}
	${getSpacingRules}
	${({ overflow }) => overflow && `overflow: ${overflow};`}
`
