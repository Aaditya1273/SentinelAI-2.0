"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Shield } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface Treasury {
  id: string
  name: string
  totalValue: number
  assets: Array<{
    symbol: string
    amount: number
    value: number
    chain: string
  }>
  riskProfile: {
    volatilityTolerance: number
    maxDrawdown: number
    diversificationTarget: number
  }
}

interface TreasuryMetricsProps {
  treasuries: Treasury[]
}

export function TreasuryMetrics({ treasuries }: TreasuryMetricsProps) {
  // PRODUCTION: Real treasury data from blockchain
  const [realData, setRealData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const { productionDataService } = await import('@/lib/production-data-service')
        const treasuryData = await productionDataService.getRealTreasuryData()
        const marketData = await productionDataService.getRealMarketData()
        
        setRealData({
          treasury: treasuryData,
          market: marketData
        })
      } catch (error) {
        console.error('Failed to load real data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadRealData()
    
    // Update every 30 seconds
    const interval = setInterval(loadRealData, 30000)
    return () => clearInterval(interval)
  }, [])

  const performanceData = realData?.treasury?.performance || []

  const totalValue = treasuries.reduce((sum, treasury) => sum + treasury.totalValue, 0)
  const totalAssets = treasuries.reduce((sum, treasury) => sum + treasury.assets.length, 0)

  // Calculate portfolio distribution
  const allAssets = treasuries.flatMap((t) => t.assets)
  const assetDistribution = allAssets.reduce(
    (acc, asset) => {
      acc[asset.symbol] = (acc[asset.symbol] || 0) + asset.value
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(assetDistribution).map(([symbol, value]) => ({
    name: symbol,
    value,
    percentage: ((value / totalValue) * 100).toFixed(1),
  }))

  const COLORS = [
    "rgb(var(--chart-1))",
    "rgb(var(--chart-2))",
    "rgb(var(--chart-3))",
    "rgb(var(--chart-4))",
    "rgb(var(--chart-5))",
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">${(totalValue / 1000000).toFixed(2)}M</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm text-success">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">24h Yield</p>
                  <p className="text-2xl font-bold text-foreground">6.2%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm text-success">+0.8%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-bold text-foreground">0.28</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm text-success">-0.05</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assets</p>
                  <p className="text-2xl font-bold text-foreground">{totalAssets}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {treasuries.length} DAOs
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Treasury Performance</span>
                <Badge variant="secondary">30 days</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="day" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="rgb(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(var(--card))",
                      border: "1px solid rgb(var(--border))",
                      borderRadius: "8px",
                      color: "rgb(var(--foreground))",
                    }}
                    formatter={(value: any) => [`$${(value / 1000000).toFixed(2)}M`, "Value"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Asset Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--card))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "8px",
                        color: "rgb(var(--foreground))",
                      }}
                      formatter={(value: any, name: any, props: any) => [
                        `$${(value / 1000000).toFixed(2)}M (${props.payload.percentage}%)`,
                        name,
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((asset, index) => (
                  <div key={asset.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-muted-foreground">{asset.name}</span>
                    <span className="text-sm font-medium ml-auto">{asset.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
