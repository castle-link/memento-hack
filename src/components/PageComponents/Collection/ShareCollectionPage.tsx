import Image from '@/components/Image'
import {
	Box,
	getPaletteColor,
	UnstyledButton,
	useModal,
	useTheme,
} from '@/compound'
import PageContainer from '@/components/PageContainer'
import { TwitterButton } from '@/components/TwitterButton'
import shortenEthAddress from '@/utils/shortenEthAddress'
import { ethers } from 'ethers'
import { getConfig } from '@/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled, { keyframes } from 'styled-components'
import { DownloadButton } from '@/components/DownloadButton'
import { toast } from 'react-toastify'
import { IFrameButton } from '@/components/IFrameButton'
import { EllipsisHorizontal, Link } from '@styled-icons/ionicons-solid'
import CollectorRow from '@/components/CollectorRow'
import { ClipLoader } from 'react-spinners'
import { Label as _Label } from '@/components/Label'
import { consolidateCollectors } from '@/utils/consolidateCollectors'
import { PopulatedMemento } from '@/models/Memento'
import { PopulatedClaim, TClaim } from '@/models/Claim'
import { usePalette } from 'react-palette'
import pluralize from 'pluralize'
import { CHAIN_CONFIG } from '@/constants/chainConfig'
import { TUser } from '@/models/User'
import { Markdown } from '@/components/Markdown'

export const ShareCollectionPage = ({
	memento,
	claims,
	daysLeft,
}: {
	memento: PopulatedMemento
	claims: PopulatedClaim[]
	daysLeft?: number
}) => {
	const router = useRouter()

	const { getPaletteColor, theme } = useTheme()
	const { data: colors } = usePalette(memento?.metadata?.mediaUrl)

	const { onModalToggle, ref, showModal, onModalClose } = useModal()

	return (
		<>
			<BackgroundGradient colors={colors} themeName={theme?.name} />
			<OuterContainer>
				<Content>
					<Card>
						<ImageContainer>
							<Image
								src={memento?.metadata?.mediaUrl}
								alt={'Media for Memento'}
								objectFit="contain"
							/>
						</ImageContainer>
					</Card>

					<RightSection>
						<InfoContainer>
							<InfoRow>
								<Left>
									<Title>
										{memento ? (
											memento?.metadata?.title
										) : (
											<Skeleton width="96px" />
										)}
									</Title>

									<Creator>
										{memento?.user ? (
											memento?.user?.name ? (
												memento?.user?.name
											) : (
												ethers.utils.isAddress(
													memento?.user?.multiSig as string
												) && shortenEthAddress(memento?.user?.multiSig)
											)
										) : (
											<Skeleton width="96px" />
										)}
									</Creator>
								</Left>
								<Right>
									<Supply>
										{claims ? (
											`${claims.length} / ${
												memento?.editionSize || '∞'
											} collected`
										) : (
											<Skeleton width="80px" />
										)}{' '}
									</Supply>
									<Date>
										{daysLeft != null ? (
											`${daysLeft} ${pluralize('day', daysLeft)} remaining`
										) : !memento?.endDate ? (
											''
										) : (
											<Skeleton width="80px" />
										)}
									</Date>
								</Right>
							</InfoRow>
							{memento?.metadata?.description && (
								<DescriptionContainer>
									{memento?.metadata?.description}
								</DescriptionContainer>
							)}
						</InfoContainer>

						<SectionContainer>
							{memento.address ? (
								<>
									<Box stacked="row" justify="space-between">
										<Label>Share memento</Label>
										<Box style={{ position: 'relative' }} ref={ref}>
											<UnstyledButton onClick={onModalToggle}>
												<EllipsisHorizontal
													size={24}
													color={getPaletteColor('text-muted')}
												/>
											</UnstyledButton>
											{showModal && (
												<Menu>
													<MenuItem
														onClick={onModalClose}
														href={`${CHAIN_CONFIG.blockExplorer}/address/${memento.address}#code`}
														target="_blank"
													>
														{`View on ${CHAIN_CONFIG.blockExplorerName}`}
													</MenuItem>
												</Menu>
											)}
										</Box>
									</Box>
									<ShareButton
										onClick={() => {
											navigator.clipboard.writeText(
												`${getConfig().navigation.getCollectionRoute(memento, {
													withBaseUrl: true,
												})}`
											)
											toast.success('Copied link to collect')
										}}
									>
										<LinkIcon size="24" />
										Share link
									</ShareButton>

									<IFrameButton
										url={`${getConfig().navigation.getEmbedUrl(memento)}`}
									/>

									<TwitterButton
										name={memento?.metadata?.title}
										link={`${getConfig().navigation.getCollectionRoute(
											memento,
											{
												withBaseUrl: true,
											}
										)}`}
									/>

									{/**memento?.metadata?.mediaUrl && (
							<DownloadButton
								name={memento?.metadata?.title}
								img={memento?.metadata?.mediaUrl}
							/>
						)**/}
								</>
							) : (
								<Box stacked="row" justify="center" gap="12px" align={'center'}>
									<_Label text="Minting... This will take a moment..." />
									<ClipLoader
										size={'18px'}
										color={getPaletteColor('text-main')}
										speedMultiplier={0.85}
									/>
								</Box>
							)}
						</SectionContainer>

						{consolidateCollectors(claims).length > 0 && (
							<CollectorsContainer>
								<CollectorsLabel>Collectors</CollectorsLabel>

								{consolidateCollectors(claims).map(
									(collector: TUser & { collected: number }, key: number) => {
										console.log({ collector })
										return (
											<CollectorRow
												key={key}
												id={collector.handle || collector?._id}
												collector={
													collector?.name ||
													collector?.email ||
													shortenEthAddress(collector?.multiSig) ||
													shortenEthAddress(collector?.eoa)
												}
												collected={collector.collected}
												profilePicUrl={collector?.profilePicUrl}
												// hue={
												// 	(parseInt(collector?.multiSig as string, 16) /
												// 		10 ** 48) *
												// 	Math.random() *
												// 	360
												// }
											/>
										)
									}
								)}
							</CollectorsContainer>
						)}
					</RightSection>
				</Content>
			</OuterContainer>
		</>
	)
}

