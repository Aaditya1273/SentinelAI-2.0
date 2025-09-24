// Configuration for SentinelAI 4.0
export const CONFIG = {
  // AI Configuration
  AI: {
    MAX_AGENTS: 10,
    DECISION_CONFIDENCE_THRESHOLD: 0.75,
    XAI_EXPLANATION_LENGTH: 200,
    FEDERATED_LEARNING_ROUNDS: 5,
    EDGE_AI_TIMEOUT: 1000, // 1 second
  },

  // Blockchain Configuration
  BLOCKCHAIN: {
    NETWORKS: {
      ETHEREUM: {
        chainId: 1,
        rpcUrl: process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/",
        explorerUrl: "https://etherscan.io",
      },
      CARDANO: {
        chainId: 1815,
        rpcUrl: process.env.CARDANO_RPC_URL || "https://cardano-mainnet.blockfrost.io/api/v0",
        explorerUrl: "https://cardanoscan.io",
      },
      MIDNIGHT: {
        chainId: 2024,
        rpcUrl: process.env.MIDNIGHT_RPC_URL || "https://midnight-testnet.io/rpc",
        explorerUrl: "https://midnight-explorer.io",
      },
    },
    GAS_OPTIMIZATION_TARGET: 0.3, // 30% reduction
    MULTISIG_THRESHOLD: 3,
  },

  // ZK Configuration
  ZK: {
    CIRCUIT_PATHS: {
      DECISION_PROOF: "./circuits/decision_proof.circom",
      COMPLIANCE_PROOF: "./circuits/compliance_proof.circom",
      TREASURY_PROOF: "./circuits/treasury_proof.circom",
    },
    QUANTUM_RESISTANT: true,
    PROOF_GENERATION_TIMEOUT: 30000, // 30 seconds
  },

  // DAO Integration
  DAO: {
    SNAPSHOT_API: "https://hub.snapshot.org/graphql",
    UNISWAP_API: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    AAVE_API: "https://api.thegraph.com/subgraphs/name/aave/protocol-v3",
    GOVERNANCE_DELAY: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Performance Targets
  PERFORMANCE: {
    RISK_PREDICTION_TIME: 1000, // <1s
    YIELD_IMPROVEMENT_TARGET: 0.15, // 15%
    UPTIME_TARGET: 0.999, // 99.9%
    ENERGY_REDUCTION_TARGET: 0.4, // 40%
  },

  // Security
  SECURITY: {
    ORACLE_SOURCES: 3, // Minimum oracle sources for price feeds
    BRIDGE_VERIFICATION_DELAY: 10 * 60 * 1000, // 10 minutes
    EMERGENCY_PAUSE_THRESHOLD: 0.1, // 10% treasury loss
  },
}

export const getNetworkConfig = (chainId: number) => {
  const networks = CONFIG.BLOCKCHAIN.NETWORKS
  return Object.values(networks).find((network) => network.chainId === chainId)
}
