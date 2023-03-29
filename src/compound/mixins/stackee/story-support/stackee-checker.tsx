import { Box } from '../../../primitives'
import React from 'react'
import { ComponentType } from 'react'
import styled from 'styled-components'

const RowContainer = styled(Box)`
	border: dashed 1px #73706e;
	width: 100%;
`

/**
 * A utility that lets you quickly generate stories that excercise the stackee props
 * for a given component.
 *
 * This is especially useful for Eyebot regression checking.
 */

export type StackeeCheckerProps<ComponentProps> = {
	Component: ComponentType<ComponentProps>
} & ComponentProps
export const StackeeChecker = <ComponentProps extends object>({
	Component,
	...props
}: StackeeCheckerProps<ComponentProps>) => (
	<>
		<code>shrink: 1, grow: 1, basis: 300</code>
		<br />
		<code>shrink: 2, grow: 2, basis: 300</code>
		<br />
		<code>shrink: 3, grow: 3, basis: 300</code>
		<br />

		<RowContainer stacked="row">
			{/** @ts-ignore */}
			<Component
				{...(props as unknown as ComponentProps)}
				shrink={1}
				grow={1}
				basis={300}
				title="shrink={1} grow={1} basis={300}"
			/>
			{/** @ts-ignore */}
			<Component
				{...(props as unknown as ComponentProps)}
				shrink={2}
				grow={2}
				basis={300}
				title="shrink={2} grow={2} basis={300}"
			/>
			{/** @ts-ignore */}
			<Component
				{...(props as unknown as ComponentProps)}
				shrink={3}
				grow={3}
				basis={300}
				title="shrink={3} grow={3} basis={300}"
			/>
		</RowContainer>
	</>
)
