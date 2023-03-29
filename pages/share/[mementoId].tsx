import styled from 'styled-components'
import { useRouter } from 'next/router'

// Components
import PageContainer from '@/components/PageContainer'
import CollectorRow from '@/components/CollectorRow'
import Skeleton from 'react-loading-skeleton'
import Image from '@/components/Image'
import { DownloadButton } from '@/components/DownloadButton'
import { TwitterButton } from '@/components/TwitterButton'
import { IFrameButton } from '@/components/IFrameButton'
import { LoadingIndicator } from '@/components/LoadingIndicator'

// Constants

// Icons
import { Link } from '@styled-icons/ionicons-solid'
import { useEffect, useState } from 'react'

import { shortenEthAddress } from '@/utils/shortenEthAddress'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { getConfig } from '@/config'
import { getPaletteColor } from '@/compound'
import { PopulatedMemento } from '@/models/Memento'
import { GetMemento } from '@/types'
import { PopulatedClaim, TClaim } from '@/models/Claim'
import { fetchMemento } from '@/queries/memento.queries'
import { TUser } from '@/models/User'
import { consolidateCollectors } from '@/utils/consolidateCollectors'

const MementoPage = () => {
	const router = useRouter()
	const { mementoId } = router.query as { mementoId: string }
	const [memento, setMemento] = useState<PopulatedMemento>()
	const [claims, setClaims] = useState<PopulatedClaim[]>([])
	const [daysLeft, setDaysLeft] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		mementoId && handleInitialLoad()
	}, [mementoId])

	const handleInitialLoad = async () => {
		try {
			setLoading(true)

			const { memento, claims } = await fetchMemento(mementoId)

			var date1 = new window.Date(memento.startDate)
			var date2 = new window.Date(memento.endDate)
			// To calculate the time difference of two dates
			var diffTime = date2.getTime() - date1.getTime()
			// To calculate the no. of days between two dates
			var days = diffTime / (1000 * 3600 * 24)
			setDaysLeft(Math.ceil(days))
			setMemento(memento)
			setClaims(claims)
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<PageContainer>
			{loading ? (
				<LoadingIndicator />
			) : (
				<>
					<ImageContainer>
						<Image
							src={memento?.metadata?.mediaUrl}
							alt={'Media for Memento'}
							objectFit={'cover'}
						/>
					</ImageContainer>

					<InfoContainer>
						<Left>
							<Title>
								{memento ? memento?.metadata?.title : <Skeleton width="96px" />}
							</Title>
							<Creator>
								{memento?.user ? (
									memento?.user?.name ? (
										memento?.user?.name
									) : (
										ethers.utils.isAddress(memento?.user?.multiSig as string) &&
										shortenEthAddress(memento?.user?.multiSig)
									)
								) : (
									<Skeleton width="96px" />
								)}
							</Creator>
						</Left>
						<Right>
							<Supply>
								{memento ? (
									`${claims.length} / ${memento?.editionSize || '∞'} collected`
								) : (
									<Skeleton width="80px" />
								)}{' '}
							</Supply>
							<Date>
								{daysLeft > 0 ? (
									`${daysLeft} days remaining`
								) : !memento?.endDate ? (
									'Unlimited claim period'
								) : (
									<Skeleton width="80px" />
								)}
							</Date>
						</Right>
					</InfoContainer>
					<DescriptionContainer>
						{memento?.metadata?.description}
					</DescriptionContainer>
					<ButtonContainer>
						<TwitterButton
							name={memento?.metadata?.title}
							link={
								memento &&
								`${
									process.env.NEXT_PUBLIC_APP_URL
								}${getConfig().navigation.getCollectionRoute(memento)}`
							}
						/>
						<ShareButton
							onClick={() => {
								if (!memento) return
								navigator.clipboard.writeText(
									`${getConfig().navigation.getCollectionRoute(memento, {
										withBaseUrl: true,
									})}`
								)
								toast.success('Copied collect link')
							}}
						>
							<LinkIcon size="24" />
							Copy collect link
						</ShareButton>
						{memento?.metadata?.mediaUrl && (
							<DownloadButton
								name={memento?.metadata?.title}
								img={memento?.metadata?.mediaUrl}
							/>
						)}
						<IFrameButton
							url={memento && `${getConfig().navigation.getEmbedUrl(memento)}`}
						/>
					</ButtonContainer>

					{claims.length > 0 && (
						<div>
							<Label>Collectors</Label>
							<CollectorContainer>
								{consolidateCollectors(claims).map((collector, key: number) => {
									return (
										<CollectorRow
											key={key}
											id={collector.handle || collector._id}
											collector={
												collector?.name ||
												collector?.email ||
												shortenEthAddress(collector?.multiSig) ||
												shortenEthAddress(collector?.eoa)
											}
											collected={1}
											profilePicUrl={collector?.profilePicUrl}
											// hue={
											// 	(parseInt(collector?.user?.multiSig, 16) / 10 ** 48) *
											// 	Math.random() *
											// 	360
											// }
										/>
									)
								})}
							</CollectorContainer>
						</div>
					)}
				</>
			)}
		</PageContainer>
	)
}

export default MementoPage

const ImageContainer = styled.div`
	justify-content: center;
	margin-bottom: 32px;
	text-align: center;
`

const InfoContainer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 24px;
`

const Left = styled.div``

const Title = styled.div`
	margin-bottom: 4px;
`

const Creator = styled.div`
	color: ${getPaletteColor('text-muted')};
`

const Right = styled.div`
	text-align: right;
`

const Supply = styled.div`
	margin-bottom: 4px;
`

const Date = styled.div`
	color: ${getPaletteColor('text-muted')};
`

const ShareButton = styled.div`
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

const LinkIcon = styled(Link)`
	margin-right: 8px;
`

const Label = styled.div`
	font-size: 18px;
	font-weight: 500;
	margin: 56px 0px 24px 0px;
`

const CollectorContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const ButtonContainer = styled.div`
	margin: 8px 0px;
	gap: 16px;
	display: flex;
	flex-direction: column;
`

const DescriptionContainer = styled.div`
	margin: 0px 0px 24px 0px;
`
