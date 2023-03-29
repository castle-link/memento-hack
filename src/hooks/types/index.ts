import { BigNumberish } from 'ethers'

export interface FormData {
	type?: 'email' | 'phone'
	email: string
}

export interface CreateFormData {
	editionSize?: BigNumberish
	editions: string
	startTime: BigNumberish
	endTime?: BigNumberish
}

export interface TokenMetadata {
	title?: string
	description?: string
	media?: string
}

export interface OnboardingFormData {
	name: { value: string; error: string | null }
	bio: { value: string; error: string | null }
	handle: { value: string; error: string | null }
}
