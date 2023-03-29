import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
	createRef,
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { sum } from 'lodash'
import { Box } from '../../primitives/Box/box.component'
import { getSpacingRules, SpaceProps } from '../../mixins'
import { getPaletteColor, useTheme } from '@/compound/themes'

interface TextSwitchProps extends SpaceProps {
	options: Array<{ text: string }>
	selectedIndex: number
	onClick: (index: number) => void
}

export const TextSwitch = ({
	options,
	selectedIndex,
	onClick,
	spacing,
}: TextSwitchProps) => {
	const switchOptions = useRef<RefObject<HTMLDivElement>[]>(
		options.map(createRef<HTMLDivElement>)
	)

	const getOptionWidths = useCallback(() => {
		return switchOptions.current.map(
			(ref, index) =>
				ref.current?.offsetWidth ||
				`${
					100 *
					((options[index].text.length || 0) /
						sum(options.map((option) => option.text.length || 0)))
				}%`
		)
	}, [])

	const [optionWidths, setOptionWidths] = useState(getOptionWidths())

	useEffect(() => {
		setOptionWidths(getOptionWidths())
	}, [getOptionWidths])

	const width = optionWidths[selectedIndex]

	const offSetX = sum(optionWidths.slice(0, selectedIndex))

	const { getPaletteColor: _getPaletteColor} = useTheme()

	return (
		<ToggleBox spacing={spacing}>
			<RelativeBox stacked="row">
				<motion.div
					initial={false}
					animate={{
						x: offSetX,
					}}
					transition={{ type: 'tween', duration: 0.1 }}
					style={{
						position: 'absolute',
						width,
						background: _getPaletteColor('canvas-bg'),
						height: '100%',
						borderRadius: '8px',
					}}					
				></motion.div>
				{options.map((option, index) => (
					<ToggleButton
						active={selectedIndex === index}
						onClick={() => onClick(index)}
						ref={switchOptions.current[index]}
						key={index}
					>
						{option.text}
					</ToggleButton>
				))}
			</RelativeBox>
		</ToggleBox>
	)
}

const ToggleBox = styled.div`
	background: #040404;
	border: 1px solid ${getPaletteColor('border-color-op')};
	border-radius: 8px;
	height: 48px;
	overflow: hidden;
	padding: 4px;
	position: relative;
	${getSpacingRules}
`
const ToggleButton = styled.div<{ active?: boolean }>`
align-items: center;	
	cursor: pointer;
	color: ${({ active }) => (active ? `#fff` : `rgba(255, 255, 255, 0.6)`)};
	display: flex;
	font-size: 14px;
	font-weight: 500;
	height: 38px;
	justify-content:center;
	padding: 8px;
	transition: all 0.16s linear;
	min-width: 80px;
	text-align: center;

	&:hover {
		color: color: ${getPaletteColor('text-main')};;
	}
`

const RelativeBox = styled(Box)`
	position: relative;
`
