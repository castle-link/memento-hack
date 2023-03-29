import { Modal } from './index'
import { Box } from '../../primitives'
import { useModal } from '../../hooks'
import { StackerArgTypes } from '../../mixins/stacker/stacker.argtypes'
import { SpaceArgTypes } from '../../mixins/spacing/spacing.arg-types'
import docs from './modal.mdx'

export default {
	component: Modal,
	title: 'Overlays/Modal',
	parameters: {
		docs: {
			page: docs,
		},
	},
	argTypes: {
		...StackerArgTypes,
		...SpaceArgTypes,
	},
}

export const Default = () => {
	const { showModal, onModalClose, onModalToggle } = useModal()
	return (
		<Box>
			<button onClick={onModalToggle}>Open Modal</button>
			<Modal open={showModal} onClose={onModalClose}>
				Hello I am a modal
			</Modal>
		</Box>
	)
}

export const Small = () => {
	return (
		<Box>
			<Modal size="sm" open onClose={() => {}}>
				Hello I am a modal
			</Modal>
		</Box>
	)
}

export const Medium = () => {
	return (
		<Box>
			<Modal size="md" open onClose={() => {}}>
				Hello I am a modal
			</Modal>
		</Box>
	)
}

export const Large = () => {
	return (
		<Box>
			<Modal size="lg" open onClose={() => {}}>
				Hello I am a modal
			</Modal>
		</Box>
	)
}

export const ExtraLarge = () => {
	return (
		<Box>
			<Modal size="xl" open onClose={() => {}}>
				Hello I am a modal
			</Modal>
		</Box>
	)
}

export const WithTitle = () => {
	return (
		<Box>
			<Modal title="BUY NFT" open onClose={() => {}}>
				Hello I am a modal
			</Modal>
		</Box>
	)
}
