import { toNumber } from 'lodash'

export const createPopupWindow = (
	pageURL: string,
	pageTitle: string,
	width: string = '500',
	height: string = '700'
) => {
	const left = window.innerWidth / 2 - toNumber(width) / 2
	const top = window.innerHeight / 2 - toNumber(height) / 2

	window.open(
		pageURL,
		pageTitle,
		'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, ' +
			'width=' +
			width +
			', height=' +
			height +
			', top=' +
			top +
			', left=' +
			left
	)
}
