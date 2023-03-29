export * from './api'

export type ProviderApplication =
	| 'magic'
	| 'walletConnect'
	| 'web3auth'
	| 'safeAuthKit'

export type ProviderMethod = 'emailOtp' | 'emailMagicLink' | 'phone'

export interface WalletProviderArgs {
	providerApplication: ProviderApplication
	providerIdentifier?: string
	providerMethod?: ProviderMethod
	providerToken?: string
}
