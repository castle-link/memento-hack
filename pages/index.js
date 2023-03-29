import styled from 'styled-components'

// Components
import Image from '@/components/Image'
import ConnectBox from '@/components/ConnectBox'

// Hooks
import { Button } from '@/components/Button'
import { useRouter } from 'next/router'
import { ResponsiveSpacing } from '@/compound'

const LandingPage = () => {
	const router = useRouter()

	return (
		<ResponsiveSpacing maxWidth="650px" spacing="pv15">
			<ImageContainer>
				<Image src={'/images/landing.png'} />
			</ImageContainer>

			<ConnectBox />
		</ResponsiveSpacing>
	)
}

export default LandingPage

const ImageContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 48px;
	text-align: center;
	width: 100%;
	position: relative;
`
