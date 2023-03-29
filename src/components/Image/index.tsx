import styled, { CSSProperties, keyframes } from 'styled-components'
import { Image as ImageIcon } from '@styled-icons/ionicons-solid'
import Skeleton from 'react-loading-skeleton'
import { UnstyledButton } from '@/compound'
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import NextImage from 'next/image'
import ReactPlayer from 'react-player'

export const Image = ({
	src,
	className,
	onClick,
	alt,
	width,
	height,
	loading = false,
	objectFit = 'cover',
}: {
	src: string | undefined | null
	className?: string
	paletteBackground?: boolean
	onClick?: (event: SyntheticEvent<HTMLElement>) => void
	alt?: string
	width?: number
	height?: number
	loading?: boolean
	objectFit?: CSSProperties['objectFit']
}) => {
	const [isFetchingImage, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)

	const videoParentRef = useRef<any>()
	useEffect(() => {
		// check if user agent is safari and we have the ref to the container <div />
		if (videoParentRef.current) {
			// obtain reference to the video element
			const player = videoParentRef.current.children[0]

			// if the reference to video player has been obtained
			if (player) {
				// set the video attributes using javascript as per the
				// webkit Policy
				// player.controls = false
				// player.playsinline = true
				player.muted = true
				player.setAttribute('muted', '') // leave no stones unturned :)
				// player.autoplay = true

				// Let's wait for an event loop tick and be async.
				setTimeout(() => {
					// player.play() might return a promise but it's not guaranteed crossbrowser.
					const promise = player.play()
					// let's play safe to ensure that if we do have a promise
					if (promise.then) {
						promise
							.then(() => {})
							.catch(() => {
								console.log('error playing video')
							})
					}
				}, 0)
			}
		}
	}, [])

	const imageComponent = useMemo(() => {
		if (typeof src === 'string' && ReactPlayer.canPlay(src)) {
			setIsFetching(false)
			// HTML video needs some special handling for it to autoplay on mobile
			// https://medium.com/@BoltAssaults/autoplay-muted-html5-video-safari-ios-10-in-react-673ae50ba1f5
			return (
				<div
					style={{ height: '100%', width: '100vw', display: 'flex' }}
					ref={videoParentRef}
					dangerouslySetInnerHTML={{
						__html: `
						<video
						playing
						style="width: 100%; height: 100%;"
						muted
						autoPlay="autoplay"
						preload="auto"
						playsinline
						loop
						>
						<source src="${src}" type="video/mp4" />
						</video>`,
					}}
				/>
			)
		}

		return !src || hasError ? (
			<ImageMissing>
				<_ImageIcon />
			</ImageMissing>
		) : (
			<BaseImageComponent
				objectFit={objectFit}
				alt={alt}
				src={src}
				onLoadStart={() => setIsFetching(true)}
				onError={() => setHasError(true)}
				onLoad={() => {
					setIsFetching(false)
				}}
			/>
		)
	}, [objectFit, src, alt, hasError])

	return (
		<Container width={width} height={height} className={className}>
			{onClick ? (
				<ClickableBox onClick={onClick}>
					{loading || isFetchingImage ? (
						<Skeleton style={{ display: 'block' }} width="100%" height="100%" />
					) : (
						imageComponent
					)}
				</ClickableBox>
			) : loading || isFetchingImage ? (
				<Skeleton style={{ display: 'block' }} width="100%" height="100%" />
			) : (
				imageComponent
			)}
		</Container>
	)
}

export default Image

const ClickableBox = styled(UnstyledButton)`
	width: 100%;
	height: 100%;
	display: flex;
`

const VideoComponent = styled.video`
	width: 100%;
	height: 100%;
`

const _ImageIcon = styled(ImageIcon)`
	color: rgba(255, 255, 255, 0.2);
	height: 40%;
	max-height: 48px;
	min-width: 48px;
`

const Container = styled.div<{ width?: number; height?: number }>`
	overflow: hidden;
	max-width: 100%;
	max-height: 100%;
	${({ width }) => (width ? `width: ${width}px;` : '')}
	${({ height }) => (height ? `height: ${height}px;` : '')}
	display: flex;
`

const ImageMissing = styled.div`
	border-radius: 8px;
	background: #131313;
	object-fit: cover;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const fadeInAnimation = keyframes`
		0% {
      opacity: 0.2;
	
		}
		100% {
	    opacity: 1;
		}
`

const BaseImageComponent = styled.img<{
	objectFit: CSSProperties['objectFit']
}>`
	background-size: cover;
	background-position: center;

	height: 100%;
	width: 100%;
	max-height: 100vh;
	max-width: 100%;
	object-fit: ${({ objectFit }) => objectFit};
	position: relative;

	animation: ${fadeInAnimation} ease 0.16s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
`

const OptimizedImageComponent = styled(NextImage)<{
	objectFit: CSSProperties['objectFit']
}>`
	background-size: cover;
	background-position: center;

	height: 100%;
	width: 100%;
	max-height: 75vh;
	max-width: 100%;
	object-fit: ${({ objectFit }) => objectFit};
	position: relative;

	animation: ${fadeInAnimation} ease 0.16s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
`
