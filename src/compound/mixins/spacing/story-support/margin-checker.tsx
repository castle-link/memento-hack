import React from 'react'
import type { ComponentType } from 'react'
import styled from 'styled-components'
import { Box } from '../../../primitives'

const OutlineBox = styled(Box)`
	border: dotted #bfbdbb 2px;
`

/**
 * A utility that lets you quickly generate stories that excercise the margin spacing props.
 *
 * This is especially useful for Eyebot regression checking.
 */
export type MarginCheckerProps<ComponentProps extends Object> = {
	Component: ComponentType<ComponentProps>
} & ComponentProps

export const MarginChecker = <ComponentProps extends Object>({
	Component,
	...props
}: MarginCheckerProps<ComponentProps>) => (
	<Box stacked="row" wrap align="start">
		{['m2', 'mt2', 'mr2', 'mb2', 'ml2', 'mv2', 'mh2'].map((m) => (
			<Box spacing="m1" key={m}>
				<code>{m}</code>
				<OutlineBox shrink={1}>
					{/** @ts-ignore */}
					<Component {...(props as unknown as ComponentProps)} spacing={m} />
				</OutlineBox>
			</Box>
		))}
	</Box>
)
