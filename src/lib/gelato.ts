import {
	GelatoRelayAdapter,
	MetaTransactionOptions,
} from '@safe-global/relay-kit'

export const handleSponsorTransaction = async (
	target: string,
	encodedTransaction: string,
	chainId: number,
	gelatoApiKey: string
) => {
	console.log('Using Gelato Relay Kit to sponsor transaction')
	const relayAdapter = new GelatoRelayAdapter(gelatoApiKey)
	const relayResponse = await relayAdapter.sponsorTransaction(
		target,
		encodedTransaction,
		chainId
	)
	console.log({ relayResponse })
	return relayResponse
}

export const getTaskStatus = async (taskId: string, gelatoApiKey: string) => {
	// Can add workers for these; add these to our db
	const relayAdapter = new GelatoRelayAdapter(gelatoApiKey)
	const taskStatus = await relayAdapter.getTaskStatus(taskId)
	console.log({ taskStatus })
	return taskStatus
}
