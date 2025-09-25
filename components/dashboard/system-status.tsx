"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Clock, Activity, Shield } from "lucide-react"

export function SystemStatus() {
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate system health check
    const checkSystemHealth = () => {
      const health = {
        overall: 98.5,
        components: {
          agentFramework: { status: "operational", uptime: 99.9, responseTime: 245 },
          smartContracts: { status: "deployed", gasOptimization: 95, verifications: 1247 },
          zkProofs: { status: "active", proofsGenerated: 8934, verificationRate: 99.8 },
          crossChain: { status: "operational", bridgesActive: 4, totalVolume: "2.4M" },
          daoIntegration: { status: "connected", daosMonitored: 12, proposalsTracked: 156 },
          monitoring: { status: "active", alertsProcessed: 23, incidentsResolved: 8 },
        },
        performance: {
          decisionsPerHour: 1247,
          averageResponseTime: 0.8,
          successRate: 99.2,
          resourceUtilization: 67,
        },
        security: {
          threatsDetected: 3,
          threatsBlocked: 3,
          vulnerabilities: 0,
          lastAudit: "2024-01-15",
        },
      }

      setSystemHealth(health)
      setLoading(false)
    }

    checkSystemHealth()
    const interval = setInterval(checkSystemHealth, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "active":
      case "deployed":
      case "connected":
        return "text-success"
      case "warning":
        return "text-warning"
      case "error":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "active":
      case "deployed":
      case "connected":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            SentinelAI 4.0 System Health
          </CardTitle>
          <CardDescription>Overall system performance and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Health</span>
              <span className="text-2xl font-bold text-green-400">{systemHealth.overall}%</span>
            </div>
            <Progress value={systemHealth.overall} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Component Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(systemHealth.components).map(([component, data]: [string, any]) => (
          <Card key={component}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="capitalize">{component.replace(/([A-Z])/g, " $1").trim()}</span>
                {getStatusIcon(data.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className={`${getStatusColor(data.status)} border-current`}>
                {data.status}
              </Badge>

              <div className="space-y-1 text-xs text-muted-foreground">
                {data.uptime && (
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>{data.uptime}%</span>
                  </div>
                )}
                {data.responseTime && (
                  <div className="flex justify-between">
                    <span>Response:</span>
                    <span>{data.responseTime}ms</span>
                  </div>
                )}
                {data.gasOptimization && (
                  <div className="flex justify-between">
                    <span>Gas Opt:</span>
                    <span>{data.gasOptimization}%</span>
                  </div>
                )}
                {data.proofsGenerated && (
                  <div className="flex justify-between">
                    <span>Proofs:</span>
                    <span>{data.proofsGenerated.toLocaleString()}</span>
                  </div>
                )}
                {data.bridgesActive && (
                  <div className="flex justify-between">
                    <span>Bridges:</span>
                    <span>{data.bridgesActive} active</span>
                  </div>
                )}
                {data.daosMonitored && (
                  <div className="flex justify-between">
                    <span>DAOs:</span>
                    <span>{data.daosMonitored} monitored</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Decisions/Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {systemHealth.performance.decisionsPerHour.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{systemHealth.performance.averageResponseTime}s</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{systemHealth.performance.successRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{systemHealth.performance.resourceUtilization}%</div>
              <Progress value={systemHealth.performance.resourceUtilization} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{systemHealth.security.threatsDetected}</div>
              <div className="text-sm text-muted-foreground">Threats Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{systemHealth.security.threatsBlocked}</div>
              <div className="text-sm text-muted-foreground">Threats Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{systemHealth.security.vulnerabilities}</div>
              <div className="text-sm text-muted-foreground">Vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">Last Audit</div>
              <div className="text-sm text-muted-foreground">{systemHealth.security.lastAudit}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
