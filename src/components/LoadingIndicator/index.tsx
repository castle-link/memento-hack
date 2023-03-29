import styled from 'styled-components'
import { BeatLoader } from 'react-spinners'

export const LoadingIndicator = () => {
	return (
		<Container>
			<BeatLoader size={8} color={'#fff'} loading={true} />
		</Container>
	)
}

const Container = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	min-height: 90vh;
	justify-content: center;
`
