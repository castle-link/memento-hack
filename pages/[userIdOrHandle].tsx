import styled from 'styled-components'

// Components
import { ClaimedMemento } from '@/components/PageComponents/Profile/ClaimedMemento'
import PageContainer from '@/components/PageContainer'
import { BeatLoader } from 'react-spinners'
import { LoadingIndicator } from '@/compound'
// Hooks
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { getConfig } from '@/config'
import { TUser } from '@/models/User'
import { DecoratedMemento, PopulatedMemento, TMemento } from '@/models/Memento'
import Image from '@/components/Image'
import { getPaletteColor } from '@/compound'
import { fetchUser } from 'src/queries/user.queries'
import Skeleton from 'react-loading-skeleton'
import { PopulatedClaim } from '@/models/Claim'
import { Person } from '@styled-icons/ionicons-outline'
import { Logger } from '@/utils/logger'

const ProfilePage = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [collected, setCollected] = useState<PopulatedClaim[]>([])
	const [user, setUser] = useState<TUser>()
	const [collections, setCollections] = useState<DecoratedMemento[]>([])
	const [collectors, setCollectors] = useState<PopulatedClaim[]>([])
	const { userIdOrHandle } = router.query as { userIdOrHandle: string }

	useEffect(() => {
		userIdOrHandle && loadProfile(userIdOrHandle)
	}, [userIdOrHandle])

	const loadProfile = async (userIdOrHandle: string) => {
		try {
			setLoading(true)

			const { collected, user, collections, collectors } = await fetchUser(
				userIdOrHandle
			)
			console.log('YO', collected, user, collections, collectors)
			setUser(user)
			setCollectors(collectors)
			setCollected(collected)
			setCollections(collections)
		} catch (e: any) {
			Logger.logError(e, 'Error loading profile')
			console.error(e)
			router.push('/404')
		} finally {
			setLoading(false)
		}
	}

	return (
		<PageContainer>
			<>
				<ProfileContainer>
					<UserContainer>
						{user?.profilePicUrl ? (
							<StyledImage
								loading={loading}
								src={user?.profilePicUrl}
								height={108}
								width={108}
							/>
						) : (
							<_Image>
								<PersonIcon size={36} />
							</_Image>
						)}
						<DisplayName>
							{loading ? (
								<Skeleton width={48} height={14} />
							) : (
								user?.name || user?.email
							)}
						</DisplayName>
						<Handle>
							{loading ? (
								<Skeleton width={48} height={14} />
							) : (
								user?.handle && `@${user?.handle}`
							)}
						</Handle>
						<Description>
							{loading ? <Skeleton width={48} height={14} /> : user?.bio}
						</Description>

						<StatsContainer>
							{loading ? (
								<Skeleton width={48} height={14} />
							) : (
								<Stat>
									<StatNumber>{collected?.length}</StatNumber>
									<StatLabel>Collected</StatLabel>
								</Stat>
							)}
							{loading ? (
								<Skeleton width={48} height={14} />
							) : (
								<Stat>
									<StatNumber>{collections?.length}</StatNumber>
									<StatLabel>Minted</StatLabel>
								</Stat>
							)}
						</StatsContainer>
					</UserContainer>
					<LoadingIndicator minHeight="400px" ready={!loading}>
						{collected?.length > 0 ? (
							<MementoContainer>
								{collected?.map((claim, key) => {
									return (
										claim.memento && <ClaimedMemento claim={claim} key={key} />
									)
								})}{' '}
							</MementoContainer>
						) : (
							<EmptyState>{`None collected yet`}</EmptyState>
						)}
					</LoadingIndicator>
				</ProfileContainer>
			</>
		</PageContainer>
	)
}

export default ProfilePage

const ProfileContainer = styled.div``

const UserContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 32px;
`

const StyledImage = styled(Image)`
	border-radius: 100%;
	height: 120px;
	width: 120px;
`
const _Image = styled.div`
	background: ${getPaletteColor('canvas-bg')};
	border-radius: 100%;
	height: 120px;
	width: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const DisplayName = styled.div`
	font-size: 24px;
	font-weight: 600;
	margin-top: 32px;
`

const Handle = styled.div`
	color: ${getPaletteColor('text-muted')};
	font-size: 18px;
	font-weight: 500;
	margin-top: 4px;
`

const Description = styled.div`
	font-size: 16px;
	margin-top: 32px;
`

const StatsContainer = styled.div`
	display: flex;
	margin-top: 64px;
	gap: 16px;
`

const Stat = styled.div`
	display: flex;
`

const StatNumber = styled.div`
	font-size: 13px;
	text-transform: uppercase;
	font-weight: 600;
	margin-right: 4px;
`

const StatLabel = styled.div`
	color: ${getPaletteColor('text-muted')};
	font-size: 13px;
	text-transform: uppercase;
	font-weight: 600;
`

const MementoContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`

const EmptyState = styled.div`
	align-items: center;
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	color: ${getPaletteColor('text-muted')};
	display: flex;
	font-weight: 500;
	height: 200px;
	justify-content: center;
`

const PersonIcon = styled(Person)`
	color: ${getPaletteColor('icon-fg')};
`
