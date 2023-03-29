import { useEffect, useState } from 'react'

// Components
import Fireworks from './Fireworks'

// Redux
import { useDispatch, useSelector } from '@/redux/hooks'
import { toggleConfetti } from '@/redux/confetti'

const ConfettiWrapper = () => {
	const [mounted, setMounted] = useState(false)

	const { confettiToggle } = useSelector((state) => state.confetti)
	const dispatch = useDispatch()

	useEffect(() => {
		if (confettiToggle) {
			setMounted(true)
			setTimeout(() => {
				setMounted(false), dispatch(toggleConfetti(false))
			}, 4000)
		}
	}, [confettiToggle])

	return <>{mounted && <Fireworks />}</>
}

export default ConfettiWrapper
