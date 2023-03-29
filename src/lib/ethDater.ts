import EthDater from 'ethereum-block-by-date'
import { getAlchemyProvider } from './alchemy'

const dater = new EthDater(getAlchemyProvider())

export const dateToBlockRange = async (date: Date) => {
	const beginningOfDay = date.setUTCHours(0, 0, 0, 0)
	const endOfDay = date.setUTCHours(23, 59, 59, 999)
	const { block: startBlock } = await dater.getDate(beginningOfDay, false)
	const { block: endBlock } = await dater.getDate(endOfDay, false)

	return { startBlock, endBlock }
}

export const dateRangeToBlockRange = async (startDate: Date, endDate: Date) => {
	const { block: startBlock } = await dater.getDate(startDate, false)
	const { block: endBlock } = await dater.getDate(endDate, false)

	return { startBlock, endBlock }
}

export const dateFromBlock = async (blockNumber: number) =>
	new Date((await getAlchemyProvider().getBlock(blockNumber)).timestamp * 1000)
