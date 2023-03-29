import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'
import { CHAIN_CONFIG } from '@/constants/chainConfig'
import type { ThemeName } from '@/compound'

let safeAuthKit: SafeAuthKit

export const getSafeAuthKit = async (theme?: ThemeName) => {
	if (safeAuthKit) return safeAuthKit
	const _safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
		chainId: CHAIN_CONFIG.chainId,
		authProviderConfig: {
			rpcTarget: CHAIN_CONFIG.rpcTarget,
			clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // Add your client id. Get it from the Web3Auth dashboard
			network: process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK, // The network to use for the Web3Auth modal. Use 'testnet' while developing and 'mainnet' for production use
			theme: 'light', // The theme to use for the Web3Auth modal
		},
	})

	if (!_safeAuthKit) throw new Error('Failed to initialize SafeAuthKit')

	safeAuthKit = _safeAuthKit

	return safeAuthKit
}
