// Enhanced RainbowKit Wallet Integration for SentinelAI 4.0
import { getDefaultConfig, getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { createConfig, http, type Config } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia, type Chain } from 'wagmi/chains'
import { EventEmitter } from 'events'

// Import additional wallet connectors
import {
  phantomWallet,
  braveWallet,
  okxWallet,
  trustWallet,
  ledgerWallet,
  imTokenWallet,
  oneInchWallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets'

// Custom Cardano chain configuration
const cardano = {
  id: 1815,
  name: 'Cardano',
  network: 'cardano',
  nativeCurrency: {
    decimals: 6,
    name: 'ADA',
    symbol: 'ADA',
  },
  rpcUrls: {
    public: { http: ['https://cardano-mainnet.blockfrost.io/api/v0'] },
    default: { http: ['https://cardano-mainnet.blockfrost.io/api/v0'] },
  },
  blockExplorers: {
    default: { name: 'Cardanoscan', url: 'https://cardanoscan.io' },
  },
} as const

export class WalletIntegration extends EventEmitter {
  private wagmiConfig: Config
  private chains: readonly [Chain, ...Chain[]]
  private currentAccount: string | null = null
  private supportedTokens: Map<string, TokenInfo> = new Map()

  constructor() {
    super()
    this.initializeWalletIntegration()
  }

  private async initializeWalletIntegration() {
    console.log('[Wallet] Initializing enhanced wallet integration...')
    
    // Configure supported chains and wagmi config
    this.setupWagmiConfig()
    
    // Configure supported tokens
    this.setupSupportedTokens()
    
    console.log('[Wallet] Enhanced wallet integration ready')
  }

  private setupWagmiConfig() {
    // Define supported chains
    this.chains = [
      mainnet,
      polygon,
      arbitrum,
      optimism,
      base,
      sepolia, // For testing
    ] as const

    // Create wagmi config using getDefaultConfig which includes RainbowKit integration
    this.wagmiConfig = getDefaultConfig({
      appName: 'SentinelAI 4.0',
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
      chains: this.chains,
      transports: {
        [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo'}`),
        [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo'}`),
        [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo'}`),
        [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo'}`),
        [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo'}`),
        [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo'}`),
      },
      ssr: true, // Enable server-side rendering support
    })
  }

  // Get enhanced wallet configuration for RainbowKit
  static getEnhancedWalletConfig() {
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo'
    
    // Get default wallets (MetaMask, WalletConnect, Coinbase, Rainbow)
    const { wallets } = getDefaultWallets({
      appName: 'SentinelAI 4.0',
      projectId,
    })

    // Configure enhanced wallet connectors with additional wallets
    const enhancedConnectors = connectorsForWallets([
      // Popular wallets group (includes defaults)
      ...wallets,
      
      // Browser & Extension Wallets
      {
        groupName: 'Browser Wallets',
        wallets: [
          braveWallet({}),
          okxWallet({}),
          oneInchWallet({}),
        ],
      },

      // Mobile & Multi-Chain Wallets
      {
        groupName: 'Mobile Wallets',
        wallets: [
          phantomWallet({}),
          trustWallet({}),
          imTokenWallet({}),
        ],
      },

      // Hardware Wallets
      {
        groupName: 'Hardware Wallets',
        wallets: [
          ledgerWallet({}),
          // Note: trezorWallet was removed from RainbowKit v2
        ],
      },

      // DeFi & Institutional Wallets
      {
        groupName: 'DeFi Wallets',
        wallets: [
          safeWallet({}),
          // Add more DeFi wallets here as needed
        ],
      },
    ], {
      appName: 'SentinelAI 4.0',
      projectId,
    })

    return enhancedConnectors
  }

  private setupSupportedTokens() {
    const tokens: TokenInfo[] = [
      {
        symbol: 'USDM',
        name: 'USDM Token',
        address: '0x...', // Will be set after deployment
        decimals: 18,
        chainId: 1,
        isNative: false,
        logo: '/tokens/usdm.png'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        chainId: 1,
        isNative: true,
        logo: '/tokens/eth.png'
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xA0b86a33E6441E6C8C07C4c4c4e5B0B4B4B4B4B4',
        decimals: 6,
        chainId: 1,
        isNative: false,
        logo: '/tokens/usdc.png'
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        chainId: 1,
        isNative: false,
        logo: '/tokens/usdt.png'
      },
      {
        symbol: 'AAVE',
        name: 'Aave',
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        decimals: 18,
        chainId: 1,
        isNative: false,
        logo: '/tokens/aave.png'
      },
      {
        symbol: 'UNI',
        name: 'Uniswap',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
        chainId: 1,
        isNative: false,
        logo: '/tokens/uni.png'
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 6,
        chainId: 1815,
        isNative: true,
        logo: '/tokens/ada.png'
      },
      // Polygon tokens
      {
        symbol: 'MATIC',
        name: 'Polygon',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        chainId: 137,
        isNative: true,
        logo: '/tokens/matic.png'
      },
      // Arbitrum tokens
      {
        symbol: 'ARB',
        name: 'Arbitrum',
        address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        decimals: 18,
        chainId: 42161,
        isNative: false,
        logo: '/tokens/arb.png'
      },
      // Optimism tokens
      {
        symbol: 'OP',
        name: 'Optimism',
        address: '0x4200000000000000000000000000000000000042',
        decimals: 18,
        chainId: 10,
        isNative: false,
        logo: '/tokens/op.png'
      },
    ]

    tokens.forEach(token => {
      this.supportedTokens.set(`${token.chainId}-${token.symbol}`, token)
    })
  }

  // Get available wallet options for UI display
  getAvailableWallets() {
    return {
      popular: [
        { id: 'metamask', name: 'MetaMask', icon: '/wallets/metamask.png' },
        { id: 'walletconnect', name: 'WalletConnect', icon: '/wallets/walletconnect.png' },
        { id: 'coinbase', name: 'Coinbase Wallet', icon: '/wallets/coinbase.png' },
        { id: 'rainbow', name: 'Rainbow', icon: '/wallets/rainbow.png' },
      ],
      browser: [
        { id: 'brave', name: 'Brave Wallet', icon: '/wallets/brave.png' },
        { id: 'okx', name: 'OKX Wallet', icon: '/wallets/okx.png' },
        { id: 'oneinch', name: '1inch Wallet', icon: '/wallets/1inch.png' },
      ],
      mobile: [
        { id: 'phantom', name: 'Phantom', icon: '/wallets/phantom.png' },
        { id: 'trust', name: 'Trust Wallet', icon: '/wallets/trust.png' },
        { id: 'imtoken', name: 'imToken', icon: '/wallets/imtoken.png' },
      ],
      hardware: [
        { id: 'ledger', name: 'Ledger', icon: '/wallets/ledger.png' },
        { id: 'trezor', name: 'Trezor', icon: '/wallets/trezor.png' },
      ],
      defi: [
        { id: 'safe', name: 'Safe', icon: '/wallets/safe.png' },
      ],
      cardano: [
        { id: 'yoroi', name: 'Yoroi', icon: '/wallets/yoroi.png' },
        { id: 'nami', name: 'Nami', icon: '/wallets/nami.png' },
        { id: 'eternl', name: 'Eternl', icon: '/wallets/eternl.png' },
      ]
    }
  }

  async connectWallet(walletId?: string): Promise<{ address: string; chainId: number; walletType: string }> {
    try {
      console.log(`[Wallet] Initiating wallet connection${walletId ? ` with ${walletId}` : ''}...`)
      
      // In production, this would trigger the actual wallet connection
      // The walletId would be used to connect to a specific wallet
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
      const mockChainId = 1
      const walletType = walletId || 'metamask'
      
      this.currentAccount = mockAddress
      
      this.emit('walletConnected', {
        address: mockAddress,
        chainId: mockChainId,
        walletType
      })
      
      console.log(`[Wallet] Connected to ${mockAddress} via ${walletType} on chain ${mockChainId}`)
      
      return {
        address: mockAddress,
        chainId: mockChainId,
        walletType
      }
      
    } catch (error) {
      console.error('[Wallet] Connection failed:', error)
      throw error
    }
  }

  // Check if a specific wallet is available
  async isWalletAvailable(walletId: string): Promise<boolean> {
    const availability = {
      metamask: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
      phantom: typeof window !== 'undefined' && !!window.solana?.isPhantom,
      brave: typeof window !== 'undefined' && !!window.ethereum?.isBraveWallet,
      okx: typeof window !== 'undefined' && !!window.okexchain,
      trust: typeof window !== 'undefined' && !!window.ethereum?.isTrust,
      coinbase: typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet,
      // Add more wallet detection logic
    }
    
    return availability[walletId as keyof typeof availability] || false
  }

  // Get wallet-specific features
  getWalletFeatures(walletId: string) {
    const features = {
      metamask: ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism'],
      phantom: ['solana', 'ethereum'],
      brave: ['ethereum', 'bsc', 'polygon'],
      okx: ['ethereum', 'bsc', 'polygon', 'arbitrum', 'okex'],
      trust: ['ethereum', 'bsc', 'polygon', 'arbitrum'],
      ledger: ['ethereum', 'bitcoin', 'cardano', 'polkadot'],
      trezor: ['ethereum', 'bitcoin', 'cardano'],
      yoroi: ['cardano'],
      nami: ['cardano'],
    }
    
    return {
      supportedChains: features[walletId as keyof typeof features] || [],
      isHardware: ['ledger', 'trezor'].includes(walletId),
      isMobile: ['phantom', 'trust', 'imtoken'].includes(walletId),
      supportsDApps: !['ledger', 'trezor'].includes(walletId)
    }
  }

  async disconnectWallet(): Promise<void> {
    this.currentAccount = null
    this.emit('walletDisconnected')
    console.log('[Wallet] Wallet disconnected')
  }

  async switchChain(chainId: number): Promise<void> {
    try {
      console.log(`[Wallet] Switching to chain ${chainId}...`)
      
      // In production, would use wagmi's switchNetwork
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.emit('chainSwitched', { chainId })
      console.log(`[Wallet] Switched to chain ${chainId}`)
      
    } catch (error) {
      console.error('[Wallet] Chain switch failed:', error)
      throw error
    }
  }

  async getTokenBalance(tokenSymbol: string, chainId: number): Promise<string> {
    const tokenKey = `${chainId}-${tokenSymbol}`
    const token = this.supportedTokens.get(tokenKey)
    
    if (!token) {
      throw new Error(`Token ${tokenSymbol} not supported on chain ${chainId}`)
    }

    try {
      // In production, would query actual token balance
      const mockBalance = (Math.random() * 10000).toFixed(token.decimals)
      
      console.log(`[Wallet] ${tokenSymbol} balance: ${mockBalance}`)
      return mockBalance
      
    } catch (error) {
      console.error(`[Wallet] Failed to get ${tokenSymbol} balance:`, error)
      throw error
    }
  }

  async approveToken(
    tokenSymbol: string,
    spenderAddress: string,
    amount: string,
    chainId: number
  ): Promise<string> {
    const tokenKey = `${chainId}-${tokenSymbol}`
    const token = this.supportedTokens.get(tokenKey)
    
    if (!token) {
      throw new Error(`Token ${tokenSymbol} not supported on chain ${chainId}`)
    }

    try {
      console.log(`[Wallet] Approving ${amount} ${tokenSymbol} for ${spenderAddress}...`)
      
      // In production, would execute actual approval transaction
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction time
      
      this.emit('tokenApproved', {
        token: tokenSymbol,
        spender: spenderAddress,
        amount,
        txHash: mockTxHash
      })
      
      console.log(`[Wallet] Token approval successful: ${mockTxHash}`)
      return mockTxHash
      
    } catch (error) {
      console.error('[Wallet] Token approval failed:', error)
      throw error
    }
  }

  async executeTransaction(
    to: string,
    data: string,
    value: string = '0',
    chainId: number
  ): Promise<string> {
    try {
      console.log(`[Wallet] Executing transaction on chain ${chainId}...`)
      
      // In production, would execute actual transaction
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
      
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate transaction time
      
      this.emit('transactionExecuted', {
        to,
        value,
        txHash: mockTxHash,
        chainId
      })
      
      console.log(`[Wallet] Transaction successful: ${mockTxHash}`)
      return mockTxHash
      
    } catch (error) {
      console.error('[Wallet] Transaction failed:', error)
      throw error
    }
  }

  async stakeUSDMTokens(amount: string): Promise<string> {
    if (!this.currentAccount) {
      throw new Error('Wallet not connected')
    }

    try {
      console.log(`[Wallet] Staking ${amount} USDM tokens...`)
      
      // First approve the staking contract
      const approvalTx = await this.approveToken('USDM', '0x...', amount, 1) // Staking contract address
      
      // Then execute the staking transaction
      const stakingTx = await this.executeTransaction(
        '0x...', // Staking contract address
        '0x...', // Encoded staking function call
        '0',
        1
      )
      
      this.emit('tokensStaked', {
        amount,
        txHash: stakingTx,
        user: this.currentAccount
      })
      
      return stakingTx
      
    } catch (error) {
      console.error('[Wallet] Staking failed:', error)
      throw error
    }
  }

  async hireAgentWithUSDM(agentId: string, duration: number, hourlyRate: number): Promise<string> {
    if (!this.currentAccount) {
      throw new Error('Wallet not connected')
    }

    const totalCost = (duration * hourlyRate).toString()

    try {
      console.log(`[Wallet] Hiring agent ${agentId} for ${duration} hours at ${hourlyRate} USDM/hour...`)
      
      // Approve USDM spending
      const approvalTx = await this.approveToken('USDM', '0x...', totalCost, 1) // Marketplace contract
      
      // Execute hiring transaction
      const hiringTx = await this.executeTransaction(
        '0x...', // Marketplace contract address
        '0x...', // Encoded hiring function call
        '0',
        1
      )
      
      this.emit('agentHired', {
        agentId,
        duration,
        totalCost,
        txHash: hiringTx,
        hirer: this.currentAccount
      })
      
      return hiringTx
      
    } catch (error) {
      console.error('[Wallet] Agent hiring failed:', error)
      throw error
    }
  }

  async bridgeTokensCrossChain(
    tokenSymbol: string,
    amount: string,
    fromChainId: number,
    toChainId: number,
    recipient?: string
  ): Promise<string> {
    if (!this.currentAccount) {
      throw new Error('Wallet not connected')
    }

    const recipientAddress = recipient || this.currentAccount

    try {
      console.log(`[Wallet] Bridging ${amount} ${tokenSymbol} from chain ${fromChainId} to ${toChainId}...`)
      
      // Approve bridge contract
      const approvalTx = await this.approveToken(tokenSymbol, '0x...', amount, fromChainId) // Bridge contract
      
      // Execute bridge transaction
      const bridgeTx = await this.executeTransaction(
        '0x...', // Bridge contract address
        '0x...', // Encoded bridge function call
        '0',
        fromChainId
      )
      
      this.emit('tokensBridged', {
        token: tokenSymbol,
        amount,
        fromChainId,
        toChainId,
        recipient: recipientAddress,
        txHash: bridgeTx
      })
      
      return bridgeTx
      
    } catch (error) {
      console.error('[Wallet] Cross-chain bridge failed:', error)
      throw error
    }
  }

  getSupportedChains() {
    return this.chains.map((chain) => ({
      id: chain.id,
      name: chain.name,
      nativeCurrency: chain.nativeCurrency,
      blockExplorers: chain.blockExplorers
    }))
  }

  getSupportedTokens(chainId?: number) {
    const tokens = Array.from(this.supportedTokens.values())
    
    if (chainId) {
      return tokens.filter(token => token.chainId === chainId)
    }
    
    return tokens
  }

  getCurrentAccount(): string | null {
    return this.currentAccount
  }

  getWagmiConfig() {
    return this.wagmiConfig
  }

  isConnected(): boolean {
    return !!this.currentAccount
  }
}

interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  chainId: number
  isNative: boolean
  logo: string
}

export const walletIntegration = new WalletIntegration()