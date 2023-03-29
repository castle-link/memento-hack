import { useTheme } from '@/compound'
import { ClipLoader } from 'react-spinners'

export const SpinningIndicator = ({ size = '16px' }: { size?: string }) => {
	const { getPaletteColor } = useTheme()
	return (
		<ClipLoader
			size={size}
			color={getPaletteColor('text-muted')}
			speedMultiplier={0.85}
		/>
	)
}
