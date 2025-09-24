import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, address, chainId, signature } = body

    switch (action) {
      case "verify_signature":
        const isValid = await verifyWalletSignature(address, signature, body.message)
        return NextResponse.json({ valid: isValid })

      case "get_balance":
        const balance = await getWalletBalance(address, chainId)
        return NextResponse.json({ balance })

      case "get_transactions":
        const transactions = await getWalletTransactions(address, chainId)
        return NextResponse.json({ transactions })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[Wallet API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function verifyWalletSignature(address: string, signature: string, message: string): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch {
    return false
  }
}

async function getWalletBalance(address: string, chainId: number) {
  try {
    const provider = getProviderForChain(chainId)
    const balance = await provider.getBalance(address)
    return {
      raw: balance.toString(),
      formatted: ethers.formatEther(balance),
      symbol: getChainSymbol(chainId),
    }
  } catch (error) {
    console.error("[Wallet] Failed to get balance:", error)
    return null
  }
}

async function getWalletTransactions(address: string, chainId: number) {
  try {
    // In production, use proper blockchain explorers or indexing services
    // This is a simplified example
    const provider = getProviderForChain(chainId)
    const currentBlock = await provider.getBlockNumber()

    // Get recent transactions (simplified)
    const transactions = []
    for (let i = 0; i < 5; i++) {
      const block = await provider.getBlock(currentBlock - i, true)
      if (block?.transactions) {
        const userTxs = block.transactions.filter(
          (tx: any) =>
            tx.from?.toLowerCase() === address.toLowerCase() || tx.to?.toLowerCase() === address.toLowerCase(),
        )
        transactions.push(...userTxs.slice(0, 10))
      }
    }

    return transactions.slice(0, 20) // Return last 20 transactions
  } catch (error) {
    console.error("[Wallet] Failed to get transactions:", error)
    return []
  }
}

function getProviderForChain(chainId: number): ethers.Provider {
  switch (chainId) {
    case 1: // Ethereum
      return new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
      )
    case 137: // Polygon
      return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com")
    case 42161: // Arbitrum
      return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc")
    case 10: // Optimism
      return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || "https://mainnet.optimism.io")
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`)
  }
}

function getChainSymbol(chainId: number): string {
  switch (chainId) {
    case 1:
      return "ETH"
    case 137:
      return "MATIC"
    case 42161:
      return "ETH"
    case 10:
      return "ETH"
    default:
      return "ETH"
  }
}
