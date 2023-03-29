/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'storage.opensea.io',
			'assets.coingecko.com',
			'token-icons.s3.amazonaws.com',
			'openseauserdata.com',
			'res.cloudinary.com',
		],
	},
	compiler: {
		// Enables the styled-components SWC transform
		styledComponents: true,
	},
}
