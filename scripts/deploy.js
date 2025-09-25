// Deployment script for SentinelAI contracts
const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying SentinelAI 4.0 contracts...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy USDM Token first
  console.log("\n1. Deploying USDM Token...")
  const USDMToken = await ethers.getContractFactory("USDMToken")
  const usdmToken = await USDMToken.deploy()
  await usdmToken.deployed()
  console.log("USDM Token deployed to:", usdmToken.address)

  // Deploy ZKVerifier
  console.log("\n2. Deploying ZKVerifier...")
  const ZKVerifier = await ethers.getContractFactory("ZKVerifier")
  const zkVerifier = await ZKVerifier.deploy()
  await zkVerifier.deployed()
  console.log("ZKVerifier deployed to:", zkVerifier.address)

  // Deploy main SentinelAI contract
  console.log("\n3. Deploying SentinelAI...")
  const SentinelAI = await ethers.getContractFactory("SentinelAI")
  const sentinelAI = await SentinelAI.deploy()
  await sentinelAI.deployed()
  console.log("SentinelAI deployed to:", sentinelAI.address)

  // Setup initial configuration
  console.log("\n4. Setting up initial configuration...")

  // Grant DAO role to deployer for testing
  const DAO_ROLE = await sentinelAI.DAO_ROLE()
  await sentinelAI.grantRole(DAO_ROLE, deployer.address)
  console.log("Granted DAO_ROLE to deployer")

  // Setup verification keys for ZK circuits
  console.log("\n5. Setting up ZK verification keys...")

  // Mock verification key for decision proof circuit
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

  await zkVerifier.setVerificationKey(
    "decision_proof",
    mockVK.alpha,
    mockVK.beta,
    mockVK.gamma,
    mockVK.delta,
    mockVK.ic,
  )
  console.log("Set verification key for decision_proof circuit")

  await zkVerifier.setVerificationKey(
    "compliance_mica",
    mockVK.alpha,
    mockVK.beta,
    mockVK.gamma,
    mockVK.delta,
    mockVK.ic,
  )
  console.log("Set verification key for compliance_mica circuit")

  // Deploy test agents
  console.log("\n6. Deploying test agents...")

  const testAgents = [
    { name: "TraderAgent", type: 0, address: deployer.address },
    { name: "ComplianceAgent", type: 1, address: deployer.address },
    { name: "SupervisorAgent", type: 2, address: deployer.address },
    { name: "AdvisorAgent", type: 3, address: deployer.address },
  ]

  for (const agent of testAgents) {
    const tx = await sentinelAI.hireAgent(
      agent.name,
      agent.type,
      agent.address,
      ethers.utils.parseEther("10000"), // 10,000 tokens staking
    )
    const receipt = await tx.wait()
    console.log(`Hired ${agent.name} - Gas used: ${receipt.gasUsed}`)
  }

  console.log("\n✅ Deployment completed successfully!")
  console.log("\nContract Addresses:")
  console.log("==================")
  console.log("USDM Token:", usdmToken.address)
  console.log("SentinelAI:", sentinelAI.address)
  console.log("ZKVerifier:", zkVerifier.address)

  console.log("\nNext steps:")
  console.log("1. Verify contracts on block explorer")
  console.log("2. Update frontend configuration with contract addresses")
  console.log("3. Test agent decision submission and execution")
  console.log("4. Setup monitoring and alerting")

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    contracts: {
      SentinelAI: sentinelAI.address,
      ZKVerifier: zkVerifier.address,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    gasUsed: {
      ZKVerifier: (await zkVerifier.deployTransaction.wait()).gasUsed.toString(),
      SentinelAI: (await sentinelAI.deployTransaction.wait()).gasUsed.toString(),
    },
  }

  console.log("\nDeployment Info:", JSON.stringify(deploymentInfo, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error)
    process.exit(1)
  })
