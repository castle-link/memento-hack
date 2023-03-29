import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useCallback, useState, useRef } from 'react'

export const useModal = (initialShowModal?: boolean) => {
	const ref = useRef<any>(null)
	const [showModal, setShowModal] = useState(initialShowModal || false)

	const onModalClose = useCallback(() => {
		setShowModal(false)
	}, [setShowModal])

	const onModalOpen = useCallback(() => {
		setShowModal(true)
	}, [setShowModal])

	const onModalToggle = useCallback(() => {
		setShowModal(!showModal)
	}, [setShowModal, showModal])

	useOutsideClick(ref, () => {
		if (ref) onModalClose()
	})

	return {
		showModal,
		onModalClose,
		onModalOpen,
		onModalToggle,
		ref,
	}
}
