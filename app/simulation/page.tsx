import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrisisDashboard } from "@/components/simulation/crisis-dashboard"
import { DemoScenarios } from "@/components/simulation/demo-scenarios"

export default function SimulationPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">SentinelAI Simulation Center</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the power of SentinelAI through interactive demonstrations and crisis simulations. Test our AI
          agents' responses to various scenarios and see explainable AI in action.
        </p>
      </div>

      <Tabs defaultValue="demos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demos">Interactive Demos</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Simulations</TabsTrigger>
        </TabsList>

        <TabsContent value="demos" className="space-y-6">
          <DemoScenarios />
        </TabsContent>

        <TabsContent value="crisis" className="space-y-6">
          <CrisisDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
