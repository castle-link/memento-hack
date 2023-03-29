import styled from 'styled-components'
import Image from 'next/image'

// Icons
import { ChevronForward } from '@styled-icons/ionicons-sharp'
import { Person } from '@styled-icons/ionicons-outline'
import { getPaletteColor } from '@/compound'
import { useRouter } from 'next/router'
import { TUser } from '@/models/User'

export const CollectorRow = ({
	id,
	collector,
	collected,
	profilePicUrl,
}: {
	id: string
	collector?: string
	collected: number
	profilePicUrl?: string | null
}) => {
	const router = useRouter()

	return (
		<Container onClick={() => router.push(`/${id}`)}>
			<Left>
				<ImageContainer>
					{profilePicUrl ? (
						<StyledImage
							src={profilePicUrl}
							height={48}
							width={48}
							alt={'Profile pic of collector'}
							loading={'lazy'}
						/>
					) : (
						<ImagePlaceholder>
							<PersonIcon size="18" />
						</ImagePlaceholder>
					)}
				</ImageContainer>
				<Info>
					<Name>{collector || 'Anonymous collector'}</Name>
					<Supply>{collected} collected</Supply>
				</Info>
			</Left>
			<_ChevronForward size="20" />
		</Container>
	)
}

export default CollectorRow

// Styles
const Container = styled.div`
	align-items: center;
	border-bottom: 1px solid ${getPaletteColor('border-color-lighter')};
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	padding: 16px 16px 16px 24px;

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

const ImageContainer = styled.div`
	width: 48px;
`

const ImagePlaceholder = styled.div`
	align-items: center;
	background: ${getPaletteColor('canvas-bg')};
	border-radius: 100%;
	cursor: pointer;
	display: flex;
	height: 40px;
	justify-content: center;
	width: 40px;
`
const StyledImage = styled(Image)`
	border-radius: 100%;
	object-fit: cover;
`

const PersonIcon = styled(Person)`
	color: ${getPaletteColor('icon-fg')};
`

const _ChevronForward = styled(ChevronForward)`
	color: ${getPaletteColor('text-muted')};
`
