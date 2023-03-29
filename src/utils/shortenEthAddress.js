export function shortenEthAddress(address) {
	if (address) return address.slice(0, 6) + '...' + address.slice(38, 42)
}

export default shortenEthAddress
