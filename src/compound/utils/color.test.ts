import { fadeColor } from './color'

describe('fadeColor', () => {
	it('parses a Color object and returns a rbga that is faded', () => {
		const color = fadeColor('#fff', 0.95)

		expect(color).toBe('rgba(255, 255, 255, 0.05)')
	})

	it('parses a Color object and rounds opacity to 2 decimal places', () => {
		const color = fadeColor('#fff', 0.67)

		expect(color).toBe('rgba(255, 255, 255, 0.33)')
	})
})
