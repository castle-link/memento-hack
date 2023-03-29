import { Box } from '../../../primitives'
import React from 'react'
import { ComponentType } from 'react'
import styled from 'styled-components'

const ChildBox = styled(Box)`
	background: red;
	border: solid blue 1px;
	color: black;
`

/**
 * A utility that lets you quickly generate stories that excercise the margin spacing props.
 *
 * This is especially useful for Eyebot regression checking.
 */
export type StackerCheckerProps<ComponentProps> = {
	Component: ComponentType<ComponentProps>
} & ComponentProps
export const StackerChecker = <ComponentProps extends object>({
	Component,
	...props
}: StackerCheckerProps<ComponentProps>) => (
	<Box stacked="row" wrap>
		<Box grow={1}>
			<code>row</code>
			{/** @ts-ignore */}
			<Component stacked="row" {...(props as unknown as ComponentProps)}>
				<ChildBox grow={1}>1</ChildBox>
				<ChildBox grow={1}>2</ChildBox>
				<ChildBox grow={1}>3</ChildBox>
			</Component>
		</Box>
		<Box grow={1}>
			<code>column</code>
			{/** @ts-ignore */}
			<Component stacked="column" {...(props as unknown as ComponentProps)}>
				<ChildBox>1</ChildBox>
				<ChildBox>2</ChildBox>
				<ChildBox>3</ChildBox>
			</Component>
		</Box>
	</Box>
)