const BackgroundGradient = styled.div<{
	colors: any
	themeName: any
}>`
	background: ${({ colors, themeName }) =>
		colors &&
		`${`linear-gradient(${colors.muted}, ${
			themeName === 'dark' ? '#000' : '#F1F1F3'
		});`}`};

	height: 500px;
	opacity: 0.24;
	position: absolute;
	width: 100%;
	z-index: -1;
`

const OuterContainer = styled.div`
	display: flex;
	justify-content: center;
`

const Content = styled.div`
	display: inline-flex;
	margin: 0 auto;
	gap: 24px;
	max-width: 90rem;

	align-self: center;

	margin-top: 8rem;

	padding: 0px 16px 6rem;
	width: 100%;

	@media (max-width: 1000px) {
		display: block;
	}
`

const RightSection = styled.div`
	width: 36%;

	@media (max-width: 1000px) {
		margin-top: 24px;
		width: 100%;
	}
`

const Card = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	width: 64%;
	height: fit-content;

	@media (max-width: 1000px) {
		width: 100%;
	}
`

const ImageContainer = styled.div`
	justify-content: center;
	text-align: center;
	display: flex;
	height: 100%;
`

const InfoContainer = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	display: flex;
	flex-direction: column;
	margin-bottom: 24px;
`

const InfoRow = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 24px;
`

const DescriptionContainer = styled(Markdown)`
	border-top: 1px solid ${getPaletteColor('border-color-lighter')};
	color: ${getPaletteColor('text-muted')};
	padding: 24px;
`

const Left = styled.div``

const Title = styled.div`
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 4px;
`

const Creator = styled.div`
	color: ${getPaletteColor('text-muted')};
	font-size: 16px;
`

const Right = styled.div`
	flex-shrink: 0;
	text-align: right;
`

const Supply = styled.div`
	background: ${getPaletteColor('border-color-navbar')};
	border: 1px solid ${getPaletteColor('border-color-navbar')};
	border-radius: 40px;
	color: ${getPaletteColor('text-main')};
	font-size: 13px;
	font-weight: 500;
	margin-bottom: 8px;
	padding: 2px 8px;
`

const Date = styled.div`
	font-size: 13px;
	color: ${getPaletteColor('text-muted')};
`

const ShareButton = styled.div`
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

const LinkIcon = styled(Link)`
	margin-right: 8px;
`

const Label = styled.div`
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 8px;
`

const SectionContainer = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	gap: 16px;
	display: flex;
	flex-direction: column;
	padding: 24px;
	margin-bottom: 24px;
`

const CollectorsContainer = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};

	display: flex;
	flex-direction: column;

	&:last-child {
		border-bottom: none;
	}
`

const CollectorsLabel = styled(Label)`
	border-bottom: 1px solid ${getPaletteColor('border-color-lighter')};
	margin-bottom: 0px;
	padding: 24px 24px 24px 24px;
`

const fadeInAnimation = keyframes`
		0% {
      opacity: 0.2;
	
		}
		100% {
	    opacity: 1;
		}
`

const Menu = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color')};
	border-radius: 0px;
	top: 24px;
	box-shadow: 0px 2px 12px 2px rgba(0, 0, 0, 0.08);
	right: 0;
	position: absolute;
	width: 180px;
	z-index: 200;

	animation: ${fadeInAnimation} linear 0.24s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
`

const MenuItem = styled(UnstyledButton)`
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	align-items: center;
	display: flex;
	font-size: 14px;
	padding: 8px 8px;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		background: ${getPaletteColor('card-hover')};
		color: ${getPaletteColor('text-muted-hover')};
	}
`
