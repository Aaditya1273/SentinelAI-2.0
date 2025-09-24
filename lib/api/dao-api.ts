import { SnapshotConnector } from "../dao-connectors/snapshot-connector"
import { AragonConnector } from "../dao-connectors/aragon-connector"
import { BridgeManager } from "../cross-chain/bridge-manager"
import { ChainMonitor } from "../cross-chain/chain-monitor"

export class DAOApiManager {
  private snapshotConnector: SnapshotConnector
  private aragonConnector: AragonConnector
  private bridgeManager: BridgeManager
  private chainMonitor: ChainMonitor

  constructor() {
    this.snapshotConnector = new SnapshotConnector()
    this.aragonConnector = new AragonConnector()
    this.bridgeManager = new BridgeManager()
    this.chainMonitor = new ChainMonitor()
  }

  async initializeMonitoring(daoConfig: any) {
    const chains = daoConfig.supportedChains || ["ethereum", "polygon"]
    await this.chainMonitor.startMonitoring(chains)
  }

  async getDAOOverview(daoAddress: string, daoType: "snapshot" | "aragon") {
    try {
      if (daoType === "snapshot") {
        const proposals = await this.snapshotConnector.getProposals(daoAddress)
        return {
          type: "snapshot",
          proposals: proposals.data?.proposals || [],
          totalProposals: proposals.data?.proposals?.length || 0,
        }
      } else {
        const daoInfo = await this.aragonConnector.getDAOInfo(daoAddress)
        const treasury = await this.aragonConnector.getTreasuryBalance(daoAddress)
        return {
          type: "aragon",
          info: daoInfo.data?.organization,
          treasury: treasury.data?.tokenBalances || [],
          totalAssets: treasury.data?.tokenBalances?.length || 0,
        }
      }
    } catch (error) {
      console.error("[v0] Failed to get DAO overview:", error)
      throw error
    }
  }

  async executeMultiChainStrategy(strategy: any) {
    const results = []

    for (const action of strategy.actions) {
      if (action.type === "bridge") {
        const bridgeResult = await this.bridgeManager.bridgeAssets(
          action.fromChain,
          action.toChain,
          action.tokenAddress,
          BigInt(action.amount),
          action.recipient,
        )
        results.push(bridgeResult)
      }
    }

    return {
      strategyId: strategy.id,
      executedActions: results,
      status: "executing",
      estimatedCompletion: Date.now() + 60 * 60 * 1000, // 1 hour
    }
  }

  async getArbitrageOpportunities() {
    return await this.chainMonitor.detectCrossChainArbitrage()
  }

  async getCrossChainStatus() {
    return this.chainMonitor.getAllChainStates()
  }

  async cleanup() {
    await this.chainMonitor.stopMonitoring()
  }
}
