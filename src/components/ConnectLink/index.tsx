import { getPaletteColor } from '@/compound'
import styled from 'styled-components'

export const ConnectLink = ({ onConnect }: { onConnect: () => void }) => {
	return <Text onClick={onConnect}>Or connect with wallet</Text>
}

const Text = styled.div`
	color: ${getPaletteColor('text-muted')};
	cursor: pointer;
	display: inline-block;
	font-size: 14px;
	font-weight: 500;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);

	&:hover {
		text-decoration: underline;
	}
`
