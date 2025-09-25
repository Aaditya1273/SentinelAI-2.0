"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertTriangle, Clock, Shield, Eye, FileCheck, Users, Globe, Zap, TrendingUp, Activity, AlertCircle } from "lucide-react"

export function ComplianceStatus() {
  const [complianceData, setComplianceData] = useState<any>(null)

  useEffect(() => {
    // Simulate compliance data loading
    const loadComplianceData = () => {
      setComplianceData({
        overall: 94.5,
        frameworks: {
          mica: { score: 96, status: "compliant", lastCheck: "2024-01-15" },
          sec: { score: 92, status: "compliant", lastCheck: "2024-01-14" },
          gdpr: { score: 98, status: "compliant", lastCheck: "2024-01-16" },
          aml: { score: 91, status: "review_needed", lastCheck: "2024-01-13" },
        },
        recentChecks: [
          { id: 1, type: "Transaction Monitoring", status: "passed", timestamp: "2024-01-16T10:30:00Z" },
          { id: 2, type: "KYC Verification", status: "passed", timestamp: "2024-01-16T09:15:00Z" },
          { id: 3, type: "Risk Assessment", status: "warning", timestamp: "2024-01-16T08:45:00Z" },
          { id: 4, type: "Regulatory Filing", status: "passed", timestamp: "2024-01-15T16:20:00Z" },
        ],
        alerts: [
          { id: 1, severity: "medium", message: "AML compliance review required", timestamp: "2024-01-16T11:00:00Z" },
        ],
      })
    }

    loadComplianceData()
    const interval = setInterval(loadComplianceData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (!complianceData) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Loading Compliance Status</h3>
              <p className="text-purple-100 text-sm">Fetching regulatory data...</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i} 
              className="h-16 bg-gray-200 animate-pulse rounded-xl"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }

  const getFrameworkConfig = (framework: string) => {
    const configs = {
      mica: { name: "MiCA", icon: Globe, color: "blue", description: "EU Markets in Crypto-Assets" },
      sec: { name: "SEC", icon: FileCheck, color: "emerald", description: "US Securities & Exchange" },
      gdpr: { name: "GDPR", icon: Users, color: "violet", description: "EU Data Protection" },
      aml: { name: "AML", icon: Eye, color: "orange", description: "Anti-Money Laundering" }
    }
    return configs[framework as keyof typeof configs] || { name: framework.toUpperCase(), icon: Shield, color: "gray", description: "Regulatory Framework" }
  }

  const getStatusConfig = (status: string, score?: number) => {
    switch (status) {
      case "compliant":
      case "passed":
        return { 
          color: "emerald", 
          icon: CheckCircle, 
          label: "Compliant",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700"
        }
      case "review_needed":
      case "warning":
        return { 
          color: "amber", 
          icon: AlertTriangle, 
          label: "Review Needed",
          bg: "bg-amber-50",
          border: "border-amber-200", 
          text: "text-amber-700"
        }
      case "non_compliant":
      case "failed":
        return { 
          color: "red", 
          icon: AlertCircle, 
          label: "Non-Compliant",
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700"
        }
      default:
        return { 
          color: "gray", 
          icon: Clock, 
          label: "Pending",
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700"
        }
    }
  }

  const getOverallStatusColor = (score: number) => {
    if (score >= 95) return "emerald"
    if (score >= 85) return "blue"
    if (score >= 70) return "amber"
    return "red"
  }

  const overallColor = getOverallStatusColor(complianceData.overall)

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
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Compliance Status</h3>
              <p className="text-purple-100 text-sm">Regulatory compliance monitoring and reporting</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Compliance Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 font-medium mb-2">Overall Compliance</div>
            <motion.div 
              className={`text-6xl font-bold text-${overallColor}-600 mb-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {complianceData.overall}%
            </motion.div>
            <div className={`inline-flex items-center space-x-2 bg-${overallColor}-100 text-${overallColor}-800 px-4 py-2 rounded-full text-sm font-semibold`}>
              <CheckCircle className="w-4 h-4" />
              <span>Excellent Compliance</span>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={339.292}
                strokeDashoffset={339.292 - (339.292 * complianceData.overall) / 100}
                className={`text-${overallColor}-500`}
                initial={{ strokeDashoffset: 339.292 }}
                animate={{ strokeDashoffset: 339.292 - (339.292 * complianceData.overall) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className={`w-8 h-8 text-${overallColor}-600`} />
            </div>
          </div>
        </motion.div>

        {/* Regulatory Frameworks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Regulatory Frameworks</h4>
            <div className="text-sm text-gray-500">{Object.keys(complianceData.frameworks).length} frameworks</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(complianceData.frameworks).map(([framework, data]: [string, any], index) => {
              const frameworkConfig = getFrameworkConfig(framework)
              const statusConfig = getStatusConfig(data.status)
              const Icon = frameworkConfig.icon
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={framework}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${frameworkConfig.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${frameworkConfig.color}-600`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{frameworkConfig.name}</div>
                        <div className="text-sm text-gray-500">{frameworkConfig.description}</div>
                      </div>
                    </div>
                    
                    <div className={`${statusConfig.bg} ${statusConfig.border} border px-3 py-1 rounded-lg flex items-center space-x-2`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                      <span className={`text-xs font-semibold ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance Score</span>
                      <span className={`text-lg font-bold text-${frameworkConfig.color}-600`}>{data.score}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`bg-${frameworkConfig.color}-500 h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${data.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last Check: {new Date(data.lastCheck).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent Compliance Checks */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Recent Checks</h4>
          <div className="space-y-3">
            <AnimatePresence>
              {complianceData.recentChecks.slice(0, 4).map((check: any, index: number) => {
                const statusConfig = getStatusConfig(check.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${statusConfig.bg} p-2 rounded-lg`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{check.type}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(check.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${statusConfig.bg} ${statusConfig.border} border px-3 py-1 rounded-full`}>
                      <span className={`text-xs font-semibold ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Alerts */}
        {complianceData.alerts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Active Alerts</h4>
            <div className="space-y-3">
              {complianceData.alerts.map((alert: any, index: number) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-amber-900 mb-1">{alert.message}</div>
                    <div className="text-sm text-amber-700">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {alert.severity.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Generate Compliance Report</span>
        </motion.button>
      </div>
    </div>
  )
}
