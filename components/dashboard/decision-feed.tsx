"use client"

import { motion } from "framer-motion"
import { Bot, Clock, CheckCircle, TrendingUp, Shield, Brain, AlertTriangle, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Decision {
  id: string
  agentId?: string
  agent?: string
  timestamp: Date
  action: string
  rationale?: string
  confidence?: number
  impact?: {
    treasuryChange: number
    riskScore: number
    complianceScore: number
  }
}

interface DecisionFeedProps {
  decisions: Decision[]
}

export function DecisionFeed({ decisions }: DecisionFeedProps) {
  const getAgentIcon = (agentId: string | undefined) => {
    if (!agentId) return Bot
    const id = agentId.toLowerCase()
    if (id.includes("trader")) return TrendingUp
    if (id.includes("compliance")) return Shield
    if (id.includes("supervisor")) return AlertTriangle
    if (id.includes("advisor")) return Brain
    return Bot
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-orange-600"
    return "text-red-600"
  }

  const getImpactColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-purple-800">Decision Feed</h3>
        </div>
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {decisions.length} recent
        </div>
      </div>
      
      <div className="h-[500px] overflow-y-auto pr-4">
        <div className="space-y-4">
          {decisions.map((decision, index) => {
            const Icon = getAgentIcon(decision.agentId)

            return (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors border border-purple-200 shadow-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 border border-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {decision.agentId?.replace("_", " ") || decision.agent || "AI Agent"}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(decision.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${getConfidenceColor(decision.confidence || 0.8)}`}>
                        {((decision.confidence || 0.8) * 100).toFixed(0)}%
                      </div>
                    </div>

                    <p className="text-sm text-gray-900 font-medium mb-2">{decision.action}</p>

                    <p className="text-xs text-gray-600 mb-3">{decision.rationale || "AI-driven decision based on market analysis"}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-600">Treasury:</span>
                          <span className={`font-medium ${getImpactColor(decision.impact?.treasuryChange || 15000)}`}>
                            {(decision.impact?.treasuryChange || 15000) > 0 ? "+" : ""}$
                            {((decision.impact?.treasuryChange || 15000) / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-600">Risk:</span>
                          <span className={`font-medium ${getImpactColor(-(decision.impact?.riskScore || 0.02))}`}>
                            {(decision.impact?.riskScore || 0.02) > 0 ? "+" : ""}
                            {((decision.impact?.riskScore || 0.02) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {decisions.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No recent decisions</p>
              <p className="text-sm">AI agents will appear here when they make decisions</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-200">
        <button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4 py-2 rounded-xl font-medium transition-all">
          View All Decisions
        </button>
      </div>
    </div>
  )
}
