"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Activity, Zap, Target, Award } from "lucide-react"

const performanceData = [
  { time: "00:00", efficiency: 95, accuracy: 98, speed: 450 },
  { time: "04:00", efficiency: 97, accuracy: 96, speed: 420 },
  { time: "08:00", efficiency: 94, accuracy: 99, speed: 380 },
  { time: "12:00", efficiency: 98, accuracy: 97, speed: 340 },
  { time: "16:00", efficiency: 96, accuracy: 98, speed: 390 },
  { time: "20:00", efficiency: 99, accuracy: 99, speed: 310 },
]

const metrics = [
  {
    title: "Decision Accuracy",
    value: 98.2,
    change: +2.1,
    icon: Target,
    color: "text-success",
  },
  {
    title: "Response Time",
    value: 387,
    change: -45,
    icon: Zap,
    color: "text-primary",
    unit: "ms",
  },
  {
    title: "System Efficiency",
    value: 96.8,
    change: +1.4,
    icon: Activity,
    color: "text-accent",
  },
  {
    title: "Success Rate",
    value: 94.7,
    change: +0.8,
    icon: Award,
    color: "text-warning",
  },
]

export function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.change > 0
          const TrendIcon = isPositive ? TrendingUp : TrendingDown

          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="chart-container">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                    <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {Math.abs(metric.change)}
                      {metric.unit ? "" : "%"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                      {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
                      {!metric.unit && <span className="text-sm text-muted-foreground">%</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <Progress value={metric.unit ? 100 : metric.value} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Performance Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="time" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--card))",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "rgb(var(--primary))", strokeWidth: 2, r: 4 }}
                  name="Efficiency %"
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="rgb(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "rgb(var(--success))", strokeWidth: 2, r: 4 }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
