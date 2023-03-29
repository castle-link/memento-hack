import { PopulatedClaim, TClaim } from '@/models/Claim'
import { TUser } from '@/models/User'

export const consolidateCollectors = (claims: PopulatedClaim[]) => {
	let consolidated: Array<TUser & { collected: number }> = []
	for (let i = 0; i < claims.length; i++) {
		console.log(i, claims[i].user?.multiSig)
		const index = consolidated.findIndex(
			(user) => user?.multiSig === claims[i].user?.multiSig
		)

		if (index == -1)
			consolidated.push({
				...claims[i].user,
				collected: claims.filter((claim) => {
					return claim?.user?.email === claims[i]?.user?.email
				}).length,
			})
	}
	console.log({ consolidated })
	return consolidated
}
