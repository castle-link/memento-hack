import type { NextApiRequest, NextApiResponse } from 'next'
import { Verifier } from '@/lib/web3auth/keys'
import { emailCheck } from '@/constants/checks'
import { sendMagicLinkEmail, sendOtpCodeEmail } from '@/lib/sendgrid'
import { User } from '@/models/User'
import moment from 'moment-timezone'
import { RequestOtpCode } from '@/types'
import connectDatabase from '@/utils/connectDatabase'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<RequestOtpCode.Response>
) {
	await connectDatabase()
	const { providerIdentifier, providerMethod, deviceName, timeZone } =
		req.body as RequestOtpCode.RequestBody

	// if (providerMethod === 'email') {
	if (!providerIdentifier || !providerIdentifier.match(emailCheck))
		return res.status(400).json({ error: 'Bad request' })

	// if (!['email'].includes(providerMethod))
	// 	return res.status(400).json({ error: 'Bad request' })

	let user
	console.log(`looking up user ${providerIdentifier}`)
	const foundUser = await User.findByEmail(providerIdentifier)

	if (foundUser) {
		console.log('User found')
		user = foundUser
		// send user magic link
		const magicLink = await user.createMagicLink()
		const createdAt = moment().tz(timeZone).format('LT on LL')
		const expiryMin = 5
		console.log({
			deviceName,
			loginUrl: magicLink,
			expiryMin,
			requestedAt: createdAt,
		})
		await sendMagicLinkEmail(providerIdentifier, {
			deviceName,
			loginUrl: magicLink,
			expiryMin,
			requestedAt: createdAt,
		})
		// At this point, we should tell the client
		// that we created a magic link
		return res
			.status(200)
			.json({ sentAt: createdAt, providerMethod: 'emailMagicLink' })
	} else {
		console.log('user not found, creating user')
		const createdUser = await User.create({
			email: providerIdentifier,
			emailVerified: false,
		})

		user = createdUser

		console.log('creating otp code')
		const otpCode = await user.createOtpCode()

		const createdAt = moment(otpCode.createdAt).tz(timeZone).format('LT on LL')

		console.log('sending otp code email')
		await sendOtpCodeEmail(providerIdentifier, {
			deviceName,
			otpCode: otpCode.readableCode(),
			expiryMin: otpCode.expiryMin(),
			requestedAt: createdAt,
		})
		// At this point, we should tell the client
		// that we created an otp
		return res
			.status(200)
			.json({ sentAt: createdAt, providerMethod: 'emailOtp' })
	}
	// }

	return res.status(400).json({ error: 'Bad request' })
}
