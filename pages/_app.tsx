import { useEffect, useMemo } from 'react'
import Head from 'next/head'

import type { AppProps } from 'next/app'

import { useRouter } from 'next/router'

// Styled Components
import { ThemeProvider } from '@/compound'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Toast
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Confetti
import Confetti from '@/components/Confetti'

// Must go below react-toastify since we are overriding
import '@/styles/globals.scss'

// Redux
import { store } from '@/redux/store'
import { Provider as ReduxProvider } from 'react-redux'

// Context
import { UserContextProvider } from '@/context/user'

// Web3
import { Web3Modal } from '@web3modal/react'
import {
	EthereumClient,
	modalConnectors,
	walletConnectProvider,
} from '@web3modal/ethereum'

import { configureChains, createClient, WagmiConfig } from 'wagmi'

import { polygon, baseGoerli } from 'wagmi/chains'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getConfig } from '@/config'
import { Logger } from '@/utils/logger'
import { DisableSSR } from '@/utils/disable-ssr'
import { DataFetcher } from '@/context/Fetcher/DataFetcher'
import { NextSeo } from 'next-seo'
import { NextRequest, NextResponse } from 'next/server'
import { NavbarProvider } from '@/context/NavbarProvider'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '@/lib/queryClient'

const chains = [baseGoerli]

// Wagmi client
const { provider } = configureChains(chains, [
	walletConnectProvider({
		projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
	}),
])
const wagmiClient = createClient({
	autoConnect: true,
	connectors: modalConnectors({
		projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
		version: '1', // or "2"
		appName: 'web3Modal',
		chains,
	}),
	provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()

	const showGlobalTags = useMemo(() => {
		if (router.pathname === '/[userIdOrHandle]/[id]') return false
		return true
	}, [router])

	useEffect(() => {
		Logger.init()
		getConfig().configureStore(store)
	}, [])

	return (
		<>
			{/* {showGlobalTags && ( */}
			<NextSeo
				title={`Mint and collect amazing media | MEMENTO`}
				description="Mint and collect amazing media."
				canonical="https://memento.supply"
				openGraph={{
					url: 'https://memento.supply',
					title: 'Mint and collect amazing media | MEMENTO',
					description: 'Mint and collect amazing media | MEMENTO',
					images: [
						{
							url: `https://memento.supply/logo/banner.png`,
							alt: 'Logo',
							width: 800,
							height: 600,
							type: 'image/png',
						},
					],
				}}
				twitter={{
					cardType: 'summary_large_image',
				}}
			/>
			{/* )} */}
			<DisableSSR>
				<ThemeProvider>
					<ErrorBoundary>
						<WagmiConfig client={wagmiClient}>
							<ReduxProvider store={store}>
								<QueryClientProvider client={queryClient}>
									<UserContextProvider>
										<NavbarProvider>
											<DataFetcher>
												<ToastContainer
													autoClose={2000}
													hideProgressBar
													position="bottom-center"
													pauseOnFocusLoss={false}
													transition={Zoom}
													style={{ overflow: 'visible' }}
												/>
												<Component {...pageProps} />
												<Confetti />
											</DataFetcher>
										</NavbarProvider>
									</UserContextProvider>
								</QueryClientProvider>
							</ReduxProvider>
						</WagmiConfig>
					</ErrorBoundary>
				</ThemeProvider>
			</DisableSSR>
			<Web3Modal
				projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
				ethereumClient={ethereumClient}
			/>
		</>
	)
}

export default MyApp
