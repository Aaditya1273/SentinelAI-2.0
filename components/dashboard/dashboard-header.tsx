"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Search, Bell, Settings, Activity, Shield, Zap, BarChart3, Brain } from "lucide-react"
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
  const router = useRouter()
  const pathname = usePathname()

  const navigationTabs = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "System Status", icon: Activity, href: "/status" },
    { name: "Simulations", icon: Brain, href: "/simulation" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleTabClick = (href: string) => {
    router.push(href)
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        {/* Top Row - Logo, Search, Actions */}
        <div className="flex items-center justify-between py-4">
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

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <ConnectButton />
          </motion.div>
        </div>

        {/* Bottom Row - Navigation Tabs */}
        <div className="flex items-center space-x-1 pb-4">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href
            return (
              <Button
                key={tab.name}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabClick(tab.href)}
                className={`flex items-center space-x-2 ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Button>
            )
          })}
        </div>

        {/* System Health Bar */}
        <div className="flex items-center justify-between py-2 border-t border-border/50">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">
                {systemHealth.uptime ? `${(systemHealth.uptime * 100).toFixed(1)}% uptime` : "System Online"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {systemHealth.responseTime ? `${systemHealth.responseTime}ms` : "450ms avg"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {systemHealth.agentsActive ? `${systemHealth.agentsActive} agents` : "4 agents"}
              </span>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            All Systems Operational
          </Badge>
        </div>
      </div>
    </header>
  )
}
