import { getPaletteColor } from '@/compound'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export const ViewOnOpenSea = ({ address }: { address: string }) => {
	return (
		<Container
			onClick={() => {
				window.open(`https://opensea.io/assets/matic/${address}`, '_blank')
			}}
		>
			<OpenSeaIcon src={'/images/opensea.svg'} />
			View on OpenSea
		</Container>
	)
}

const Container = styled.div`
	align-items: center;
	border: 1px solid ${getPaletteColor('border-color')};
	cursor: pointer;
	display: flex;
	height: 56px;
	font-weight: 500;
	justify-content: center;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
	width: 100%;

	&:hover {
		border: 1px solid ${getPaletteColor('border-color-hover')};
	}
`

const OpenSeaIcon = styled.img`
	height: 24px;
	width: 24px;
	margin-right: 8px;
`
