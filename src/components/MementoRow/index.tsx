import { useRouter } from 'next/router'
import styled from 'styled-components'

// Icons
import { ChevronForward } from '@styled-icons/ionicons-sharp'
import Image from '@/components/Image'
import { getPaletteColor } from '@/compound'
import { DecoratedMemento } from '@/models/Memento'
import { getConfig } from '@/config'

export const MementoRow = ({ memento }: { memento: DecoratedMemento }) => {
	const router = useRouter()

	return (
		<Container
			onClick={() =>
				router.push(getConfig().navigation.getCollectionRoute(memento))
			}
		>
			<Left>
				{memento.metadata?.mediaUrl && (
					<Image
						src={memento.metadata?.mediaUrl}
						height={64}
						width={64}
						alt={'Media for Memento'}
						objectFit={'contain'}
					/>
				)}
				<Info>
					<Name>{memento.metadata?.title}</Name>
					<Supply>{memento.claimed?.toString()} collected</Supply>
				</Info>
			</Left>
			<_ChevronForward size="20" />
		</Container>
	)
}

export default MementoRow

// Styles
const Container = styled.div`
	align-items: center;
	background-color: ${getPaletteColor('card-bg')};
	border-bottom: 1px solid ${getPaletteColor('border-color-lighter')};
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	padding: 8px 16px 8px 8px;

	&:hover {
		background-color: rgba(255, 255, 255, 0.04);
	}
`
const Left = styled.div`
	align-items: center;
	display: flex;
`

const Info = styled.div`
	margin-left: 16px;
`
const Name = styled.div`
	margin-bottom: 2px;
`
const Supply = styled.div`
	color: ${getPaletteColor('text-muted')};
`
const _ChevronForward = styled(ChevronForward)`
	color: ${getPaletteColor('text-muted')};
`
