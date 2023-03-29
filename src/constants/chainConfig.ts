import { CHAIN_NAMESPACES } from '@web3auth/base'

const POLYGON_CHAIN_CONFIG = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: '0x89', // hex of 137, polygon mainnet
	rpcTarget: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_RPC_URL, // EVM chain's RPC endpoint
	// Avoid using public rpcTarget in production.
	// Use services like Infura, Quicknode etc
	displayName: 'Polygon Mainnet',
	blockExplorer: 'https://polygonscan.com',
	blockExplorerName: 'Polygonscan',
	ticker: 'MATIC',
	tickerName: 'Matic',
}

const GOERLI_CHAIN_CONFIG = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: '0x5', // EVM chain's Chain ID
	rpcTarget: process.env.NEXT_PUBLIC_INFURA_GOERLI_RPC_URL, // EVM chain's RPC endpoint
	// Avoid using public rpcTarget in production.
	// Use services like Infura, Quicknode, Alchemy, Ankr etc.
	displayName: 'Goerli', // EVM chain's Name
	blockExplorer: 'https://goerli.etherscan.io', // EVM chain's Blockexplorer
	blockExplorerName: 'Goerli Etherscan', // EVM chain's Blockexplorer
	ticker: 'ETH', // EVM chain's Ticker
	tickerName: 'Ethereum', // EVM chain's Ticker Name
}

const BASE_GOERLI_CHAIN_CONFIG = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: '0x14A33', // hex of 56
	rpcTarget: process.env.NEXT_PUBLIC_BASE_GEORLI_RPC_URL,
	// Avoid using public rpcTarget in production.
	// Use services like Infura, Quicknode etc
	displayName: 'Base Goerli',
	blockExplorer: 'https://goerli.basescan.org',
	blockExplorerName: 'Goerli Basescan',
	ticker: 'ETH',
	tickerName: 'Ethereum',
}

// Choose chain here
export const CHAIN_CONFIG = BASE_GOERLI_CHAIN_CONFIG
