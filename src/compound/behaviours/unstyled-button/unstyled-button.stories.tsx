import React from 'react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { UnstyledButton } from './unstyled-button.component'
import { UnstyledButtonProps } from './unstyled-button.proptypes'
import { MarginChecker } from '../../mixins/spacing/story-support/margin-checker'
import { PaddingChecker } from '../../mixins/spacing/story-support/padding-checker'
import { StackeeChecker } from '../../mixins/stackee/story-support/stackee-checker'
import { StackerChecker } from '../../mixins/stacker/story-support/stacker-checker'
import { SpaceArgTypes } from '../../mixins/spacing/spacing.arg-types'
import { StackerArgTypes } from '../../mixins/stacker/stacker.argtypes'
import { StackeeArgTypes } from '../../mixins/stackee/stackee.argtypes'
import { ContainerArgTypes } from '../../mixins/container'
import { FocusEventsArgTypes } from '../../mixins/focus'
import docs from './unstyled-button.mdx'

export default {
	component: UnstyledButton,
	title: 'Behaviours/Unstyled Button',
	parameters: {
		docs: {
			page: docs,
		},
	},
	argTypes: {
		...ContainerArgTypes,
		...SpaceArgTypes,
		...StackerArgTypes,
		...StackeeArgTypes,
		...FocusEventsArgTypes,
	},
}

const DEFAULT_PROPS: UnstyledButtonProps = {
	onClick: action('unstyled button clicked'),
}

export const Default = () => (
	<UnstyledButton {...DEFAULT_PROPS}>I am an unstyled button.</UnstyledButton>
)

export const AsALink = () => (
	<UnstyledButton {...DEFAULT_PROPS} href="https://castle.link" target="_blank">
		I am an unstyled link
	</UnstyledButton>
)

export const FocusStyles = () => (
	<>
		<UnstyledButton {...DEFAULT_PROPS}>
			I am an unstyled button with a regular focus state.
		</UnstyledButton>
		<br />
		<UnstyledButton {...DEFAULT_PROPS} insetFocus>
			I am an unstyled button with a inset focus state.
		</UnstyledButton>
	</>
)

const BorderedUnstyledButton = styled(UnstyledButton)`
	background: yellow;
	border: solid red 1px;
	color: blue};
`
export const MixinsSpacing = () => (
	<>
		<MarginChecker Component={BorderedUnstyledButton} {...DEFAULT_PROPS}>
			Click me
		</MarginChecker>
		<PaddingChecker Component={BorderedUnstyledButton} {...DEFAULT_PROPS}>
			Click me
		</PaddingChecker>
	</>
)

export const MixinsStackee = () => (
	<StackeeChecker Component={BorderedUnstyledButton} {...DEFAULT_PROPS}>
		Click me
	</StackeeChecker>
)

export const MixinsStacked = () => (
	<StackerChecker
		Component={BorderedUnstyledButton}
		{...DEFAULT_PROPS}
		spacing="p1"
	/>
)
