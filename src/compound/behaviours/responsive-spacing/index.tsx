import { BoxProps } from '@/compound/primitives/Box/box.proptypes'
import styled from 'styled-components'
import {
	ContainerProps,
	getResponsiveSpacing,
	getSpacingRules,
} from '../../mixins'
import { Box } from '../../primitives'

export const ResponsiveSpacing = ({
	maxWidth = '1320px',
	children,
	...boxProps
}: {
	maxWidth?: string
} & ContainerProps &
	BoxProps) => (
	<ResponsiveContainer {...boxProps} maxWidth={maxWidth}>
		{children}
	</ResponsiveContainer>
)

const ResponsiveContainer = styled(Box)<{ maxWidth: string }>`
	${getResponsiveSpacing}
	${getSpacingRules}
`
