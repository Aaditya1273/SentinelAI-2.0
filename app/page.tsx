"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AgentOverview } from "@/components/dashboard/agent-overview"
import { TreasuryMetrics } from "@/components/dashboard/treasury-metrics"
import { DecisionFeed } from "@/components/dashboard/decision-feed"
import { RiskMonitor } from "@/components/dashboard/risk-monitor"
import { ComplianceStatus } from "@/components/dashboard/compliance-status"
import { CrisisSimulation } from "@/components/dashboard/crisis-simulation"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { agentFramework } from "@/lib/agent-framework"
import { daoIntegration } from "@/lib/dao-integration"
import { MainNav } from "@/components/navigation/main-nav"

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any[]>([])
  const [treasuries, setTreasuries] = useState<any[]>([])
  const [systemHealth, setSystemHealth] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize the system
    const initializeSystem = async () => {
      try {
        // Start agent framework
        await agentFramework.startAgents()

        // Load initial data
        setAgents(agentFramework.getAgents())
        setDecisions(agentFramework.getRecentDecisions())
        setTreasuries(daoIntegration.getTreasuries())
        setSystemHealth({
          uptime: 0.999,
          responseTime: 450,
          agentsActive: 4,
          totalDecisions: 127,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize system:", error)
        setIsLoading(false)
      }
    }

    initializeSystem()

    // Set up real-time updates
    const updateInterval = setInterval(() => {
      setAgents(agentFramework.getAgents())
      setDecisions(agentFramework.getRecentDecisions())
    }, 5000)

    // Listen for agent events
    const handleNewDecision = (decision: any) => {
      setDecisions((prev) => [decision, ...prev.slice(0, 9)])
    }

    agentFramework.on("newDecision", handleNewDecision)

    return () => {
      clearInterval(updateInterval)
      agentFramework.off("newDecision", handleNewDecision)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Initializing SentinelAI 4.0</h2>
          <p className="text-muted-foreground">Starting multi-agent system...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <MainNav />
        </div>
      </header>

      <DashboardHeader systemHealth={systemHealth} />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Top Row - Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <TreasuryMetrics treasuries={treasuries} />
          </div>
          <div>
            <AgentOverview agents={agents} />
          </div>
        </motion.div>

        {/* Middle Row - Real-time Monitoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <DecisionFeed decisions={decisions} />
          <RiskMonitor />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PerformanceMetrics />
        </motion.div>

        {/* Bottom Row - Compliance & Crisis Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <ComplianceStatus />
          <CrisisSimulation />
        </motion.div>
      </main>
    </div>
  )
}
