import React from 'react'
import styled from 'styled-components'
import { Grid } from './grid.component'
import { GridItem } from './grid-item'
import { ContainerArgTypes } from '../../mixins/container'
import docs from './grid.recipes.mdx'
import { Box } from '../../primitives/Box'

const Card = styled(Box)`
	background-color: #fff;
	border-radius: 5px;
	color: black;
`

export default {
	title: 'Layout/Grid/Page Level Responsive Columns',
	parameters: {
		docs: {
			page: docs,
		},
	},
	argTypes: {
		...ContainerArgTypes,
	},
}

export const TwoColumnLayout = () => (
	<Grid>
		<GridItem sm={12} md={7} lg={8} xl={9}>
			<Card spacing={['p2', 'mb2']}>
				<code>
					<pre>
						{`<GridItem
  sm={12}
  md={7}
  lg={8}
  xl={9
/>`}
					</pre>
				</code>
			</Card>
		</GridItem>
		<GridItem sm={12} md={5} lg={4} xl={3}>
			<Card spacing="p2">
				<code>
					<pre>
						{`<GridItem
  sm={12}
  md={5}
  lg={4}
  xl={3}
/>`}
					</pre>
				</code>
			</Card>
		</GridItem>
	</Grid>
)

export const OneColumnLayout = () => (
	<>
		<Grid>
			<GridItem
				sm={12}
				md={6}
				lg={4}
				xl={6}
				offsetMd={3}
				offsetLg={4}
				offsetXl={3}
			>
				<Card spacing={['p2', 'mb2']}>
					<code>
						<pre>
							{`<GridItem
  sm={12}
  md={6}
  lg={4}
  xl={6}
  offsetMd={3}
  offsetLg={4}
  offsetXl={3}
/>`}
						</pre>
					</code>
				</Card>
			</GridItem>
		</Grid>
		<Grid>
			<GridItem
				sm={12}
				md={8}
				lg={6}
				xl={4}
				offsetMd={2}
				offsetLg={3}
				offsetXl={4}
			>
				<Card spacing="p2">
					<code>
						<pre>
							{`<GridItem
  sm={12}
  md={8}
  lg={6}
  xl={4}
  offsetMd={2}
  offsetLg={3}
  offsetXl={4}
/>`}
						</pre>
					</code>
				</Card>
			</GridItem>
		</Grid>
	</>
)
