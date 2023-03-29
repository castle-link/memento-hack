import { getConfig } from '@/config'
import { GetMemento } from '@/types'

export const fetchMemento = async (mementoSlugOrId: string) => {
	return getConfig().api.get<GetMemento.ResponseData>(
		`/api/mementos/${mementoSlugOrId}/details`
	)
}
