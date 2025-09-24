"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, TrendingUp, Shield, AlertTriangle, Brain } from "lucide-react"

interface Agent {
  id: string
  name: string
  type: string
  status: string
  performance: {
    successRate: number
    avgResponseTime: number
    decisionsCount: number
  }
}

interface AgentOverviewProps {
  agents: Agent[]
}

export function AgentOverview({ agents }: AgentOverviewProps) {
  const getAgentIcon = (type: string) => {
    switch (type) {
      case "trader":
        return TrendingUp
      case "compliance":
        return Shield
      case "supervisor":
        return AlertTriangle
      case "advisor":
        return Brain
      default:
        return Bot
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success"
      case "learning":
        return "bg-warning"
      case "suspended":
        return "bg-destructive"
      default:
        return "bg-muted-foreground"
    }
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <span>AI Agents</span>
          <Badge variant="secondary" className="ml-auto">
            {agents.filter((a) => a.status === "active").length}/{agents.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent, index) => {
          const Icon = getAgentIcon(agent.type)

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
                    agent.status,
                  )} pulse-glow`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground truncate">{agent.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {agent.type}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Success Rate</span>
                    <span>{(agent.performance.successRate * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={agent.performance.successRate * 100} className="h-1" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>{agent.performance.decisionsCount} decisions</span>
                  <span>{agent.performance.avgResponseTime}ms avg</span>
                </div>
              </div>
            </motion.div>
          )
        })}

        {agents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No agents available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
