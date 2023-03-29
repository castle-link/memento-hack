import Head from 'next/head'

interface HeadSeoProps {
	title: string
	description: string
	canonicalUrl: string
	ogTwitterImage: string
	ogType: string
	ogImageUrl?: string
	children?: React.ReactNode
}

export const HeadSeo = ({
	title,
	description,
	canonicalUrl,
	ogTwitterImage,
	ogType,
	ogImageUrl,
	children,
}: HeadSeoProps) => {
	const siteMetadata = {
		companyName: 'Castle',
		siteUrl: 'https://memento.supply',
		siteLogo: 'https://memento.supply/logo/logo.png',
		siteLogoSquare: 'https://memento.supply/logo/logo.png',
		email: 'team@castle.link',
		twitter: 'https://twitter.com/castlelinkhq',
		twitterHandle: '@castlelinkhq',
	}

	return (
		<Head>
			<title>{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content={description} />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content={siteMetadata.twitterHandle} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogTwitterImage} />
			<link rel="canonical" href={canonicalUrl} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:site_name" content={siteMetadata.companyName} />
			<meta property="og:type" content={ogType} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImageUrl} />
			<meta property="og:url" content={canonicalUrl} />
			{children}
		</Head>
	)
}
