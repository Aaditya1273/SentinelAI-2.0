// Comprehensive Test Suite for SentinelAI 4.0
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { agentFramework } from '../lib/agent-framework'
import { TraderAgent } from '../lib/agents/trader-agent'
import { ComplianceAgent } from '../lib/agents/compliance-agent'
import { SupervisorAgent } from '../lib/agents/supervisor-agent'
import { AdvisorAgent } from '../lib/agents/advisor-agent'
import { aiMLStack } from '../lib/ai-ml-stack'
import { agentMarketplace } from '../lib/agent-marketplace'
import { advancedPrivacySystem } from '../lib/advanced-privacy'
import { walletIntegration } from '../lib/wallet-integration'

describe('SentinelAI 4.0 Agent Framework', () => {
  beforeEach(async () => {
    // Reset all systems before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Cleanup after each test
  })

  describe('Multi-Agent System', () => {
    test('should initialize all four agent types', async () => {
      await agentFramework.startAgents()
      const agents = agentFramework.getAgents()
      
      expect(agents).toHaveLength(4)
      expect(agents.map(a => a.type)).toContain('trader')
      expect(agents.map(a => a.type)).toContain('compliance')
      expect(agents.map(a => a.type)).toContain('supervisor')
      expect(agents.map(a => a.type)).toContain('advisor')
    })

    test('should create trader agent with correct capabilities', () => {
      const trader = new TraderAgent('test-trader')
      
      expect(trader.getName()).toBe('TraderAgent')
      expect(trader.getType()).toBe('trader')
      expect(trader.getCapabilities()).toContain('portfolio_optimization')
      expect(trader.getCapabilities()).toContain('yield_farming')
      expect(trader.getCapabilities()).toContain('cross_chain_allocation')
    })

    test('should generate trading decisions with XAI explanations', async () => {
      const trader = new TraderAgent('test-trader')
      const mockContext = {
        portfolioValue: 1000000,
        marketVolatility: 0.15,
        riskTolerance: 0.3
      }

      const decision = await trader.makeDecision(mockContext)
      
      expect(decision).toHaveProperty('id')
      expect(decision).toHaveProperty('action')
      expect(decision).toHaveProperty('rationale')
      expect(decision).toHaveProperty('confidence')
      expect(decision).toHaveProperty('zkProof')
      expect(decision.confidence).toBeGreaterThan(0)
      expect(decision.confidence).toBeLessThanOrEqual(1)
      expect(decision.rationale).toContain('ZK-verified')
    })

    test('should detect and handle bias in agent decisions', async () => {
      const supervisor = new SupervisorAgent('test-supervisor')
      const mockDecision = {
        agentId: 'test-trader',
        action: 'rebalance',
        confidence: 0.9,
        factors: ['market_trend', 'volatility']
      }

      const auditResult = await supervisor.auditAgentDecision(mockDecision)
      
      expect(auditResult).toHaveProperty('biasDetected')
      expect(auditResult).toHaveProperty('fairnessScore')
      expect(auditResult).toHaveProperty('recommendations')
      expect(typeof auditResult.biasDetected).toBe('boolean')
    })

    test('should enforce compliance with MiCA regulations', async () => {
      const compliance = new ComplianceAgent('test-compliance')
      const mockTransaction = {
        amount: 5000,
        jurisdiction: 'EU',
        kycLevel: 3,
        entityType: 'individual'
      }

      const complianceCheck = await compliance.checkCompliance(mockTransaction, 'mica')
      
      expect(complianceCheck).toHaveProperty('compliant')
      expect(complianceCheck).toHaveProperty('riskScore')
      expect(complianceCheck).toHaveProperty('requiredActions')
      expect(typeof complianceCheck.compliant).toBe('boolean')
    })

    test('should provide risk predictions with sub-1s response time', async () => {
      const advisor = new AdvisorAgent('test-advisor')
      const mockMarketData = {
        prices: [100, 102, 98, 105, 103],
        volumes: [1000, 1200, 800, 1500, 1100],
        volatility: 0.18
      }

      const startTime = Date.now()
      const riskPrediction = await advisor.predictRisk(mockMarketData)
      const responseTime = Date.now() - startTime

      expect(responseTime).toBeLessThan(1000) // Sub-1s requirement
      expect(riskPrediction).toHaveProperty('riskScore')
      expect(riskPrediction).toHaveProperty('volatilityForecast')
      expect(riskPrediction).toHaveProperty('timeHorizon')
      expect(riskPrediction.riskScore).toBeGreaterThanOrEqual(0)
      expect(riskPrediction.riskScore).toBeLessThanOrEqual(1)
    })
  })

  describe('AI/ML Stack Integration', () => {
    test('should perform edge inference with ONNX Runtime', async () => {
      const inputData = [0.5, 0.3, 0.8, 0.2, 0.9]
      const result = await aiMLStack.edgeInference('trader', inputData)
      
      expect(result).toHaveProperty('prediction')
      expect(result).toHaveProperty('confidence')
      expect(result).toHaveProperty('processingTime')
      expect(result).toHaveProperty('explanation')
      expect(result.processingTime).toBeLessThan(1000)
      expect(result.confidence).toBeGreaterThan(0)
    })

    test('should generate SHAP explanations for model decisions', async () => {
      const inputData = [0.1, 0.2, 0.3, 0.4, 0.5]
      const result = await aiMLStack.edgeInference('compliance', inputData)
      
      expect(result.explanation).toHaveProperty('shapValues')
      expect(result.explanation).toHaveProperty('explanation')
      expect(Array.isArray(result.explanation.shapValues)).toBe(true)
      expect(result.explanation.shapValues.length).toBeGreaterThan(0)
    })

    test('should execute federated learning rounds', async () => {
      const initialStats = aiMLStack.getModelStats()
      
      await aiMLStack.startFederatedLearning()
      
      const updatedStats = aiMLStack.getModelStats()
      expect(updatedStats.federatedRounds).toBe(initialStats.federatedRounds + 1)
    })

    test('should perform machine unlearning', async () => {
      const dataToRemove = [{ id: 1, data: 'sensitive' }, { id: 2, data: 'biased' }]
      
      await expect(aiMLStack.unlearnData('trader', dataToRemove)).resolves.not.toThrow()
    })
  })

  describe('Tokenized Agent Economy', () => {
    test('should list agents in marketplace', async () => {
      const agentData = {
        owner: '0x1234567890123456789012345678901234567890',
        agentType: 'trader' as const,
        name: 'Test Trader',
        description: 'Test trading agent',
        hourlyRate: 50,
        stakingRequirement: 5000,
        performanceScore: 95,
        isActive: true,
        specialties: ['Portfolio Optimization'],
        availability: 'available' as const,
        rating: 4.8
      }

      const agentId = await agentMarketplace.listAgent(agentData)
      
      expect(typeof agentId).toBe('string')
      expect(agentId).toMatch(/^agent_/)
      
      const listedAgent = agentMarketplace.getAgentById(agentId)
      expect(listedAgent).toBeDefined()
      expect(listedAgent?.name).toBe('Test Trader')
    })

    test('should hire agents with USDM tokens', async () => {
      const agents = agentMarketplace.getAllAgents()
      expect(agents.length).toBeGreaterThan(0)
      
      const agent = agents[0]
      const contractId = await agentMarketplace.hireAgent(
        agent.id,
        10, // 10 hours
        ['Portfolio optimization', 'Risk analysis']
      )
      
      expect(typeof contractId).toBe('string')
      expect(contractId).toMatch(/^contract_/)
      
      const contract = agentMarketplace.getContractById(contractId)
      expect(contract).toBeDefined()
      expect(contract?.agentId).toBe(agent.id)
      expect(contract?.duration).toBe(10)
    })

    test('should calculate marketplace statistics', () => {
      const stats = agentMarketplace.getMarketplaceStats()
      
      expect(stats).toHaveProperty('totalAgents')
      expect(stats).toHaveProperty('activeAgents')
      expect(stats).toHaveProperty('totalContracts')
      expect(stats).toHaveProperty('totalVolume')
      expect(stats).toHaveProperty('averageRating')
      expect(stats).toHaveProperty('topPerformers')
      expect(typeof stats.totalAgents).toBe('number')
      expect(Array.isArray(stats.topPerformers)).toBe(true)
    })
  })

  describe('Advanced Privacy System', () => {
    test('should generate quantum-resistant ZK proofs', async () => {
      const privateInputs = { secret: 42, nonce: 123 }
      const publicInputs = { threshold: 50, timestamp: Date.now() }
      
      const proof = await advancedPrivacySystem.generateQuantumResistantProof(
        'quantum_decision_proof',
        privateInputs,
        publicInputs
      )
      
      expect(proof).toHaveProperty('proof')
      expect(proof).toHaveProperty('publicSignals')
      expect(proof).toHaveProperty('circuitName')
      expect(proof).toHaveProperty('timestamp')
      expect(proof.circuitName).toBe('quantum_decision_proof')
      expect(proof.proof.hybrid).toBe(true)
    })

    test('should verify quantum-resistant proofs', async () => {
      const privateInputs = { secret: 42, nonce: 123 }
      const publicInputs = { threshold: 50, timestamp: Date.now() }
      
      const proof = await advancedPrivacySystem.generateQuantumResistantProof(
        'quantum_compliance_proof',
        privateInputs,
        publicInputs
      )
      
      const isValid = await advancedPrivacySystem.verifyQuantumResistantProof(proof)
      expect(typeof isValid).toBe('boolean')
    })

    test('should generate privacy-preserving audit proofs', async () => {
      const agentId = 'test-agent'
      const decisions = [
        { action: 'buy', amount: 1000 },
        { action: 'sell', amount: 500 }
      ]
      const sensitiveData = { userIds: [1, 2, 3], balances: [100, 200, 300] }
      
      const auditProof = await advancedPrivacySystem.generatePrivacyPreservingAudit(
        agentId,
        decisions,
        sensitiveData
      )
      
      expect(auditProof).toHaveProperty('proof')
      expect(auditProof).toHaveProperty('circuitName')
      expect(auditProof.circuitName).toBe('quantum_compliance_proof')
    })

    test('should provide privacy system statistics', () => {
      const stats = advancedPrivacySystem.getPrivacyStats()
      
      expect(stats).toHaveProperty('totalCircuits')
      expect(stats).toHaveProperty('quantumResistantCircuits')
      expect(stats).toHaveProperty('gasOptimizedCircuits')
      expect(stats).toHaveProperty('circuitStats')
      expect(typeof stats.totalCircuits).toBe('number')
      expect(Array.isArray(stats.circuitStats)).toBe(true)
    })
  })

  describe('Wallet Integration', () => {
    test('should connect to wallet successfully', async () => {
      const connection = await walletIntegration.connectWallet()
      
      expect(connection).toHaveProperty('address')
      expect(connection).toHaveProperty('chainId')
      expect(connection.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
      expect(typeof connection.chainId).toBe('number')
      expect(walletIntegration.isConnected()).toBe(true)
    })

    test('should get token balances', async () => {
      await walletIntegration.connectWallet()
      
      const balance = await walletIntegration.getTokenBalance('USDM', 1)
      
      expect(typeof balance).toBe('string')
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0)
    })

    test('should stake USDM tokens', async () => {
      await walletIntegration.connectWallet()
      
      const txHash = await walletIntegration.stakeUSDMTokens('1000')
      
      expect(typeof txHash).toBe('string')
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    test('should hire agents with wallet integration', async () => {
      await walletIntegration.connectWallet()
      
      const txHash = await walletIntegration.hireAgentWithUSDM('agent_1', 5, 50)
      
      expect(typeof txHash).toBe('string')
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    test('should support cross-chain bridging', async () => {
      await walletIntegration.connectWallet()
      
      const txHash = await walletIntegration.bridgeTokensCrossChain(
        'USDM',
        '100',
        1, // Ethereum
        137 // Polygon
      )
      
      expect(typeof txHash).toBe('string')
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    test('should list supported chains and tokens', () => {
      const chains = walletIntegration.getSupportedChains()
      const tokens = walletIntegration.getSupportedTokens()
      
      expect(Array.isArray(chains)).toBe(true)
      expect(Array.isArray(tokens)).toBe(true)
      expect(chains.length).toBeGreaterThan(0)
      expect(tokens.length).toBeGreaterThan(0)
      
      // Check for required chains
      const chainIds = chains.map(c => c.id)
      expect(chainIds).toContain(1) // Ethereum
      expect(chainIds).toContain(137) // Polygon
      expect(chainIds).toContain(1815) // Cardano
      
      // Check for required tokens
      const tokenSymbols = tokens.map(t => t.symbol)
      expect(tokenSymbols).toContain('USDM')
      expect(tokenSymbols).toContain('ETH')
      expect(tokenSymbols).toContain('ADA')
    })
  })

  describe('Integration Tests', () => {
    test('should complete full agent hiring workflow', async () => {
      // 1. Connect wallet
      await walletIntegration.connectWallet()
      
      // 2. Search for available agents
      const availableAgents = await agentMarketplace.searchAgents({
        agentType: 'trader',
        availability: 'available',
        minRating: 4.0
      })
      
      expect(availableAgents.length).toBeGreaterThan(0)
      
      // 3. Hire an agent
      const agent = availableAgents[0]
      const contractId = await agentMarketplace.hireAgent(
        agent.id,
        8, // 8 hours
        ['Portfolio optimization']
      )
      
      // 4. Execute payment via wallet
      const txHash = await walletIntegration.hireAgentWithUSDM(
        agent.id,
        8,
        agent.hourlyRate
      )
      
      // 5. Verify contract creation
      const contract = agentMarketplace.getContractById(contractId)
      expect(contract).toBeDefined()
      expect(contract?.status).toBe('pending')
      
      // 6. Complete the contract
      await agentMarketplace.completeContract(contractId, 5, 'Excellent work!')
      
      const completedContract = agentMarketplace.getContractById(contractId)
      expect(completedContract?.status).toBe('completed')
    })

    test('should handle crisis simulation with all systems', async () => {
      // Start all agents
      await agentFramework.startAgents()
      
      // Simulate market crisis
      const crisisData = {
        marketCrash: true,
        volatilitySpike: 0.45,
        liquidityDrop: 0.60,
        timestamp: Date.now()
      }
      
      // Get risk prediction
      const advisor = new AdvisorAgent('crisis-advisor')
      const riskPrediction = await advisor.predictRisk(crisisData)
      
      // Check compliance during crisis
      const compliance = new ComplianceAgent('crisis-compliance')
      const emergencyTransaction = {
        amount: 100000,
        type: 'emergency_liquidation',
        jurisdiction: 'EU'
      }
      const complianceCheck = await compliance.checkCompliance(emergencyTransaction, 'mica')
      
      // Generate privacy proof for emergency actions
      const emergencyProof = await advancedPrivacySystem.generateQuantumResistantProof(
        'quantum_treasury_proof',
        { emergencyAction: 1, amount: 100000 },
        { crisisLevel: 3, timestamp: Date.now() }
      )
      
      // Verify all systems responded appropriately
      expect(riskPrediction.riskScore).toBeGreaterThan(0.7) // High risk during crisis
      expect(complianceCheck).toHaveProperty('compliant')
      expect(emergencyProof).toHaveProperty('proof')
    })
  })
})
