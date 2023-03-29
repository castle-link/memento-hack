import styled, { keyframes } from 'styled-components'
import { useState } from 'react'
import { useRouter } from 'next/router'
import _Image from '@/components/Image'
import {
	Box,
	getPaletteColor,
	UnstyledButton,
	useModal,
	useTheme,
} from '@/compound'
import { getConfig } from '@/config'
import { PopulatedClaim } from '@/models/Claim'
import { EllipsisHorizontal } from '@styled-icons/ionicons-solid'
import { CHAIN_CONFIG } from '@/constants/chainConfig'

export const ClaimedMemento = ({ claim }: { claim: PopulatedClaim }) => {
	const [hovering, setHovering] = useState(false)
	const router = useRouter()

	const { getPaletteColor } = useTheme()
	const { ref, onModalToggle, showModal, onModalClose } = useModal()

	return (
		<Container
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => {
				setHovering(false)
				onModalClose()
			}}
			onClick={() =>
				router.push(getConfig().navigation.getCollectionRoute(claim.memento))
			}
		>
			<ImageContainer>
				<Image src={claim.memento?.metadata?.mediaUrl} alt={'Media'} />
			</ImageContainer>

			{hovering && claim.transaction?.transactionHash && (
				<Box style={{ position: 'absolute', right: 12, top: 12 }} ref={ref}>
					<UnstyledButton
						onClick={(e) => {
							e.stopPropagation()
							onModalToggle()
						}}
					>
						<EllipsisHorizontal
							size={24}
							color={getPaletteColor('white')}
							style={{
								backgroundColor: getPaletteColor('canvas-bg'),
								padding: 6,
								borderRadius: '100%',
							}}
						/>
					</UnstyledButton>
					{showModal && (
						<Menu>
							{claim.transaction?.transactionHash && (
								<MenuItem
									onClick={(e) => {
										e.stopPropagation()
										onModalClose()
									}}
									href={`${CHAIN_CONFIG.blockExplorer}/tx/${claim.transaction?.transactionHash}`}
									target="_blank"
								>
									{`View on ${CHAIN_CONFIG.blockExplorerName}`}
								</MenuItem>
							)}
							{/* {claim.memento?.address && (
									<MenuItem
										onClick={(e) => {
											e.stopPropagation()
											onModalClose()
										}}
										href={`${CHAIN_CONFIG.blockExplorer}/address/${claim.memento?.address}#code`}
										target="_blank"
									>
										{`View collection on ${CHAIN_CONFIG.blockExplorerName}`}
									</MenuItem>
								)} */}
						</Menu>
					)}
				</Box>
			)}
			<InfoContainer hovering={hovering}>
				<Left>
					<Title>{claim.memento.metadata?.title}</Title>
					<Creator>{claim.memento.user?.name}</Creator>
				</Left>
				<Right>
					<Supply>
						{1} / {claim.memento.editionSize || '∞'}
					</Supply>
				</Right>
			</InfoContainer>
		</Container>
	)
}

const Container = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	cursor: pointer;
	flex-direction: column;
	position: relative;
	display: flex;
`

const ImageContainer = styled.div`
	display: inline-flex;
	justify-content: center;
	text-align: center;
	width: 100%;
`

const Image = styled(_Image)`
	width: 100%;
`

const InfoContainer = styled.div<{
	hovering: boolean
}>`
	background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
	// border-top: 1px solid ${getPaletteColor('border-color-lighter')};
	bottom: 0;
	display: flex;
	justify-content: space-between;
	padding: 88px 24px 24px;
	position: absolute;
	width: 100%;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
	opacity: ${({ hovering }) => (hovering ? 1 : 0)};
	color: ${getPaletteColor('white')};
`

const Left = styled.div`
	max-width: 75%;
`

const Title = styled.div`
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 4px;
`

const Creator = styled.div`
	color: ${getPaletteColor('greyscale-muted')};
	font-size: 16px;
`

const Right = styled.div`
	text-align: right;
`

const Supply = styled.div`
	background: ${getPaletteColor('dark-overlay-pill-bg')};
	border: 1px solid ${getPaletteColor('dark-overlay-pill-bg')};
	border-radius: 40px;
	color: ${getPaletteColor('white')};
	font-size: 13px;
	font-weight: 500;
	margin-bottom: 8px;
	padding: 2px 8px;
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
	top: 28px;
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
