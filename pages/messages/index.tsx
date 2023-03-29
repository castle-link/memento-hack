import styled from 'styled-components'

// Components
import PageContainer from '@/components/PageContainer'

// Hooks
import { useUser } from '@/hooks/useUser'
import { getPaletteColor } from '@/compound'

export const MessagesPage = () => {
	const { handleExportCollectorEmails } = useUser()
	return (
		<PageContainer>
			<Title>Messages</Title>
			<EmptyState>
				<Text>Sending emails directly is coming soon.</Text>
				<Subtext>
					In the meantime, you can export your collector list to send emails.
				</Subtext>
				<ExportButton onClick={handleExportCollectorEmails}>
					Export
				</ExportButton>
			</EmptyState>
		</PageContainer>
	)
}

export default MessagesPage

const Title = styled.div`
	font-size: 18px;
	font-weight: 500;
	margin-bottom: 32px;
`

const EmptyState = styled.div`
	align-items: center;
	border: 1px solid ${getPaletteColor('border-color-lighter')};
	display: flex;
	flex-direction: column;
	height: 250px;
	justify-content: center;
	width: 100%;
`

const Text = styled.div`
	margin-bottom: 4px;
`

const Subtext = styled.div`
	color: ${getPaletteColor('text-muted')};
	margin-bottom: 40px;
`

const ExportButton = styled.div`
	align-items: center;
	border: 1px solid ${getPaletteColor('border-color')};
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	display: inline-flex;
	font-weight: 500;
	justify-content: center;
	padding: 4px 8px;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		border: 1px solid ${getPaletteColor('border-color-hover')};
		color: ${getPaletteColor('text-main')};
	}
`
