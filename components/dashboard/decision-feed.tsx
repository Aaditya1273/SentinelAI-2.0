"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bot, Clock, CheckCircle, TrendingUp, Shield, Brain, AlertTriangle, Activity, Zap, Target, DollarSign, ArrowUp, ArrowDown, Sparkles } from "lucide-react"
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
  type?: string
}

interface DecisionFeedProps {
  decisions: Decision[]
}

export function DecisionFeed({ decisions }: DecisionFeedProps) {
  const getAgentConfig = (agentId: string | undefined, type?: string) => {
    if (!agentId && !type) return { icon: Bot, color: "purple", name: "AI Agent" }
    
    const id = (agentId || type || "").toLowerCase()
    
    if (id.includes("trader") || id.includes("rebalance")) {
      return { icon: TrendingUp, color: "emerald", name: "Trader Agent" }
    }
    if (id.includes("compliance") || id.includes("regulatory")) {
      return { icon: Shield, color: "blue", name: "Compliance Agent" }
    }
    if (id.includes("risk") || id.includes("supervisor")) {
      return { icon: AlertTriangle, color: "orange", name: "Risk Monitor" }
    }
    if (id.includes("advisor") || id.includes("yield")) {
      return { icon: Brain, color: "violet", name: "Strategy Advisor" }
    }
    
    return { icon: Bot, color: "purple", name: "AI Agent" }
  }

  const getConfidenceConfig = (confidence: number) => {
    if (confidence >= 0.9) return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "High" }
    if (confidence >= 0.7) return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Medium" }
    return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Low" }
  }

  const getImpactIcon = (change: number) => {
    if (change > 0) return ArrowUp
    if (change < 0) return ArrowDown
    return DollarSign
  }

  const getImpactColor = (change: number) => {
    if (change > 0) return "text-emerald-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Activity className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Live Decision Feed</h3>
              <p className="text-purple-100 text-sm">Real-time AI agent decisions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Decision List */}
      <div className="p-6">
        <div className="h-[450px] overflow-y-auto space-y-4 pr-2">
          <AnimatePresence>
            {decisions.map((decision, index) => {
              const agentConfig = getAgentConfig(decision.agentId, decision.type)
              const confidenceConfig = getConfidenceConfig(decision.confidence || 0.8)
              const Icon = agentConfig.icon
              const ImpactIcon = getImpactIcon(decision.impact?.treasuryChange || 15000)

              return (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Colored left border */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${agentConfig.color}-400 to-${agentConfig.color}-600`}></div>
                  
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br from-${agentConfig.color}-100 to-${agentConfig.color}-50 border border-${agentConfig.color}-200 rounded-xl flex items-center justify-center flex-shrink-0`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className={`w-6 h-6 text-${agentConfig.color}-600`} />
                        </motion.div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`bg-${agentConfig.color}-100 text-${agentConfig.color}-800 px-3 py-1 rounded-full text-sm font-semibold`}>
                              {agentConfig.name}
                            </span>
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(decision.timestamp, { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Badge */}
                      <div className={`${confidenceConfig.bg} ${confidenceConfig.border} border px-3 py-2 rounded-lg`}>
                        <div className="flex items-center space-x-2">
                          <Target className={`w-4 h-4 ${confidenceConfig.color}`} />
                          <div className="text-right">
                            <div className={`text-sm font-bold ${confidenceConfig.color}`}>
                              {((decision.confidence || 0.8) * 100).toFixed(0)}%
                            </div>
                            <div className={`text-xs ${confidenceConfig.color} opacity-75`}>
                              {confidenceConfig.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decision Content */}
                    <div className="mb-4">
                      <p className="text-gray-900 font-semibold mb-2 leading-relaxed">
                        {decision.action}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {decision.rationale || "AI-driven decision based on comprehensive market analysis and risk assessment"}
                      </p>
                    </div>

                    {/* Impact Metrics */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 ${getImpactColor(decision.impact?.treasuryChange || 15000) === 'text-emerald-600' ? 'bg-emerald-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                            <ImpactIcon className={`w-4 h-4 ${getImpactColor(decision.impact?.treasuryChange || 15000)}`} />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Treasury Impact</div>
                            <div className={`text-sm font-bold ${getImpactColor(decision.impact?.treasuryChange || 15000)}`}>
                              {(decision.impact?.treasuryChange || 15000) > 0 ? "+" : ""}$
                              {((decision.impact?.treasuryChange || 15000) / 1000).toFixed(1)}k
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Risk Score</div>
                            <div className={`text-sm font-bold ${getImpactColor(-(decision.impact?.riskScore || 0.02))}`}>
                              {(decision.impact?.riskScore || 0.02) > 0 ? "+" : ""}
                              {((decision.impact?.riskScore || 0.02) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <motion.div 
                        className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-emerald-700 font-semibold">ZK Verified</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Empty State */}
          {decisions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Bot className="w-10 h-10 text-purple-400" />
              </motion.div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Waiting for AI Decisions</h4>
              <p className="text-gray-500 max-w-sm mx-auto">
                Your AI agents are analyzing market conditions. New decisions will appear here in real-time.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>View Decision Analytics</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
