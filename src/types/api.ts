import type { ProviderMethod, WalletProviderArgs } from '@/types'
import type { TUser } from '@/models/User'
import { PopulatedClaim, TClaim } from '@/models/Claim'
import { Stripe } from 'stripe'
import type {
	DecoratedMemento,
	PopulatedMemento,
	TMemento,
} from '@/models/Memento'

export type ApiResponse<T> = T | ApiError

export type ApiErrorClass = 'NotFound'

export type ApiError =
	| string
	| {
			error: string
			class?: ApiErrorClass
	  }
	| {
			message: string
	  }

// POST api/auth/connect
export namespace AuthenticateUser {
	export interface ResponseData {
		user: TUser
		accessToken: string
		accessTokenExpiry: number
	}

	export type Response = ApiResponse<ResponseData>

	export interface RequestBody extends WalletProviderArgs {
		signedMessage: string
		address: string
	}
}

export namespace RefreshToken {
	export interface ResponseData {
		user: TUser
		accessToken: string
		accessTokenExpiry: number
	}

	export type Response = ApiResponse<ResponseData>
}

// POST api/auth/request
export namespace RequestOtpCode {
	export interface ResponseData {
		sentAt: string
		providerMethod: ProviderMethod
	}

	export type Response = ApiResponse<ResponseData>

	export interface RequestBody extends WalletProviderArgs {
		deviceName: string
		timeZone: string
	}
}

// POST api/auth/verify
export namespace VerifyOtpCode {
	export interface ResponseData {
		connectionToken: string
	}

	export type Response = ApiResponse<ResponseData>

	export interface RequestBody extends Required<WalletProviderArgs> {}
}

export namespace CreateClaim {
	export interface ResponseData {
		claim: TClaim
	}

	export type Response = ApiResponse<ResponseData>

	export interface RequestBody {
		info: PopulatedMemento
		mementoId: string
		email?: string | null
		address?: string | null
		name: string
	}
}

export namespace GetMerchantAccount {
	export interface ResponseData {
		merchantAccount: Stripe.Account
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace GetAccountLink {
	export interface ResponseData {
		accountLink: Stripe.AccountLink
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace GetProductPrice {
	export interface ResponseData {
		price: Stripe.Price
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace GetClaim {
	export interface ResponseData {
		claim: TClaim
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace GetCheckoutSession {
	export interface ResponseData {
		session: Stripe.Checkout.Session
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace GetUser {
	export interface ResponseData {
		user: TUser
		collections: DecoratedMemento[]
		collected: PopulatedClaim[]
		collectors: PopulatedClaim[]
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace UpdateUser {
	export interface ResponseData {
		user: TUser
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace GetMemento {
	export interface ResponseData {
		memento: PopulatedMemento
		claims: PopulatedClaim[]
	}

	export type Response = ApiResponse<ResponseData>
}

export namespace CreateMemento {
	export interface ResponseData {
		memento: PopulatedMemento
		collections: any
		product: any
	}

	export type Response = ApiResponse<ResponseData>
}
