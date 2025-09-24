"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Settings, Activity, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  systemHealth: {
    uptime?: number
    responseTime?: number
    agentsActive?: number
    totalDecisions?: number
  }
}

export function DashboardHeader({ systemHealth }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-primary">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SentinelAI 4.0</h1>
              <p className="text-sm text-muted-foreground">Multi-Agent DAO Treasury Guardian</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 max-w-md mx-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents, decisions, or DAOs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-primary"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                ⌘K
              </kbd>
            </div>
          </motion.div>

          {/* System Status and Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {/* System Health Indicators */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full status-active" />
                <span className="text-sm text-muted-foreground">
                  {((systemHealth.uptime || 0.999) * 100).toFixed(1)}% uptime
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{systemHealth.responseTime || 450}ms</span>
              </div>

              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Zap className="w-3 h-3 mr-1" />
                {systemHealth.agentsActive || 4} agents
              </Badge>
            </div>

            {/* Action Buttons */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            <Button className="bg-primary hover:bg-primary/90 glow-primary">Emergency Override</Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
