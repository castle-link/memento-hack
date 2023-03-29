import { Magic } from 'magic-sdk'
import { Magic as MagicAdminSdk } from '@magic-sdk/admin'

let magicSdk: Magic

export const getMagicSdk = () => {
	console.log('getting magic sdk')
	if (magicSdk) return magicSdk
	magicSdk = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY)
	return magicSdk
}

let magicAdminSdk: MagicAdminSdk

export const getMagicAdminSdk = () => {
	if (magicAdminSdk) return magicAdminSdk
	magicAdminSdk = new MagicAdminSdk(process.env.NEXT_PUBLIC_MAGIC_API_KEY)
	return magicAdminSdk
}
