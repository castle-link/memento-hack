import styled from 'styled-components'

interface PageContainerProps {
	children: React.ReactNode
	marginBottom?: string
	paddingTop?: string
	width?: string
}

const PageContainer = ({
	children,
	marginBottom,
	paddingTop,
	width,
}: PageContainerProps) => {
	return (
		<OuterContainer>
			<Container
				marginBottom={marginBottom}
				paddingTop={paddingTop}
				width={width}
			>
				{children}
			</Container>
		</OuterContainer>
	)
}

export default PageContainer

const OuterContainer = styled.div`
	display: flex;
	justify-content: center;
`

const Container = styled.div<Omit<PageContainerProps, 'children'>>`
	display: inline-block;
	margin: 0 auto;
	width: ${(props) => (props.width ? props.width : '50rem')};
	margin-bottom: ${(props) =>
		props.marginBottom ? props.marginBottom : '120px'};
	padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '56px')};
	padding-left: 16px;
	padding-right: 16px;
	max-width: 100%;
`
