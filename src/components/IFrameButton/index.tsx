import styled from 'styled-components'
import { CodeSlash } from '@styled-icons/ionicons-outline'
import { toast } from 'react-toastify'
import { getPaletteColor } from '@/compound'

export const IFrameButton = ({ url }: { url?: string }) => {
	const copyEmbedLink = async () => {
		navigator.clipboard.writeText(
			`<iframe src='${url}' width="375px" height="766px" scrolling="no" frameBorder="0" allow="clipboard-read; clipboard-write"/>`
		)
		toast.success('Copied code to embed')
	}
	return (
		<Container onClick={copyEmbedLink}>
			<CodeSlashIcon size="24" />
			Embed code
		</Container>
	)
}

const Container = styled.div`
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

const CodeSlashIcon = styled(CodeSlash)`
	margin-right: 8px;
`
