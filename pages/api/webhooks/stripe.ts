import { decodeWebhookRequest } from './../../../src/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { Stripe } from 'stripe'
import { buffer } from 'micro'
import { User } from '@/models/User'
import { Memento } from '@/models/Memento'
import { isObjectIdOrHexString } from 'mongoose'
import connectDatabase from '@/utils/connectDatabase'

export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log('Received stripe webhook event')

	const sig = req.headers['stripe-signature'] as string

	const buf = await buffer(req)
	let event: Stripe.Event
	try {
		event = await decodeWebhookRequest(buf, sig)
	} catch (err: any) {
		console.log('Error decoding webhook request', err.message)
		return res.status(401).send(`Webhook Error: ${err.message}`)
	}

	await connectDatabase()

	console.log({ event })
	switch (event.type) {
		case 'checkout.session.async_payment_failed':
			const checkoutSessionAsyncPaymentFailed = event.data.object
			// console.log({ checkoutSessionAsyncPaymentFailed })
			// Then define and call a function to handle the event checkout.session.async_payment_failed
			break
		case 'checkout.session.async_payment_succeeded':
			const checkoutSessionAsyncPaymentSucceeded = event.data.object
			// console.log({ checkoutSessionAsyncPaymentSucceeded })
			// Then define and call a function to handle the event checkout.session.async_payment_succeeded
			break
		case 'checkout.session.completed':
			const checkoutSessionCompleted = event.data.object as any
			// console.log({ checkoutSessionCompleted })

			if (checkoutSessionCompleted.payment_status === 'paid') {
				const email = checkoutSessionCompleted.customer_details.email as string

				const user = await User.findByEmail(email)

				console.log({ user })

				if (!user) {
					console.log('User not found')
					return res.status(400).json({ error: 'User not found' })
				}

				const mementoId = checkoutSessionCompleted.metadata.mementoId as string
				const checkoutSessionId =
					checkoutSessionCompleted.client_reference_id as string

				console.log({ mementoId, checkoutSessionId })
				if (!mementoId) {
					console.log('Memento not found')
					return res.status(400).json({ error: 'Memento not found' })
				}
				const memento = isObjectIdOrHexString(mementoId)
					? await Memento.findById(mementoId)
					: await Memento.findOne({ slug: mementoId })

				if (!memento)
					return res.status(400).json({ error: 'Memento not found' })

				memento.createClaim({ user, checkoutSessionId })
			}
			// Then define and call a function to handle the event checkout.session.completed
			break
		case 'checkout.session.expired':
			const checkoutSessionExpired = event.data.object
			// console.log({ checkoutSessionExpired })
			// Then define and call a function to handle the event checkout.session.expired
			break
		// ... handle other event types
		default: {
			console.log(`Unhandled event type ${event.type}`)
		}
	}

	console.log({ event: event.data.object })

	return res.status(200).send('OK')
}
