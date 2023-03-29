import { HydratedDocument, Model } from 'mongoose'
import type { UserDoc } from '../User/user.types'

interface IOtpCode {
	code: string
	expiresAt: Date
	userId: UserDoc['_id']
	createdAt: Date
	updatedAt: Date
}

export interface OtpCodeMethods {
	expiryMin(): number
	readableCode(): string
}

export type OtpCodeDoc = HydratedDocument<IOtpCode, OtpCodeMethods>

export interface OtpCodeModel extends Model<OtpCodeDoc> {}
