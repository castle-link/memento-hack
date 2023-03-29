import styled from 'styled-components'
import { Download } from '@styled-icons/ionicons-outline'
import makeId from '@/utils/makeId'
import { getPaletteColor } from '@/compound'

export const DownloadButton = ({
	name,
	img,
}: {
	name: string
	img: string
}) => {
	const download = async () => {
		const res = await fetch(img)
		const type = img.includes('.mp4') ? '.mp4' : '.png'

		res.arrayBuffer().then(function (buffer) {
			const url = window.URL.createObjectURL(new Blob([buffer]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute(
				'download',
				// `${name.split(' ').join('_').toLowerCase()}.png`
				`${makeId(5)}${type}`
			)
			document.body.appendChild(link)
			link.click()
		})
	}
	return (
		<Container onClick={download}>
			<DownloadIcon size="24" />
			Download
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
	font-weight: 500;
	justify-content: center;
	text-transform: uppercase;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
	width: 100%;

	&:hover {
		border: 1px solid ${getPaletteColor('border-color-hover')};
	}
`

const DownloadIcon = styled(Download)`
	margin-right: 8px;
`
