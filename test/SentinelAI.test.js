const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SentinelAI", () => {
  let sentinelAI
  let zkVerifier
  let owner
  let agent1
  let agent2
  let dao

  beforeEach(async () => {
    ;[owner, agent1, agent2, dao] = await ethers.getSigners()

    // Deploy ZKVerifier
    const ZKVerifier = await ethers.getContractFactory("ZKVerifier")
    zkVerifier = await ZKVerifier.deploy()
    await zkVerifier.deployed()

    // Deploy SentinelAI
    const SentinelAI = await ethers.getContractFactory("SentinelAI")
    sentinelAI = await SentinelAI.deploy()
    await sentinelAI.deployed()

    // Grant DAO role
    const DAO_ROLE = await sentinelAI.DAO_ROLE()
    await sentinelAI.grantRole(DAO_ROLE, dao.address)
  })

  describe("Agent Management", () => {
    it("Should hire an agent with sufficient staking", async () => {
      const stakingAmount = ethers.utils.parseEther("10000")

      const tx = await sentinelAI.connect(dao).hireAgent(
        "TestTrader",
        0, // TRADER type
        agent1.address,
        stakingAmount,
      )

      const receipt = await tx.wait()
      const event = receipt.events.find((e) => e.event === "AgentHired")

      expect(event).to.not.be.undefined
      expect(event.args.agentAddress).to.equal(agent1.address)
      expect(event.args.stakingAmount).to.equal(stakingAmount)
    })

    it("Should reject agent hiring with insufficient staking", async () => {
      const insufficientStaking = ethers.utils.parseEther("5000")

      await expect(
        sentinelAI.connect(dao).hireAgent("TestTrader", 0, agent1.address, insufficientStaking),
      ).to.be.revertedWith("Insufficient staking amount")
    })

    it("Should suspend an agent", async () => {
      // First hire an agent
      const stakingAmount = ethers.utils.parseEther("10000")
      const tx = await sentinelAI.connect(dao).hireAgent("TestTrader", 0, agent1.address, stakingAmount)
      const receipt = await tx.wait()
      const agentId = receipt.events.find((e) => e.event === "AgentHired").args.agentId

      // Then suspend the agent
      await expect(sentinelAI.suspendAgent(agentId, "Poor performance"))
        .to.emit(sentinelAI, "AgentSuspended")
        .withArgs(agentId, "Poor performance")

      const agent = await sentinelAI.getAgent(agentId)
      expect(agent.isActive).to.be.false
    })
  })

  describe("Decision Management", () => {
    let agentId

    beforeEach(async () => {
      // Hire an agent first
      const stakingAmount = ethers.utils.parseEther("10000")
      const tx = await sentinelAI.connect(dao).hireAgent("TestTrader", 0, agent1.address, stakingAmount)
      const receipt = await tx.wait()
      agentId = receipt.events.find((e) => e.event === "AgentHired").args.agentId
    })

    it("Should submit a decision with valid ZK proof", async () => {
      const action = "Rebalance portfolio to 60% ETH, 40% stables"
      const rationale = "Market volatility analysis suggests defensive positioning"
      const confidence = 85
      const zkProofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("mock_proof"))
      const zkProof = ethers.utils.toUtf8Bytes("mock_proof_data")

      await expect(
        sentinelAI.connect(agent1).submitDecision(action, rationale, confidence, zkProofHash, zkProof),
      ).to.emit(sentinelAI, "DecisionMade")
    })

    it("Should reject decision with low confidence", async () => {
      const action = "Test action"
      const rationale = "Test rationale"
      const confidence = 50 // Below threshold
      const zkProofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("mock_proof"))
      const zkProof = ethers.utils.toUtf8Bytes("mock_proof_data")

      await expect(
        sentinelAI.connect(agent1).submitDecision(action, rationale, confidence, zkProofHash, zkProof),
      ).to.be.revertedWith("Confidence too low")
    })
  })

  describe("ZK Proof Verification", () => {
    it("Should verify a valid ZK proof", async () => {
      const circuitId = "decision_proof"
      const proof = {
        a: [1, 2],
        b: [3, 4],
        c: [5, 6],
      }
      const publicInputs = [100, 85] // Mock public inputs

      // Set up verification key first
      const mockVK = {
        alpha: [1, 2],
        beta: [
          [3, 4],
          [5, 6],
        ],
        gamma: [
          [7, 8],
          [9, 10],
        ],
        delta: [
          [11, 12],
          [13, 14],
        ],
        ic: [
          [15, 16],
          [17, 18],
        ],
      }

      await zkVerifier.setVerificationKey(circuitId, mockVK.alpha, mockVK.beta, mockVK.gamma, mockVK.delta, mockVK.ic)

      const result = await zkVerifier.verifyDecisionProof(circuitId, proof.a, proof.b, proof.c, publicInputs)

      expect(result).to.be.true
    })

    it("Should batch verify multiple proofs", async () => {
      const circuitIds = ["decision_proof", "compliance_mica"]
      const proofs = [
        { a: [1, 2], b: [3, 4], c: [5, 6] },
        { a: [7, 8], b: [9, 10], c: [11, 12] },
      ]
      const publicInputsArray = [
        [100, 85],
        [200, 95],
      ]

      // Set up verification keys
      const mockVK = {
        alpha: [1, 2],
        beta: [
          [3, 4],
          [5, 6],
        ],
        gamma: [
          [7, 8],
          [9, 10],
        ],
        delta: [
          [11, 12],
          [13, 14],
        ],
        ic: [
          [15, 16],
          [17, 18],
        ],
      }

      for (const circuitId of circuitIds) {
        await zkVerifier.setVerificationKey(circuitId, mockVK.alpha, mockVK.beta, mockVK.gamma, mockVK.delta, mockVK.ic)
      }

      const results = await zkVerifier.batchVerifyProofs(circuitIds, proofs, publicInputsArray)

      expect(results).to.have.lengthOf(2)
      expect(results[0]).to.be.true
      expect(results[1]).to.be.true
    })
  })

  describe("Emergency Functions", () => {
    it("Should pause the system in emergency", async () => {
      await expect(sentinelAI.emergencyPause("Flash crash detected"))
        .to.emit(sentinelAI, "EmergencyPause")
        .withArgs(owner.address, "Flash crash detected")

      expect(await sentinelAI.paused()).to.be.true
    })

    it("Should unpause the system", async () => {
      await sentinelAI.emergencyPause("Test pause")
      await sentinelAI.unpause()

      expect(await sentinelAI.paused()).to.be.false
    })
  })
})
