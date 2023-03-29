declare type Maybe<T> = T | null

declare type MaybePopulated<DocumentType, populated> = populated extends true
	? DocumentType
	: DocumentType extends { _id: string }
	? string
	: DocumentType['_id']

declare type Address = `0x${string}`
