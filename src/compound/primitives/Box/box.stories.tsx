import React from 'react'
import styled from 'styled-components'
import { Box } from './box.component'
import { MarginChecker } from '../../mixins/spacing/story-support/margin-checker'
import { PaddingChecker } from '../../mixins/spacing/story-support/padding-checker'
import { StackerChecker } from '../../mixins/stacker/story-support/stacker-checker'
import { StackeeChecker } from '../../mixins/stackee/story-support/stackee-checker'
import docs from './box.mdx'
import { ContainerArgTypes } from '../../mixins/container/container.argtypes'
import { StackerArgTypes } from '../../mixins/stacker/stacker.argtypes'
import { StackeeArgTypes } from '../../mixins/stackee/stackee.argtypes'
import { SpaceArgTypes } from '../../mixins/spacing/spacing.arg-types'

export default {
	component: Box,
	title: 'Layout/Box',
	parameters: {
		docs: {
			page: docs,
		},
	},
	argTypes: {
		...ContainerArgTypes,
		...StackerArgTypes,
		...StackeeArgTypes,
		...SpaceArgTypes,
	},
}

const BorderBox = styled(Box)`
	border: dotted 1px #73706e;
`

const ColoredBox = styled(Box)`
	background: red;
	border: solid blue 1px;
	color: black;
	min-height: 50px;
`

export const Justify = () => (
	<>
		{'Space Between'}
		<BorderBox
			stacked="row"
			align="stretch"
			justify="space-between"
			spacing="p2"
		>
			<ColoredBox spacing={['p3', 'm1']} />
			<ColoredBox spacing={['p3', 'm1']} />
			<ColoredBox spacing={['p3', 'm1']} />
		</BorderBox>
		{'Space Around'}
		<BorderBox
			stacked="row"
			align="stretch"
			justify="space-around"
			spacing="p2"
		>
			<ColoredBox spacing={['p3', 'm1']} />
			<ColoredBox spacing={['p3', 'm1']} />
			<ColoredBox spacing={['p3', 'm1']} />
		</BorderBox>
	</>
)

export const MixinsSpacing = () => (
	<>
		<MarginChecker Component={ColoredBox}>Box</MarginChecker>
		<PaddingChecker Component={ColoredBox}>Box</PaddingChecker>
	</>
)

export const MixinsStacker = () => <StackerChecker Component={ColoredBox} />

export const MixinsStackee = () => (
	<StackeeChecker Component={ColoredBox}>Box</StackeeChecker>
)
