"use client"

import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, ExternalLink, Copy, LogOut } from "lucide-react"
import { useState, useEffect } from "react"

export function WalletDashboard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address && chainId) {
      fetchWalletData()
    }
  }, [address, chainId])

  const fetchWalletData = async () => {
    if (!address) return

    setLoading(true)
    try {
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_transactions",
          address,
          chainId,
        }),
      })

      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error("Failed to fetch wallet data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const getChainName = (id: number) => {
    switch (id) {
      case 1:
        return "Ethereum"
      case 137:
        return "Polygon"
      case 42161:
        return "Arbitrum"
      case 10:
        return "Optimism"
      default:
        return `Chain ${id}`
    }
  }

  if (!isConnected || !address) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Connect your wallet to view dashboard</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </code>
                <Button size="sm" variant="ghost" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => disconnect()}>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Network</p>
              <Badge variant="outline">{getChainName(chainId)}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="font-medium">
                {balance ? `${Number.parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "Loading..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">
                      {tx.from?.toLowerCase() === address.toLowerCase() ? "Sent" : "Received"}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.hash?.slice(0, 10)}...</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No recent transactions found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
