"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Shield, Zap, Bell, Globe, Brain, AlertTriangle, CheckCircle, Save, Home, BarChart3, RefreshCw, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  const [settings, setSettings] = useState({
    // Agent Configuration
    agentAutoRebalance: true,
    agentRiskTolerance: 0.7,
    agentMaxPositionSize: 0.1,

    // Security Settings
    zkProofEnabled: true,
    multiSigRequired: true,
    emergencyPauseEnabled: true,

    // Notification Settings
    emailAlerts: true,
    slackIntegration: false,
    discordWebhook: false,

    // API Configuration
    ethereumRpc: "https://mainnet.infura.io/v3/...",
    polygonRpc: "https://polygon-rpc.com",
    cardanoRpc: "https://cardano-mainnet.blockfrost.io/api/v0",
  })

  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/landing')
    }
  }, [isConnected, router])

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

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  const updateSetting = async (key: string, value: any) => {
    try {
      // PRODUCTION: Save settings to real database/localStorage
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)
      
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('sentinelai-settings', JSON.stringify(newSettings))
      }
      
      // Save to production database if available
      if (address) {
        try {
          const response = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: address,
              settings: newSettings
            })
          })
          
          if (response.ok) {
            console.log('[Settings] Saved to production database')
          }
        } catch (error) {
          console.log('[Settings] Database save failed, using localStorage only')
        }
      }
      
    } catch (error) {
      console.error('Failed to update setting:', error)
    }
  }

  return (
    <>
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
                      item.id === 'settings'
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

      <main className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Configure SentinelAI 4.0 parameters and integrations
            </p>
          </div>

          <Tabs defaultValue="agents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="agents" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Agents</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Chains</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Agent Configuration</h3>
                    <p className="text-gray-600">Configure AI agent behavior and parameters</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium text-gray-900">Auto-Rebalancing</Label>
                      <p className="text-sm text-gray-600">
                        Allow agents to automatically rebalance portfolio positions
                      </p>
                    </div>
                    <Switch
                      checked={settings.agentAutoRebalance}
                      onCheckedChange={(checked) => updateSetting("agentAutoRebalance", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Risk Tolerance</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.agentRiskTolerance}
                        onChange={(e) => updateSetting("agentRiskTolerance", Number.parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <Badge variant="outline" className="min-w-16">
                        {(settings.agentRiskTolerance * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Higher values allow more aggressive trading strategies
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Maximum Position Size</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="range"
                        min="0.01"
                        max="0.5"
                        step="0.01"
                        value={settings.agentMaxPositionSize}
                        onChange={(e) => updateSetting("agentMaxPositionSize", Number.parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <Badge variant="outline" className="min-w-16">
                        {(settings.agentMaxPositionSize * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Maximum percentage of treasury that can be allocated to a single position
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>
                    <p className="text-gray-600">Configure security settings and privacy controls</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium flex items-center space-x-2">
                        <span>Zero-Knowledge Proofs</span>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </Label>
                      <p className="text-sm text-muted-foreground">Enable privacy-preserving decision verification</p>
                    </div>
                    <Switch
                      checked={settings.zkProofEnabled}
                      onCheckedChange={(checked) => updateSetting("zkProofEnabled", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Multi-Signature Required</Label>
                      <p className="text-sm text-muted-foreground">
                        Require multiple signatures for high-value transactions
                      </p>
                    </div>
                    <Switch
                      checked={settings.multiSigRequired}
                      onCheckedChange={(checked) => updateSetting("multiSigRequired", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium flex items-center space-x-2">
                        <span>Emergency Pause</span>
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      </Label>
                      <p className="text-sm text-gray-600">
                        Enable emergency pause mechanism for crisis situations
                      </p>
                    </div>
                    <Switch
                      checked={settings.emergencyPauseEnabled}
                      onCheckedChange={(checked) => updateSetting("emergencyPauseEnabled", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
                    <p className="text-gray-600">Configure alerts and notification preferences</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for critical events</p>
                    </div>
                    <Switch
                      checked={settings.emailAlerts}
                      onCheckedChange={(checked) => updateSetting("emailAlerts", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Slack Integration</Label>
                      <p className="text-sm text-muted-foreground">Send alerts to your Slack workspace</p>
                    </div>
                    <Switch
                      checked={settings.slackIntegration}
                      onCheckedChange={(checked) => updateSetting("slackIntegration", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Discord Webhook</Label>
                      <p className="text-sm text-gray-600">Post notifications to Discord channel</p>
                    </div>
                    <Switch
                      checked={settings.discordWebhook}
                      onCheckedChange={(checked) => updateSetting("discordWebhook", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Blockchain Integrations</h3>
                    <p className="text-gray-600">Configure blockchain network connections</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Ethereum RPC URL</Label>
                    <Input
                      value={settings.ethereumRpc}
                      onChange={(e) => updateSetting("ethereumRpc", e.target.value)}
                      placeholder="https://mainnet.infura.io/v3/..."
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Polygon RPC URL</Label>
                    <Input
                      value={settings.polygonRpc}
                      onChange={(e) => updateSetting("polygonRpc", e.target.value)}
                      placeholder="https://polygon-rpc.com"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Cardano RPC URL</Label>
                    <Input
                      value={settings.cardanoRpc}
                      onChange={(e) => updateSetting("cardanoRpc", e.target.value)}
                      placeholder="https://cardano-mainnet.blockfrost.io/api/v0"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Advanced Configuration</h3>
                    <p className="text-gray-600">Advanced system settings and parameters</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span className="font-medium text-warning">Warning</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Advanced settings can significantly impact system performance and security. Only modify these if
                      you understand the implications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Gas Price Strategy</Label>
                      <select className="w-full p-2 rounded-md border border-border bg-background">
                        <option>Conservative</option>
                        <option>Standard</option>
                        <option>Aggressive</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Slippage Tolerance</Label>
                      <Input type="number" placeholder="0.5" />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">MEV Protection</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Debug Mode</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="min-w-32">
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </main>
      </div>
    </>
  )
}
