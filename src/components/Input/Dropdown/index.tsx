import styled from 'styled-components'
import { useState } from 'react'

// Icons
import { Code } from '@styled-icons/ionicons-solid'
import { getPaletteColor } from '@/compound'

const Dropdown = ({
	onChange,
	value,
}: {
	onChange: (fieldName: string, value: any) => void
	value: string
}) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [inputText, setInputText] = useState(value)
	const handleClick = (value: string) => {
		setMenuOpen(!menuOpen)
		setInputText(value)
		onChange('editions', value)
	}
	return (
		<OuterContainer>
			<Container onClick={() => setMenuOpen(!menuOpen)}>
				<Input>{inputText}</Input>
				<CodeIcon size="18" />
			</Container>
			{menuOpen && (
				<Menu>
					<Item onClick={() => handleClick('fixed')}>Fixed</Item>
					{/* <Item onClick={() => handleClick('unlimited')}>
						Unlimited
					</Item> */}
				</Menu>
			)}
		</OuterContainer>
	)
}

export default Dropdown

const OuterContainer = styled.div`
	position: relative;
	width: 60%;
`

const Container = styled.div`
	align-items: center;
	border: 1px solid ${getPaletteColor('border-color')};
	cursor: pointer;
	display: flex;
	height: 48px;
	justify-content: space-between;
	padding: 0px 16px;
	width: 100%;
`

const Menu = styled.div`
	background: #000;
	border: 1px solid ${getPaletteColor('border-color')};
	position: absolute;
	top: 56px;
	width: 100%;
	z-index: 1000;
`

const Item = styled.div`
	align-items: center;
	cursor: pointer;
	display: flex;
	height: 40px;
	padding: 0px 16px;
	transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
	width: 100%;

	&:hover {
		background: rgba(255, 255, 255, 0.08);
	}
`

const Input = styled.div`
	text-transform: capitalize;
`

const CodeIcon = styled(Code)`
	color: rgba(255, 255, 255, 0.6);
	opacity: 0.6;
	transform: rotate(90deg);
`
