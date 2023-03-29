import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { GridProps } from './grid.proptypes'
import { gutterSize } from './grid.css-rules'
import { breakPointSizes } from '../../utils/breakpoints'

const GridInternals = styled.div`
	display: flex;
	flex-wrap: wrap;

	@media (min-width: ${breakPointSizes.tablet}px) {
		margin-right: -${gutterSize};

		> * {
			box-sizing: border-box;

			/* over-compensate for gutter size while considering container padding */

			/* no overflow right now because gutterSize === containerPaddingSm */

			/* if gutterSize > containerPaddingSm we will have horizontal scrolling < bpMedium */
			padding-right: ${gutterSize};
		}
	}
`

const GridWrapper = styled.div`
	box-sizing: border-box;

	/* center container */
	margin-left: auto;
	margin-right: auto;
	width: 100%;
`

export const Grid: FunctionComponent<GridProps> = styled(
	({ children, ...props }: GridProps) => (
		<GridWrapper {...props}>
			<GridInternals {...props}>{children}</GridInternals>
		</GridWrapper>
	)
)``

Grid.displayName = 'Grid'
