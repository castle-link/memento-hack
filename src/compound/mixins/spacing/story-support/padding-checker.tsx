import React from 'react'
import { ComponentType } from 'react'
import styled from 'styled-components'
import { Box } from '../../../primitives/Box'

const OutlineBox = styled(Box)`
	border: dotted #bfbdbb 2px;
`

/**
 * A utility that lets you quickly generate stories that excercise the padding spacing props.
 *
 * This is especially useful for Eyebot regression checking.
 */
export type PaddingCheckerProps<ComponentProps> = {
	Component: ComponentType<ComponentProps>
} & ComponentProps
export const PaddingChecker = <ComponentProps extends object>({
	Component,
	...props
}: PaddingCheckerProps<ComponentProps>) => (
	<Box stacked="row" wrap>
		{['p2', 'pt2', 'pr2', 'pb2', 'pl2', 'pv2', 'ph2'].map((m) => (
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
