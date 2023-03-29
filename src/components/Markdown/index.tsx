import { UnstyledButton } from '@/compound'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import remarkBreaks from 'remark-breaks'

const SC = {
	P: styled('p')(({ theme }) => ({
		whiteSpace: 'pre-wrap',
	})),
}

export const Markdown = ({
	children,
	className,
}: {
	children: string
	className?: string
}) => {
	return (
		<ReactMarkdown
			className={className}
			remarkPlugins={[remarkBreaks]}
			components={{
				a: ({ node, ...props }) => (
					<UnstyledButton
						target="_blank"
						href={props.href}
						style={{ color: '#1CB0FF' }}
						{...(props as any)}
					/>
				),
			}}
		>
			{`${children.replace(/\n/gi, '\n\f')}`}
		</ReactMarkdown>
	)
}
