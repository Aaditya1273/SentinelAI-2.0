import { SystemStatus } from "@/components/dashboard/system-status"

export default function StatusPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">System Status</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Real-time monitoring of SentinelAI 4.0 components, performance metrics, and security status
        </p>
      </div>

      <SystemStatus />
    </div>
  )
}
