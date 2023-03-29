import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// Components
import PageContainer from '@/components/PageContainer'
import { DownloadButton } from '@/components/DownloadButton'
import { TwitterButton } from '@/components/TwitterButton'
import { Image } from '@/components/Image'
import { Link } from '@styled-icons/ionicons-solid'
import { toast } from 'react-toastify'
import Skeleton from 'react-loading-skeleton'
import { getPaletteColor, LoadingIndicator } from '@/compound'
import { getConfig } from '@/config'
import { PopulatedMemento } from '@/models/Memento'
import { fetchMemento } from '@/queries/memento.queries'

const CollectedPage = () => {
	const router = useRouter()
	const { mementoId } = router.query as { mementoId: string }
	const [memento, setMemento] = useState<PopulatedMemento>()
	const [daysLeft, setDaysLeft] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		mementoId && handleInitialLoad()
	}, [mementoId])

	const handleInitialLoad = async () => {
		try {
			setLoading(true)
			const { memento } = await fetchMemento(mementoId)
			setMemento(memento)

			setDaysLeft(
				Math.ceil(
					(new window.Date(memento?.endDate).getTime() -
						new window.Date(memento?.startDate).getTime()) /
						(1000 * 3600 * 24)
				)
			)
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return loading ? (
		<LoadingIndicator minHeight={'100vh'} />
	) : (
		<PageContainer>
			<CollectedText>
				<Title>Collected {memento?.metadata?.title}!</Title>
				<Subtext>{`We've sent you an email to confirm`}</Subtext>
			</CollectedText>
			<ImageContainer>
				<Image
					src={memento?.metadata?.mediaUrl}
					alt={'Media'}
					objectFit={'cover'}
				/>
			</ImageContainer>
			<ButtonContainer>
				<TwitterButton
					name={memento?.metadata?.title}
					link={
						memento &&
						`${getConfig().navigation.getCollectionRoute(memento, {
							withBaseUrl: true,
						})}`
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
						toast.success('Copied share link')
					}}
				>
					<LinkIcon size="20" />
					Copy share link
				</ShareButton>
				{memento?.metadata?.mediaUrl && (
					<DownloadButton
						name={memento?.metadata?.title}
						img={memento?.metadata?.mediaUrl}
					/>
				)}
			</ButtonContainer>
		</PageContainer>
	)
}

export default CollectedPage

const ImageContainer = styled.div`
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	justify-content: center;
	margin-bottom: 32px;
	text-align: center;
`

const CollectedText = styled.div`
	text-align: center;
	margin-bottom: 40px;
`

const Title = styled.div`
	margin-bottom: 2px;
`

const Subtext = styled.div`
	color: ${getPaletteColor('text-muted')};
`

const ButtonContainer = styled.div`
	margin: 8px 0px;
	gap: 16px;
	display: flex;
	flex-direction: column;
`

const UnstyledButton = styled.div`
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	font-weight: 600;
	text-align: center;
	width: 100%;
	padding: 40px 0px;
	&:hover {
		color: rgba(255, 255, 255, 1);
	}
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
