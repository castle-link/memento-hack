import { css } from 'styled-components'

import type { UnstyledButtonProps } from './unstyled-button.proptypes'
import { getBaseFocusState } from '../../mixins/focus'
import { getSpacingRules } from '../../mixins/spacing'
import { getStackerRules } from '../../mixins/stacker'
import { getStackeeRules } from '../../mixins/stackee'

export const getFocusState = ({
	hasTransition = true,
}: {
	hasTransition?: boolean
}) =>
	hasTransition
		? getBaseFocusState({})
		: getBaseFocusState({ baseTransition: false, hoverTransition: false })

export const commonStyles = css<UnstyledButtonProps>`
	background: transparent;
	border: 0;
	border-radius: 0px;
	color: inherit;
	font: inherit;
	line-height: 1;
	padding: 0;
	text-align: inherit;
	${getFocusState}
	${getSpacingRules}
	${getStackerRules}
	${getStackeeRules}

	&:focus-visible {
		box-shadow: 0 0 0 2px #000;
	}
`
