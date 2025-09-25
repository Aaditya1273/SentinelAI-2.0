// RainbowKit Wallet Integration for SentinelAI 4.0
import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { EventEmitter } from 'events'

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
  private wagmiConfig: any
  private chains: any[]
  private connectors: any[]
  private currentAccount: string | null = null
  private supportedTokens: Map<string, TokenInfo> = new Map()

  constructor() {
    super()
    this.initializeWalletIntegration()
  }

  private async initializeWalletIntegration() {
    console.log('[Wallet] Initializing RainbowKit wallet integration...')
    
    // Configure supported chains
    this.setupChains()
    
    // Initialize wallet connectors
    this.setupWalletConnectors()
    
    // Configure supported tokens
    this.setupSupportedTokens()
    
    console.log('[Wallet] RainbowKit integration ready')
  }

  private setupChains() {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [
        mainnet,
        polygon,
        arbitrum,
        optimism,
        base,
        sepolia, // For testing
        cardano as any // Custom Cardano support
      ],
      [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo' }),
        infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID || 'demo' }),
        publicProvider(),
      ]
    )

    this.chains = chains
    
    // Create wagmi config
    this.wagmiConfig = createConfig({
      autoConnect: true,
      connectors: this.connectors,
      publicClient,
      webSocketPublicClient,
    })
  }

  private setupWalletConnectors() {
    const { wallets } = getDefaultWallets({
      appName: 'SentinelAI 4.0',
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
      chains: this.chains,
    })

    // Add custom connectors for specialized wallets
    const customConnectors = connectorsForWallets([
      ...wallets,
      {
        groupName: 'DeFi Wallets',
        wallets: [
          // Add DeFi-specific wallet connectors here
        ],
      },
      {
        groupName: 'Cardano Wallets',
        wallets: [
          // Add Cardano wallet connectors here
        ],
      },
    ])

    this.connectors = customConnectors
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
        symbol: 'AAVE',
        name: 'Aave',
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        decimals: 18,
        chainId: 1,
        isNative: false,
        logo: '/tokens/aave.png'
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 6,
        chainId: 1815,
        isNative: true,
        logo: '/tokens/ada.png'
      }
    ]

    tokens.forEach(token => {
      this.supportedTokens.set(`${token.chainId}-${token.symbol}`, token)
    })
  }

  async connectWallet(): Promise<{ address: string; chainId: number }> {
    try {
      console.log('[Wallet] Initiating wallet connection...')
      
      // In production, this would trigger the actual wallet connection
      // For demo, we'll simulate the connection
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
      const mockChainId = 1
      
      this.currentAccount = mockAddress
      
      this.emit('walletConnected', {
        address: mockAddress,
        chainId: mockChainId
      })
      
      console.log(`[Wallet] Connected to ${mockAddress} on chain ${mockChainId}`)
      
      return {
        address: mockAddress,
        chainId: mockChainId
      }
      
    } catch (error) {
      console.error('[Wallet] Connection failed:', error)
      throw error
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
    return this.chains.map((chain: any) => ({
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
