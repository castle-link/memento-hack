import type { NextApiRequest, NextApiResponse } from 'next'
import { Verifier } from '@/lib/web3auth/keys'
import { emailCheck } from '@/constants/checks'
import { sendOtpCodeEmail } from '@/lib/sendgrid'
import { User } from '@/models/User'
import moment from 'moment-timezone'
import { VerifyOtpCode } from '@/types'
import connectDatabase from '@/utils/connectDatabase'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<VerifyOtpCode.Response>
) {
	await connectDatabase()
	const {
		providerIdentifier,
		providerMethod,
		providerToken,
		providerApplication,
	} = req.body as VerifyOtpCode.RequestBody

	// if (providerMethod === 'emailOtp') {
	if (!providerIdentifier || !providerIdentifier.match(emailCheck))
		return res.status(400).json({ message: 'Missing provider identifer' })

	if (!['emailOtp'].includes(providerMethod))
		return res.status(400).json({ message: 'Bad request' })

	if (!['web3auth'].includes(providerApplication))
		return res.status(400).json({ message: 'Bad request' })

	if (!providerToken) return res.status(400).json({ message: 'Bad request' })

	const user = await User.findByEmail(providerIdentifier)

	if (!user) return res.status(400).json({ message: 'Bad request' })

	const isValid = await user.isValidOtpCode(providerToken)

	console.log({ isValid })

	if (!isValid) return res.status(401).json({ message: 'Invalid token' })

	const verifier = new Verifier()

	const connectionToken = await verifier.createSignedJwt({
		sub: providerIdentifier,
	})

	return res.status(200).json({ connectionToken })
	// }

	return res.status(400).json({ message: 'Bad request' })
}
