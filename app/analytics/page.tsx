"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TreasuryMetrics } from "@/components/dashboard/treasury-metrics"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { RiskMonitor } from "@/components/dashboard/risk-monitor"
import { agentFramework } from "@/lib/agent-framework"
import { daoIntegration } from "@/lib/dao-integration"
import { BarChart3, TrendingUp, PieChart, Activity, Target, Zap } from "lucide-react"

export default function AnalyticsPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/landing')
    }
  }, [isConnected, router])

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Load advanced analytics data
        const [performance, risk, treasury] = await Promise.all([
          agentFramework.getPerformanceAnalytics(),
          agentFramework.getRiskAnalytics(),
          daoIntegration.getTreasuryAnalytics()
        ])

        setAnalyticsData({
          performance,
          risk,
          treasury,
          portfolioReturn: 24.7,
          riskScore: 6.2,
          efficiency: 94.3,
          sharpeRatio: 1.85,
          maxDrawdown: 8.3,
          volatility: 12.4
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load analytics:', error)
        setIsLoading(false)
      }
    }

    if (isConnected) {
      loadAnalytics()
    }
  }, [isConnected])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <BarChart3 className="w-16 h-16 text-purple-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Loading Advanced Analytics</h2>
          <p className="text-gray-600">Analyzing performance metrics...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Analytics Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deep insights into your DAO's performance, risk metrics, and AI optimization strategies
          </p>
        </motion.div>

        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">Portfolio Return</h3>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">+{analyticsData.portfolioReturn}%</div>
            <p className="text-sm text-green-700 mt-2">30-day performance</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-800">Risk Score</h3>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{analyticsData.riskScore}/10</div>
            <p className="text-sm text-orange-700 mt-2">Moderate risk level</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-800">AI Efficiency</h3>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{analyticsData.efficiency}%</div>
            <p className="text-sm text-purple-700 mt-2">Optimization rate</p>
          </div>
        </motion.div>

        {/* Advanced Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sharpe Ratio</span>
                <span className="font-semibold text-green-600">{analyticsData.sharpeRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Drawdown</span>
                <span className="font-semibold text-red-600">{analyticsData.maxDrawdown}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volatility</span>
                <span className="font-semibold text-orange-600">{analyticsData.volatility}%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <PerformanceMetrics />
          </div>
        </motion.div>

        {/* Treasury & Risk Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TreasuryMetrics />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RiskMonitor />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
