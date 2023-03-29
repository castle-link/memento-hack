import { TTransaction } from './../Transaction/transaction.types'
import type { TMemento } from '@/models/Memento'
import { HydratedDocument, Model, ObjectId } from 'mongoose'
import type { TUser } from '../User'

export interface IClaim {
	memento: ObjectId
	user: ObjectId
	checkoutSessionId: string | null
	transaction: string | null
}

export interface ClaimMethods {}

export interface ClaimModel extends Model<ClaimDoc> {}

export type ClaimDoc = HydratedDocument<IClaim, ClaimMethods>

export interface ClaimModel extends Model<ClaimDoc> {}

export interface TClaim<
	userPopulated = false,
	mementoPopulated = false,
	transactionPopulated = false
> {
	memento: MaybePopulated<TMemento<true>, mementoPopulated>
	user: MaybePopulated<TUser, userPopulated>
	transaction: MaybePopulated<TTransaction, transactionPopulated> | null
	checkoutSessionId: string | null
}

export type PopulatedClaim = TClaim<true, true, true>
