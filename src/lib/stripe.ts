import { NextApiRequest } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { v4 } from 'uuid'

// Should only be used server side
const stripeAdminClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15',
	typescript: true,
})

export const createMerchantAccount = async (email: string) => {
	const account = await stripeAdminClient.accounts.create({
		type: 'custom',
		country: 'US',
		email,
		capabilities: {
			card_payments: { requested: true },
			transfers: { requested: true },
		},
	})

	return account
}

export const retrieveMerchantAccount = async (accountId: string) => {
	const account = await stripeAdminClient.accounts.retrieve(accountId)

	return account
}

export const createMerchantAccountLink = async (accountId: string) => {
	const accountLink = await stripeAdminClient.accountLinks.create({
		account: accountId,
		refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/mint`,
		return_url: `${process.env.NEXT_PUBLIC_APP_URL}/mint?setup_complete=true`,
		type: 'account_onboarding',
	})

	return accountLink
}

export const createProduct = async ({
	name,
	price,
	mementoSlug,
	mementoId,
	userId,
	userHandle,
}: {
	name: string
	price: number
	mementoSlug: string
	mementoId: string
	userId: string
	userHandle: string
}) => {
	const product = await stripeAdminClient.products.create({
		name,
		default_price_data: {
			currency: 'usd',
			unit_amount: price,
		},
		metadata: {
			mementoSlug,
			mementoId,
			userId,
			userHandle,
		},
	})

	return product
}

export const retrieveProduct = async (productId: string) => {
	const product = await stripeAdminClient.products.retrieve(productId)
	return product
}

export const retrievePrice = async (priceId: string) => {
	const price = await stripeAdminClient.prices.retrieve(priceId)
	return price
}

export const createCheckoutSession = async ({
	priceId,
	mementoId,
	merchantAccountId,
	userHandle,
	email,
}: {
	email: string
	mementoId: string
	userHandle: string
	priceId: string
	merchantAccountId: string
}) => {
	console.log('creating checkout session')
	const checkoutSessionId = v4()
	const session = await stripeAdminClient.checkout.sessions.create({
		mode: 'payment',
		line_items: [{ price: priceId, quantity: 1 }],
		customer_email: email,
		success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${encodeURIComponent(
			userHandle
		)}/${mementoId}?claim_success=true&checkout_session_id=${encodeURIComponent(
			checkoutSessionId
		)}`,
		cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${encodeURIComponent(
			userHandle
		)}/${mementoId}?claim_success=false`,
		client_reference_id: checkoutSessionId,
		payment_intent_data: {
			// application_fee_amount: 123,
			transfer_data: { destination: merchantAccountId },
		},
		metadata: {
			mementoId,
		},
	})

	return session
}

export const decodeWebhookRequest = async (
	request: Buffer,
	signature: string
) => {
	const event = stripeAdminClient.webhooks.constructEvent(
		request,
		signature,
		process.env.STRIPE_WEBHOOK_SECRET
	)
	return event
}
