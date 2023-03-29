import { getPaletteColor, useBreakPoint, useDisableBodyScroll } from '../..'
import { useMemo } from 'react'
import _Modal from 'react-modal'
import styled from 'styled-components'
import { Box } from '../../primitives'
import { ModalProps } from './modal.proptypes'
import { getBaseModalStyles, getFullScreenModalStyles } from './modal.css-rules'
import { Close } from '@styled-icons/ionicons-solid'
import { UnstyledButton } from '../../behaviours/unstyled-button/unstyled-button.component'
import { Text } from '../../typography'

const ModalHeader = ({
	title,
	onClose,
}: Pick<ModalProps, 'title' | 'onClose'>) => {
	return (
		<Box spacing="p3" stacked="row" justify="space-between" align="center">
			<Box>{title && <_Text bold>{title}</_Text>}</Box>
			<ModalCloseButton onClick={onClose}>
				<CloseIcon />
			</ModalCloseButton>
		</Box>
	)
}

export const Modal = ({
	open,
	onClose,
	title,
	size = 'md',
	children,
}: ModalProps) => {
	const breakpoint = useBreakPoint()

	const modalStyles = useMemo(
		() =>
			breakpoint === 'mobile'
				? getFullScreenModalStyles(size)
				: getBaseModalStyles(size),
		[breakpoint, size]
	)

	useDisableBodyScroll(open, 'drawer')

	return (
		<_Modal
			isOpen={open}
			style={modalStyles}
			ariaHideApp={false}
			onRequestClose={onClose}
		>
			<ModalContent stacked="column">
				<ModalHeader title={title} onClose={onClose} />
				{children}
			</ModalContent>
		</_Modal>
	)
}

const CloseIcon = styled(Close)`
	border-radius: 100%;
	color: rgba(255, 255, 255, 0.6);
	height: 32px;
	width: 32px;
	padding: 4px;
	transition: all 0.24s ease-in-out;

	&:hover {
		background-color: ${getPaletteColor('canvas-bg')};
		color: #fff;
	}
`
const ModalContent = styled(Box)`
	width: 100%;
	&:focus {
		outline: none;
	}
`

export const ModalCloseButton = styled(UnstyledButton)`
	float: right;
	position: relative;
`

const _Text = styled(Text)`
	color: color: ${getPaletteColor('text-main')};;
`
