import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { GridItemProps } from './grid-item.proptypes'
import {
	widthSm,
	widthMd,
	widthLg,
	widthXl,
	paddingLeftSm,
	paddingLeftMd,
	paddingLeftLg,
	paddingLeftXl,
} from './grid-item.css-rules'
import { breakPointSizes } from '../../../utils/breakpoints'
import { getStackerRules } from '../../../mixins/stacker'

export const GridItem: FunctionComponent<GridItemProps> = styled.div<GridItemProps>`
	padding-left: ${paddingLeftSm};
	width: ${widthSm};
	${getStackerRules}

	@media (min-width: ${breakPointSizes.tablet}px) {
		padding-left: ${paddingLeftMd};
		width: ${widthMd};
	}

	@media (min-width: ${breakPointSizes.laptop}px) {
		padding-left: ${paddingLeftLg};
		width: ${widthLg};
	}

	@media (min-width: ${breakPointSizes.desktop}px) {
		padding-left: ${paddingLeftXl};
		width: ${widthXl};
	}
`

GridItem.displayName = 'GridItem'
