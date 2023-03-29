import { Box } from '@/compound'
import { useRouter } from 'next/router'

const TestWidget = () => {
	const router = useRouter()
	const { mementoId, userIdOrHandle } = router.query as {
		mementoId: string
		userIdOrHandle: string
	}

	return (
		<Box>
			<iframe
				src={`${process.env.NEXT_PUBLIC_APP_URL}/${userIdOrHandle}/${mementoId}/embed`}
				width="375px"
				height="766px"
				scrolling="no"
				frameBorder="0"
				allow="clipboard-read; clipboard-write"
			></iframe>
		</Box>
	)
}

export default TestWidget
