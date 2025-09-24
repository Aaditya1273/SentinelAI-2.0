"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RiskMonitor() {
  const [riskData, setRiskData] = useState<any[]>([])
  const [currentRisk, setCurrentRisk] = useState(0.28)
  const [volatility, setVolatility] = useState(0.15)
  const [predictions, setPredictions] = useState<any[]>([])

  useEffect(() => {
    // Generate mock risk data
    const generateRiskData = () => {
      const data = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        risk: 0.2 + Math.sin(i * 0.3) * 0.1 + Math.random() * 0.05,
        volatility: 0.1 + Math.sin(i * 0.2) * 0.05 + Math.random() * 0.03,
        liquidity: 0.8 + Math.sin(i * 0.4) * 0.1 + Math.random() * 0.05,
      }))
      setRiskData(data)
    }

    // Generate mock predictions
    const generatePredictions = () => {
      const predictionTypes = [
        { type: "Flash Crash", probability: 0.15, severity: "Medium", timeframe: "24h" },
        { type: "Liquidity Crisis", probability: 0.08, severity: "Low", timeframe: "48h" },
        { type: "Market Correction", probability: 0.25, severity: "High", timeframe: "72h" },
      ]
      setPredictions(predictionTypes)
    }

    generateRiskData()
    generatePredictions()

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setCurrentRisk(0.2 + Math.random() * 0.2)
      setVolatility(0.1 + Math.random() * 0.1)
      generateRiskData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getRiskLevel = (risk: number) => {
    if (risk < 0.2) return { level: "Low", color: "text-success", bg: "bg-success/10" }
    if (risk < 0.4) return { level: "Medium", color: "text-warning", bg: "bg-warning/10" }
    return { level: "High", color: "text-destructive", bg: "bg-destructive/10" }
  }

  const riskLevel = getRiskLevel(currentRisk)

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span>Risk Monitor</span>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Real-time</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Risk Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg ${riskLevel.bg} border border-border/50`}
          >
            <div className="text-center">
              <div className={`text-2xl font-bold ${riskLevel.color}`}>{(currentRisk * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Overall Risk</div>
              <Badge variant="secondary" className={`mt-2 ${riskLevel.color}`}>
                {riskLevel.level}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{(volatility * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Volatility</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-warning mr-1" />
                <span className="text-xs text-warning">+2.3%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0.85</div>
              <div className="text-sm text-muted-foreground">Liquidity Score</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingDown className="w-4 h-4 text-success mr-1" />
                <span className="text-xs text-success">Stable</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Risk Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">24-Hour Risk Trend</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis
                dataKey="hour"
                stroke="rgb(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}h`}
              />
              <YAxis
                stroke="rgb(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--card))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: "8px",
                  color: "rgb(var(--foreground))",
                }}
                formatter={(value: any, name: any) => [
                  `${(value * 100).toFixed(1)}%`,
                  name === "risk" ? "Risk Score" : name === "volatility" ? "Volatility" : "Liquidity",
                ]}
              />
              <Line type="monotone" dataKey="risk" stroke="rgb(var(--destructive))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="volatility" stroke="rgb(var(--warning))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="liquidity" stroke="rgb(var(--success))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Predictions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">AI Risk Predictions</h4>
          </div>
          <div className="space-y-3">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full pulse-glow" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{prediction.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {prediction.timeframe} • {prediction.severity} severity
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-warning">{(prediction.probability * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">probability</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
