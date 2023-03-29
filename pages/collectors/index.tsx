import styled from 'styled-components'

// Components
import PageContainer from '@/components/PageContainer'
import CollectorRow from '@/components/CollectorRow'
import { LoadingIndicator } from '@/components/LoadingIndicator'

// Hooks
import { useUser } from '@/hooks/useUser'

// Other
import { shortenEthAddress } from '@/utils/shortenEthAddress'
import { useSelector } from 'react-redux'
import { selectUserState } from '@/redux/user'
import { consolidateCollectors } from '@/utils/consolidateCollectors'
import { getPaletteColor } from '@/compound'
import { useMemo } from 'react'

export const CollectorsPage = () => {
	const { loading: loadingUser, handleExportCollectorEmails, user } = useUser()

	const { collectors } = useSelector(selectUserState)
	console.log(collectors)
	const consolidated = useMemo(
		() =>
			(collectors || []).length > 0
				? consolidateCollectors(collectors || []).filter(
						(collector) => collector.email !== user?.email
				  )
				: [],
		[collectors, user?.email]
	)

	return (
		<PageContainer>
			<TitleContainer>
				<Title>Your collectors</Title>
				<ExportButton onClick={handleExportCollectorEmails}>
					Export
				</ExportButton>
			</TitleContainer>
			<CollectorContainer>
				{!(consolidated?.length && consolidated?.length > 0) ? (
					<EmptyState>{`You don't have any collectors yet`}</EmptyState>
				) : (
					<Card>
						{consolidated?.map(
							(collector, key) =>
								user?.email !== collector?.email && (
									<CollectorRow
										key={key}
										id={collector?._id}
										collected={collector.collected}
										collector={
											collector.name ||
											collector.email ||
											shortenEthAddress(collector.multiSig) ||
											shortenEthAddress(collector.eoa)
										}
										profilePicUrl={collector.profilePicUrl}
									/>
								)
						)}
					</Card>
				)}
			</CollectorContainer>
		</PageContainer>
	)
}

export default CollectorsPage

const Card = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};

	&:last-child {
		border-bottom: none;
	}
`

const TitleContainer = styled.div`
	align-items: center;
	display: flex;
	height: 24px;
	justify-content: space-between;
	margin-bottom: 24px;
`

const Title = styled.div`
	font-size: 22px;
	font-weight: 600;
`

const ExportButton = styled.div`
	align-items: center;
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	display: inline-flex;
	font-size: 13px;
	font-weight: 600;
	justify-content: center;
	padding: 4px 8px;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		border: 1px solid ${getPaletteColor('border-color-hover')};
		color: ${getPaletteColor('text-main')};
	}
`

const CollectorContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
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
