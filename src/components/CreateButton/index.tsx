import Button from '@/components/Button'
import { useEffect } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

export const CreateButton = ({
	address,
	abi,
	functionName,
	args,
	enabled = true,
	handleSuccess,
}: {
	address: `0x${string}`
	abi: any
	functionName: string
	args: any[]
	enabled?: boolean
	handleSuccess: (hash: string) => void
}) => {
	const { config } = usePrepareContractWrite({
		address,
		abi,
		functionName,
		args,
		enabled,
	})

	const { data, write, error } = useContractWrite(config)

	const handleSubmit = async () => {
		await write?.()
	}

	useEffect(() => {
		if (data && data.hash) {
			handleSuccess(data.hash)
		}
	}, [data])
	return (
		<Button
			text="Mint"
			type="primary"
			action={handleSubmit}
			fontSize={undefined}
			height={undefined}
			margin={undefined}
			scale={undefined}
			width={undefined}
			loading={undefined}
		/>
	)
}
