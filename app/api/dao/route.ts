import { type NextRequest, NextResponse } from "next/server"
import { DAOApiManager } from "@/lib/api/dao-api"

const daoManager = new DAOApiManager()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const daoAddress = searchParams.get("dao")
  const daoType = searchParams.get("type") as "snapshot" | "aragon"

  try {
    switch (action) {
      case "overview":
        if (!daoAddress || !daoType) {
          return NextResponse.json({ error: "Missing dao address or type" }, { status: 400 })
        }
        const overview = await daoManager.getDAOOverview(daoAddress, daoType)
        return NextResponse.json(overview)

      case "arbitrage":
        const opportunities = await daoManager.getArbitrageOpportunities()
        return NextResponse.json({ opportunities })

      case "chains":
        const chainStatus = await daoManager.getCrossChainStatus()
        return NextResponse.json({ chains: chainStatus })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] DAO API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "execute_strategy":
        const result = await daoManager.executeMultiChainStrategy(data.strategy)
        return NextResponse.json(result)

      case "initialize":
        await daoManager.initializeMonitoring(data.config)
        return NextResponse.json({ status: "initialized" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] DAO API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
