import { HydratedDocument, Model, ObjectId } from 'mongoose'
import { ClaimDoc } from '../Claim'
import type { TUser, UserDoc } from '../User'

export interface IMemento<userPopulated = false> {
	metadata: {
		// User provides this
		mediaUrl: string
		title: string
		description: string
	}
	name: string // We create this
	symbol: string // We create this
	editionSize?: string // User provides this
	editions: string // Can be fixed or unlimited
	startDate: Date // User provides this
	endDate?: Date // User provides this
	user: MaybePopulated<UserDoc, userPopulated>
	transactionHash?: string
	address?: string
	slug: string
	snapshotUrl?: string
	gelatoTaskId?: { type: String }
	productId?: string
}

export interface MementoMethods {
	createClaim(
		this: MementoDoc,
		args: { user: UserDoc; checkoutSessionId?: string }
	): Promise<{ claim: ClaimDoc }>
	fetchDecorated(this: MementoDoc): Promise<DecoratedMemento>
}

export interface MementoModel extends Model<MementoDoc> {}

export type MementoDoc = HydratedDocument<IMemento, MementoMethods>

export interface MementoModel extends Model<MementoDoc> {}

export interface TMemento<userPopulated = false> {
	_id?: string
	metadata: {
		mediaUrl: string
		title: string
		description: string | null
	}
	name: string
	symbol?: string
	editionSize?: string
	editions?: string
	startDate: string
	endDate: string
	user: MaybePopulated<TUser, userPopulated>
	transactionHash?: string
	address?: string
	slug: string
	snapshotUrl?: string
	gelatoTaskId?: string
	productId?: string
}

export interface DecoratedMemento extends PopulatedMemento {
	claimed?: number
}

export interface PopulatedMemento extends TMemento<true> {}
