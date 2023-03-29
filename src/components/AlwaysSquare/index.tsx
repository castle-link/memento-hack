import styled from 'styled-components'
import { ReactNode } from 'react'

/**
 * Displays an Image at a fixed width and adjusts the height of the image to ensure that the image is always a square
 * Great for images that have their widths set by the parent elements but still need to remain square.
 * @param {string} imageUrl
 * @param {string} width css property value to be used for the with of the image
 **/
export const AlwaysSquare = ({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<SquareSpacer className={className}>
			<ContentContainer>{children}</ContentContainer>
		</SquareSpacer>
	)
}

const SquareSpacer = styled.div`
	width: 100%;
	max-width: 100%;
	position: relative;

	&::before {
		padding-bottom: 100%;
		content: '';
		display: block;
	}
`

const ContentContainer = styled.div`
	width: 100%;
	height: 100%;
	top: 0;
	position: absolute;
`
