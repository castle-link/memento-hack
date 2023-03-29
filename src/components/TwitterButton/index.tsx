import styled from 'styled-components'
import { LogoTwitter } from '@styled-icons/ionicons-solid'
import { useMemo } from 'react'
import { getPaletteColor } from '@/compound'

export const TwitterButton = ({
	name,
	link,
}: {
	name?: string
	link?: string
}) => {
	const encodedUrl = useMemo(() => {
		return link && encodeURIComponent(link)
	}, [link])

	const encodedName = useMemo(() => {
		return name && encodeURIComponent(name)
	}, [name])
	return (
		<Container
			onClick={() =>
				window.open(
					`https://twitter.com/intent/tweet?original_referer=${encodeURIComponent(
						'https://memento.supply'
					)}&text=Collect%20${encodedName}%20on&url=${encodedUrl}`,
					'_blank'
				)
			}
		>
			<TwitterIcon size="24" />
			Share to Twitter
		</Container>
	)
}

const Container = styled.div`
	align-items: center;
	background-color: ${getPaletteColor('secondary-base')};
	color: ${getPaletteColor('secondary-fg')};
	border: 1px solid ${getPaletteColor('border-color')};
	cursor: pointer;
	display: flex;
	height: 56px;
	font-weight: 600;
	justify-content: center;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
	width: 100%;

	&:hover {
		border: 1px solid ${getPaletteColor('border-color-hover')};
	}
`

const TwitterIcon = styled(LogoTwitter)`
	margin-right: 8px;
`
