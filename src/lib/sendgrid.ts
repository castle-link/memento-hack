import MailService, { MailDataRequired } from '@sendgrid/mail'

MailService.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string)

const createEmail = ({
	to,
	from,
	subject,
	text,
	html,
	templateId,
	dynamicTemplateData,
}: MailDataRequired) => {
	return {
		to,
		from,
		subject,
		text,
		html,
		templateId,
		dynamicTemplateData,
	}
}

export const sendMagicLinkEmail = async (
	to: string,
	{
		loginUrl,
		deviceName,
		expiryMin,
		requestedAt,
	}: {
		loginUrl: string
		deviceName: string
		expiryMin: number
		requestedAt: string
	}
) => {
	const email = createEmail({
		to,
		from: { name: 'Memento', email: 'memento@castle.link' },
		templateId: 'd-b2f865b3e26e4d66a7e67ed9f42b52f3',
		dynamicTemplateData: {
			loginUrl,
			deviceName,
			expiryMin,
			requestedAt,
		},
	}) as MailDataRequired
	await sendEmail(email)
}

export const sendOtpCodeEmail = async (
	to: string,
	{
		otpCode,
		deviceName,
		expiryMin,
		requestedAt,
	}: {
		otpCode: string
		deviceName: string
		expiryMin: number
		requestedAt: string
	}
) => {
	const email = createEmail({
		to,
		from: { name: 'Memento', email: 'memento@castle.link' },
		templateId: 'd-5ac3979081a44b2296f95b77ecff31bf',
		dynamicTemplateData: { otpCode, deviceName, expiryMin, requestedAt },
	}) as MailDataRequired

	await sendEmail(email)
}

const createClaimEmail = ({
	to,
	name,
	url,
	imageUrl,
}: {
	to: string
	name: string
	url: string
	imageUrl: string
}) => {
	console.log('Sending email with', {
		to,
		name,
		url,
		imageUrl,
	})
	if (checkURL(imageUrl))
		return createEmail({
			to,
			from: { name: 'Memento', email: 'memento@castle.link' },
			templateId: 'd-a30dc2f5e3814cae89ac4bf0ce023a16',
			dynamicTemplateData: { name, url, imageUrl },
		})
	else
		return createEmail({
			to,
			from: { name: 'Memento', email: 'memento@castle.link' },
			templateId: 'd-7148cb5770fe450d8762bd1846b533b5',
			dynamicTemplateData: { name, url, videoUrl: imageUrl },
		})
}

const sendEmail = async (email: MailDataRequired) => {
	try {
		const res = await MailService.send(email)
	} catch (e: any) {
		console.error(e)
	}
}

export const sendClaimEmail = async ({
	to,
	name,
	url,
	imageUrl,
}: {
	to: string
	name: string
	url: string
	imageUrl: string
}) => {
	const email = createClaimEmail({
		to,
		name,
		url,
		imageUrl,
	}) as MailDataRequired
	await sendEmail(email)
}

function checkURL(url: string) {
	return url.match(/\.(jpeg|jpg|gif|png)$/) != null
}
