"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Play, Square, BarChart3, Clock, Target } from "lucide-react"
import { CrisisSimulator, type CrisisScenario } from "@/lib/simulation/crisis-simulator"

export function CrisisDashboard() {
  const [simulator] = useState(() => new CrisisSimulator())
  const [scenarios, setScenarios] = useState<CrisisScenario[]>([])
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)
  const [simulationStatus, setSimulationStatus] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    setScenarios(simulator.getAllScenarios())
  }, [simulator])

  useEffect(() => {
    if (activeSimulation) {
      const interval = setInterval(() => {
        const status = simulator.getSimulationStatus(activeSimulation)
        setSimulationStatus(status)
      }, 1000)

      simulator.subscribeToSimulation(activeSimulation, (event: any) => {
        setEvents((prev) => [event, ...prev].slice(0, 10))
      })

      return () => clearInterval(interval)
    }
  }, [activeSimulation, simulator])

  const startSimulation = async (scenarioId: string) => {
    try {
      const simId = await simulator.startScenario(scenarioId)
      setActiveSimulation(simId)
      setEvents([])
    } catch (error) {
      console.error("[v0] Failed to start simulation:", error)
    }
  }

  const stopSimulation = async () => {
    if (activeSimulation) {
      await simulator.stopSimulation(activeSimulation)
      setActiveSimulation(null)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-warning"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "market_crash":
        return "📉"
      case "hack_attempt":
        return "🔓"
      case "governance_attack":
        return "⚖️"
      case "liquidity_crisis":
        return "💧"
      case "regulatory_change":
        return "📋"
      default:
        return "⚠️"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Crisis Simulation Center</h2>
          <p className="text-muted-foreground">Test SentinelAI's response to various crisis scenarios</p>
        </div>
        {activeSimulation && (
          <Button onClick={stopSimulation} variant="destructive" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Stop Simulation
          </Button>
        )}
      </div>

      {/* Active Simulation Status */}
      {activeSimulation && simulationStatus && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Active Simulation: {simulationStatus.scenario.name}
            </CardTitle>
            <CardDescription>{simulationStatus.scenario.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <Progress
                  value={
                    ((Date.now() - simulationStatus.startTime) / (simulationStatus.scenario.duration * 60 * 1000)) * 100
                  }
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Events Triggered
                </div>
                <div className="text-2xl font-bold text-foreground">{simulationStatus.events?.length || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  Status
                </div>
                <Badge variant={simulationStatus.status === "running" ? "default" : "secondary"}>
                  {simulationStatus.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Live simulation events and triggers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground capitalize">{event.type.replace("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge variant="outline">Impact: {Object.keys(event.impact).length} metrics</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scenario.name}</CardTitle>
                <Badge className={getSeverityColor(scenario.severity)}>{scenario.severity}</Badge>
              </div>
              <CardDescription className="text-sm">{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Duration</div>
                <div className="text-sm text-foreground">
                  {Math.floor(scenario.duration / 60)} hours {scenario.duration % 60} minutes
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Triggers</div>
                <div className="flex flex-wrap gap-1">
                  {scenario.triggers.map((trigger, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {trigger.type.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Success Metrics</div>
                <div className="text-xs text-muted-foreground">{scenario.successMetrics.length} metrics tracked</div>
              </div>

              <Button
                onClick={() => startSimulation(scenario.id)}
                disabled={!!activeSimulation}
                className="w-full flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Simulation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
