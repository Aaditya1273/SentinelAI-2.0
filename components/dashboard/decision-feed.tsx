"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Clock, CheckCircle, TrendingUp, Shield, Brain, AlertTriangle, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Decision {
  id: string
  agentId: string
  timestamp: Date
  action: string
  rationale: string
  confidence: number
  impact: {
    treasuryChange: number
    riskScore: number
    complianceScore: number
  }
}

interface DecisionFeedProps {
  decisions: Decision[]
}

export function DecisionFeed({ decisions }: DecisionFeedProps) {
  const getAgentIcon = (agentId: string) => {
    if (agentId.includes("trader")) return TrendingUp
    if (agentId.includes("compliance")) return Shield
    if (agentId.includes("supervisor")) return AlertTriangle
    if (agentId.includes("advisor")) return Brain
    return Bot
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-success"
    if (confidence >= 0.7) return "text-warning"
    return "text-destructive"
  }

  const getImpactColor = (change: number) => {
    if (change > 0) return "text-success"
    if (change < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Decision Feed</span>
          </div>
          <Badge variant="secondary">{decisions.length} recent</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {decisions.map((decision, index) => {
              const Icon = getAgentIcon(decision.agentId)

              return (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {decision.agentId.replace("_", " ")}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(decision.timestamp, { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                          {(decision.confidence * 100).toFixed(0)}%
                        </div>
                      </div>

                      <p className="text-sm text-foreground font-medium mb-2 line-clamp-2">{decision.action}</p>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{decision.rationale}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Treasury:</span>
                            <span className={getImpactColor(decision.impact.treasuryChange)}>
                              {decision.impact.treasuryChange > 0 ? "+" : ""}$
                              {(decision.impact.treasuryChange / 1000).toFixed(1)}k
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Risk:</span>
                            <span className={getImpactColor(-decision.impact.riskScore)}>
                              {decision.impact.riskScore > 0 ? "+" : ""}
                              {(decision.impact.riskScore * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-xs text-success">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {decisions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent decisions</p>
                <p className="text-sm">AI agents will appear here when they make decisions</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full bg-transparent">
            View All Decisions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
