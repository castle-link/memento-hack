import { HydratedDocument, Model } from 'mongoose'
import type { OtpCodeDoc } from '../OtpCode'

export interface IUser {
	name: string
	bio: string
	profilePicUrl: string
	handle: string
	id: string
	email: string
	phone: string
	eoa: string
	multiSig: string
	eoaCreated: boolean
	multiSigCreated: boolean
	multiSigTransferred: boolean
	emailVerified: boolean
	phoneVerified: boolean
	salt: string
	type: string // Can be magic or walletconnect
	merchantAccountId: Maybe<string>
}

export interface UserMethods {
	createAccessToken: () => Promise<{
		accessToken: string
		accessTokenExpiry: number
	}>
	createRefreshToken: () => Promise<{
		refreshToken: string
		refreshTokenExpiry: number
	}>
	createOtpCode: () => Promise<OtpCodeDoc>
	isValidOtpCode: (code: string) => Promise<boolean>
	getHandle: () => string
	createMagicLink: () => Promise<string>
}

export type UserStatics = {
	findByEmail: (email: string) => Promise<UserDoc | null>
	findByHandle: (handle: string) => Promise<UserDoc | null>
	findByAddress: (address: string) => Promise<UserDoc | null>
}
export interface UserModel extends Model<UserDoc>, UserStatics {}

export type UserDoc = HydratedDocument<IUser, UserMethods>

export interface UserModel extends Model<UserDoc> {}

export interface TUser {
	_id: string
	handle?: string
	name?: string
	bio?: string
	profilePicUrl?: string
	email?: string
	phone?: string
	eoa: string
	multiSig?: string
	eoaCreated?: boolean
	multiSigCreated?: boolean
	multiSigTransferred?: boolean
	emailVerified?: boolean
	phoneVerified?: boolean
	salt: string
	type?: string
	merchantAccountId: Maybe<string>
}
