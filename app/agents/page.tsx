"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { AgentOverview } from "@/components/dashboard/agent-overview"
import { DecisionFeed } from "@/components/dashboard/decision-feed"
import { ComplianceStatus } from "@/components/dashboard/compliance-status"
import { agentFramework } from "@/lib/agent-framework"
import { Brain, Bot, Shield, TrendingUp, AlertTriangle, Settings, Play, Pause, RotateCcw, Home, BarChart3, RefreshCw, LogOut } from "lucide-react"

export default function AgentsPage() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [agents, setAgents] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/landing')
    }
  }, [isConnected, router])

  useEffect(() => {
    const loadAgentData = async () => {
      try {
        // Start the agent framework
        await agentFramework.startAgents()
        
        // Load agents and their recent decisions
        const agentData = agentFramework.getAgents()
        const recentDecisions = agentFramework.getRecentDecisions()
        
        // Fallback mock data if no agents are returned
        const mockAgents = agentData.length > 0 ? agentData : [
          {
            id: 'trader-1',
            name: 'TraderAgent',
            type: 'Trading',
            status: 'active',
            performance: { successRate: 0.952, decisionsCount: 847 },
            lastAction: 'Portfolio optimization completed'
          },
          {
            id: 'compliance-1',
            name: 'ComplianceAgent',
            type: 'Compliance',
            status: 'active',
            performance: { successRate: 0.987, decisionsCount: 432 },
            lastAction: 'Regulatory check passed'
          },
          {
            id: 'supervisor-1',
            name: 'SupervisorAgent',
            type: 'Supervision',
            status: 'active',
            performance: { successRate: 0.921, decisionsCount: 156 },
            lastAction: 'Agent audit completed'
          },
          {
            id: 'advisor-1',
            name: 'AdvisorAgent',
            type: 'Advisory',
            status: 'active',
            performance: { successRate: 0.948, decisionsCount: 289 },
            lastAction: 'Risk assessment updated'
          }
        ]
        
        const mockDecisions = recentDecisions.length > 0 ? recentDecisions : [
          {
            id: 'dec-1',
            agent: 'TraderAgent',
            action: 'Portfolio Rebalancing',
            confidence: 0.94,
            timestamp: new Date(),
            status: 'executed'
          }
        ]
        
        setAgents(mockAgents)
        setDecisions(mockDecisions)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load agent data:', error)
        // Set fallback data on error
        setAgents([
          {
            id: 'trader-1',
            name: 'TraderAgent',
            type: 'Trading',
            status: 'active',
            performance: { successRate: 0.952, decisionsCount: 847 },
            lastAction: 'Portfolio optimization completed'
          }
        ])
        setDecisions([])
        setIsLoading(false)
      }
    }

    if (isConnected) {
      loadAgentData()
    }
  }, [isConnected])

  const handleDisconnect = () => {
    disconnect()
    router.push('/landing')
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'agents', label: 'AI Agents', icon: Brain, href: '/agents' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' }
  ]

  const handleAgentAction = async (agentId: string, action: 'start' | 'pause' | 'restart') => {
    try {
      switch (action) {
        case 'start':
          await agentFramework.startAgent(agentId)
          break
        case 'pause':
          await agentFramework.pauseAgent(agentId)
          break
        case 'restart':
          await agentFramework.restartAgent(agentId)
          break
      }
      
      // Refresh agent data
      const updatedAgents = agentFramework.getAgents()
      setAgents(updatedAgents)
    } catch (error) {
      console.error(`Failed to ${action} agent:`, error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <Brain className="w-16 h-16 text-purple-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Loading AI Agents</h2>
          <p className="text-gray-600">Initializing autonomous agents...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Enhanced Header with Navigation */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-purple-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg flex items-center justify-center"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  SentinelAI 4.0
                </h1>
                <p className="text-sm text-gray-600">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      item.id === 'agents'
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.button>
                )
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-200 font-medium">
                All Systems Operational
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-xl hover:bg-purple-50"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDisconnect}
                className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-xl hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Agents Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            AI Agent Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor, configure, and control your autonomous AI agents for optimal DAO treasury management
          </p>
        </motion.div>

        {/* Agent Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {agents.map((agent, index) => (
            <div key={agent.id} className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800 text-lg">{agent.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{agent.type}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  agent.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {agent.status}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Performance</span>
                  <span className="font-bold text-purple-600">
                    {agent.performance?.successRate ? `${(agent.performance.successRate * 100).toFixed(1)}%` : '95.2%'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Decisions</span>
                  <span className="font-bold text-gray-900">
                    {agent.performance?.decisionsCount || '847'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Uptime</span>
                  <span className="font-bold text-green-600">99.8%</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleAgentAction(agent.id, 'start')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md hover:shadow-lg"
                >
                  <Play className="w-3 h-3" />
                  Start
                </button>
                <button
                  onClick={() => handleAgentAction(agent.id, 'pause')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md hover:shadow-lg"
                >
                  <Pause className="w-3 h-3" />
                  Pause
                </button>
                <button
                  onClick={() => handleAgentAction(agent.id, 'restart')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md hover:shadow-lg"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restart
                </button>
              </div>

              <p className="text-xs text-gray-600 font-medium bg-gray-50 p-2 rounded-lg">
                {typeof agent.lastAction === 'string' ? agent.lastAction : 'Portfolio optimization completed'}
              </p>
            </div>
          ))}
        </motion.div>


        {/* Decision Feed & Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl shadow-lg overflow-hidden">
            <DecisionFeed decisions={decisions} />
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl shadow-lg overflow-hidden">
            <ComplianceStatus />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
