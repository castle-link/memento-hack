import styled from 'styled-components'
import { useRouter } from 'next/router'

// Components
import PageContainer from '@/components/PageContainer'
import { Button } from '@/components/Button'
import MementoRow from '@/components/MementoRow'

// Hooks
import { useSelector } from 'react-redux'
import { selectUserState } from '@/redux/user'
import { getPaletteColor } from '@/compound'

const HomePage = () => {
	const router = useRouter()
	const { created: collections } = useSelector(selectUserState)

	return (
		<PageContainer>
			<>
				<Title>Home</Title>
				<Button
					type="secondary"
					text="+ Mint new"
					action={() => router.push('/mint')}
				/>
				<Label>Your mints</Label>
				<MementoContainer>
					{collections && collections?.length > 0 ? (
						collections?.map((memento, key) => {
							return (
								memento && (
									<div key={key}>
										<MementoRow memento={memento} />
									</div>
								)
							)
						})
					) : (
						<EmptyState>{`You haven't minted any mementos yet`}</EmptyState>
					)}
				</MementoContainer>
			</>
		</PageContainer>
	)
}

export default HomePage

const Title = styled.div`
	font-size: 22px;
	font-weight: 600;
	height: 24px;
	margin-bottom: 24px;
`

const Label = styled.div`
	font-size: 22px;
	font-weight: 600;
	height: 24px;
	margin: 64px 0px 24px 0px;
`

const MementoContainer = styled.div`
	background: ${getPaletteColor('card-bg')};
	border: 1px solid ${getPaletteColor('border-color-lighter')};

	&:last-child {
		border-bottom: none;
	}
`

const EmptyState = styled.div`
	align-items: center;
	color: ${getPaletteColor('text-muted')};

	font-weight: 500;
	display: flex;
	height: 200px;
	justify-content: center;
`
