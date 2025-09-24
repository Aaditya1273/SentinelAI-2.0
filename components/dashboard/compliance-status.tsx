"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Clock, Shield } from "lucide-react"

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 animate-pulse" />
            Compliance Status
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
      case "compliant":
      case "passed":
        return "text-green-500"
      case "review_needed":
      case "warning":
        return "text-yellow-500"
      case "non_compliant":
      case "failed":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "review_needed":
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "non_compliant":
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Compliance Status
        </CardTitle>
        <CardDescription>Regulatory compliance monitoring and reporting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Compliance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Compliance</span>
            <span className="text-2xl font-bold text-green-400">{complianceData.overall}%</span>
          </div>
          <Progress value={complianceData.overall} className="h-2" />
        </div>

        {/* Compliance Frameworks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Regulatory Frameworks</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(complianceData.frameworks).map(([framework, data]: [string, any]) => (
              <div key={framework} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium uppercase">{framework}</span>
                  {getStatusIcon(data.status)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Score: {data.score}% • {new Date(data.lastCheck).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Compliance Checks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Checks</h4>
          <div className="space-y-2">
            {complianceData.recentChecks.slice(0, 4).map((check: any) => (
              <div key={check.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <span className="text-sm">{check.type}</span>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(check.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        {complianceData.alerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Active Alerts</h4>
            <div className="space-y-2">
              {complianceData.alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.message}</div>
                    <div className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</div>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
