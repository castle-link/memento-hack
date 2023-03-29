import React from 'react'
import styled from 'styled-components'
import { times } from 'lodash'
import { Box } from '../../primitives'
import { Grid } from './grid.component'
import { GridItem } from './grid-item'
import docs from './grid.mdx'

const Card = styled(Box)`
	background-color: #fff;
	border-radius: 5px;
`

export default {
	component: Grid,
	title: 'Layout/Grid',
	parameters: {
		docs: {
			page: docs,
		},
	},
}

export const FullGrid = () => (
	<Grid>
		{times(12, (i) => (
			<GridItem key={`key-${i}`} sm={1}>
				<Card spacing={['ph1', 'pv3', 'mv3']} />
			</GridItem>
		))}
	</Grid>
)

const ChildBox = styled(Box)`
	background: yellow;
	border: solid red 1px;
	color: black;
	height: 25px;
	width: 25px;
`

export const MixinsStacking = () => (
	<Grid>
		<GridItem sm={6} stacked="row">
			<ChildBox grow={1}>1</ChildBox>
			<ChildBox grow={1}>2</ChildBox>
			<ChildBox grow={1}>3</ChildBox>
		</GridItem>
		<GridItem sm={6} stacked="column">
			<ChildBox>1</ChildBox>
			<ChildBox>2</ChildBox>
			<ChildBox>3</ChildBox>
		</GridItem>
	</Grid>
)
