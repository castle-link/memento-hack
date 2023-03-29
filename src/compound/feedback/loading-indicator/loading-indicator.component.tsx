import styled from 'styled-components'
import { Box } from '../../primitives'
import { LoadingIndicatorProps } from './loading-indicator.proptypes'
import { BeatLoader } from 'react-spinners'
import { useTheme } from '@/compound/themes'

export const LoadingIndicator = ({
	ready,
	minHeight,
	children,
}: LoadingIndicatorProps) => {
	const { getPaletteColor } = useTheme()
	if (!ready)
		return (
			<LoaderContainer
				stacked="column"
				justify="center"
				align="center"
				minHeight={minHeight}
			>
				<BeatLoader
					size={8}
					color={getPaletteColor('text-muted')}
					loading={!ready}
				/>
			</LoaderContainer>
		)

	return <div>{children}</div>
}

const LoaderContainer = styled(Box)<{ minHeight?: string }>`
	${({ minHeight }) => (minHeight ? `min-height: ${minHeight};` : '')}
`
