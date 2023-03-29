import { ModalProps } from './modal.proptypes'
import { BreakPoint } from '../../utils/breakpoints'

export const getModalWidth = (size: NonNullable<ModalProps['size']>) => {
	switch (size) {
		case 'sm':
			return '400px'
		case 'md':
			return '500px'
		case 'lg':
			return '600px'
		case 'xl':
			return '936px'
		default:
			return '500px'
	}
}

export const getModalHeaderPadding = (
	size: NonNullable<ModalProps['size']>
) => {
	switch (size) {
		case 'sm':
		case 'md':
		case 'lg':
			return 'padding: 60px 0;'
		case 'xl':
			return 'padding: 40px 0;'
		default:
			return 'padding: 60px 0;'
	}
}

export const getBaseModalStyles = (size: NonNullable<ModalProps['size']>) => ({
	content: {
		background: '#000',
		borderRadius: '16px',
		border: '1px solid #212121',
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		maxHeight: 'calc(100% - 80px)',
		padding: '0px',
		transform: 'translate(-50%, -50%)',
		width: getModalWidth(size),
		maxWidth: '80%',
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
	},
})

export const getFullScreenModalStyles = (
	size: NonNullable<ModalProps['size']>
) => ({
	...getBaseModalStyles(size),
	content: {
		...getBaseModalStyles(size).content,
		top: '0',
		left: '0',
		margin: 0,
		width: '100%',
		height: '100vh',
		maxHeight: undefined,
		transform: undefined,
		border: 'none',
		borderRadius: '0px',
		maxWidth: '100%',
		display: 'flex',
	},
})
