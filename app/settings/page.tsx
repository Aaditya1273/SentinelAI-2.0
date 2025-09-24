"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/navigation/main-nav"
import { Settings, Shield, Zap, Bell, Globe, Brain, AlertTriangle, CheckCircle, Save } from "lucide-react"

export default function SettingsPage() {
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

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <MainNav />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
              <p className="text-muted-foreground">Configure SentinelAI 4.0 parameters and integrations</p>
            </div>
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
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>Agent Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Auto-Rebalancing</Label>
                      <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
                      Maximum percentage of treasury that can be allocated to a single position
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Security & Privacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                      <p className="text-sm text-muted-foreground">
                        Enable emergency pause mechanism for crisis situations
                      </p>
                    </div>
                    <Switch
                      checked={settings.emergencyPauseEnabled}
                      onCheckedChange={(checked) => updateSetting("emergencyPauseEnabled", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                      <p className="text-sm text-muted-foreground">Post notifications to Discord channel</p>
                    </div>
                    <Switch
                      checked={settings.discordWebhook}
                      onCheckedChange={(checked) => updateSetting("discordWebhook", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span>Blockchain Integrations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span>Advanced Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span className="font-medium text-warning">Warning</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
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
  )
}
