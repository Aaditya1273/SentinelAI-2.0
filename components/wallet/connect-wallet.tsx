"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useBalance, useChainId } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield } from "lucide-react"

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConnectButton />

        {isConnected && address && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {address.slice(0, 6)}...{address.slice(-4)}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Chain:</span>
              <Badge variant="outline">{chainId}</Badge>
            </div>

            {balance && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-sm font-medium">
                  {Number.parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Wallet Connected</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
