"use client"

import type React from "react"

import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { mainnet, polygon, arbitrum, optimism } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"

const config = getDefaultConfig({
  appName: "SentinelAI 4.0",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "your-project-id",
  chains: [mainnet, polygon, arbitrum, optimism],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
