// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SentinelAI Core Contract
 * @dev Main contract for SentinelAI 4.0 DAO treasury management
 */
contract SentinelAI is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant SUPERVISOR_ROLE = keccak256("SUPERVISOR_ROLE");
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

    struct Agent {
        string name;
        AgentType agentType;
        address agentAddress;
        uint256 stakingAmount;
        uint256 performanceScore;
        bool isActive;
        uint256 hiredAt;
    }

    struct Decision {
        bytes32 id;
        address agentAddress;
        string action;
        string rationale;
        uint256 confidence;
        bytes32 zkProofHash;
        uint256 timestamp;
        bool executed;
    }

    struct Treasury {
        uint256 totalValue;
        mapping(address => uint256) tokenBalances;
        uint256 riskScore;
        uint256 lastRebalance;
    }

    enum AgentType {
        TRADER,
        COMPLIANCE,
        SUPERVISOR,
        ADVISOR
    }

    // State variables
    mapping(bytes32 => Agent) public agents;
    mapping(bytes32 => Decision) public decisions;
    mapping(address => Treasury) public treasuries;
    mapping(bytes32 => bool) public verifiedZKProofs;
    
    bytes32[] public agentIds;
    bytes32[] public decisionIds;
    
    uint256 public constant MIN_STAKING_AMOUNT = 10000 * 10**18; // 10,000 tokens
    uint256 public constant DECISION_CONFIDENCE_THRESHOLD = 75; // 75%
    uint256 public constant EMERGENCY_PAUSE_THRESHOLD = 10; // 10% loss
    
    // Events
    event AgentHired(bytes32 indexed agentId, address indexed agentAddress, AgentType agentType, uint256 stakingAmount);
    event AgentSuspended(bytes32 indexed agentId, string reason);
    event DecisionMade(bytes32 indexed decisionId, address indexed agent, string action, uint256 confidence);
    event DecisionExecuted(bytes32 indexed decisionId, bool success);
    event ZKProofVerified(bytes32 indexed proofHash, bytes32 indexed decisionId);
    event EmergencyPause(address indexed trigger, string reason);
    event TreasuryRebalanced(address indexed dao, uint256 newValue, uint256 riskScore);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SUPERVISOR_ROLE, msg.sender);
    }

    /**
     * @dev Hire a new AI agent with staking requirement
     */
    function hireAgent(
        string memory name,
        AgentType agentType,
        address agentAddress,
        uint256 stakingAmount
    ) external onlyRole(DAO_ROLE) returns (bytes32) {
        require(stakingAmount >= MIN_STAKING_AMOUNT, "Insufficient staking amount");
        require(agentAddress != address(0), "Invalid agent address");

        bytes32 agentId = keccak256(abi.encodePacked(name, agentAddress, block.timestamp));
        
        agents[agentId] = Agent({
            name: name,
            agentType: agentType,
            agentAddress: agentAddress,
            stakingAmount: stakingAmount,
            performanceScore: 100, // Start with 100% performance
            isActive: true,
            hiredAt: block.timestamp
        });

        agentIds.push(agentId);
        _grantRole(AGENT_ROLE, agentAddress);

        emit AgentHired(agentId, agentAddress, agentType, stakingAmount);
        return agentId;
    }

    /**
     * @dev Submit a decision with ZK proof
     */
    function submitDecision(
        string memory action,
        string memory rationale,
        uint256 confidence,
        bytes32 zkProofHash,
        bytes memory zkProof
    ) external onlyRole(AGENT_ROLE) returns (bytes32) {
        require(confidence >= DECISION_CONFIDENCE_THRESHOLD, "Confidence too low");
        require(zkProofHash != bytes32(0), "Invalid ZK proof hash");

        // Verify ZK proof (simplified - in production would use actual verification)
        require(verifyZKProof(zkProofHash, zkProof), "ZK proof verification failed");

        bytes32 decisionId = keccak256(abi.encodePacked(msg.sender, action, block.timestamp));
        
        decisions[decisionId] = Decision({
            id: decisionId,
            agentAddress: msg.sender,
            action: action,
            rationale: rationale,
            confidence: confidence,
            zkProofHash: zkProofHash,
            timestamp: block.timestamp,
            executed: false
        });

        decisionIds.push(decisionId);
        verifiedZKProofs[zkProofHash] = true;

        emit DecisionMade(decisionId, msg.sender, action, confidence);
        emit ZKProofVerified(zkProofHash, decisionId);

        return decisionId;
    }

    /**
     * @dev Execute a verified decision
     */
    function executeDecision(bytes32 decisionId) external onlyRole(SUPERVISOR_ROLE) nonReentrant {
        Decision storage decision = decisions[decisionId];
        require(decision.id != bytes32(0), "Decision not found");
        require(!decision.executed, "Decision already executed");
        require(verifiedZKProofs[decision.zkProofHash], "ZK proof not verified");

        // Execute the decision logic (simplified)
        bool success = _executeDecisionLogic(decision);
        
        decision.executed = true;
        
        // Update agent performance based on execution success
        _updateAgentPerformance(decision.agentAddress, success);

        emit DecisionExecuted(decisionId, success);
    }

    /**
     * @dev Emergency pause triggered by risk threshold
     */
    function emergencyPause(string memory reason) external onlyRole(SUPERVISOR_ROLE) {
        _pause();
        emit EmergencyPause(msg.sender, reason);
    }

    /**
     * @dev Unpause the system
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Suspend an agent for poor performance or malicious behavior
     */
    function suspendAgent(bytes32 agentId, string memory reason) external onlyRole(SUPERVISOR_ROLE) {
        require(agents[agentId].agentAddress != address(0), "Agent not found");
        
        agents[agentId].isActive = false;
        _revokeRole(AGENT_ROLE, agents[agentId].agentAddress);
        
        emit AgentSuspended(agentId, reason);
    }

    /**
     * @dev Update treasury information
     */
    function updateTreasury(
        address daoAddress,
        uint256 totalValue,
        address[] memory tokens,
        uint256[] memory balances,
        uint256 riskScore
    ) external onlyRole(AGENT_ROLE) {
        require(tokens.length == balances.length, "Array length mismatch");
        
        Treasury storage treasury = treasuries[daoAddress];
        treasury.totalValue = totalValue;
        treasury.riskScore = riskScore;
        treasury.lastRebalance = block.timestamp;

        for (uint256 i = 0; i < tokens.length; i++) {
            treasury.tokenBalances[tokens[i]] = balances[i];
        }

        emit TreasuryRebalanced(daoAddress, totalValue, riskScore);
    }

    /**
     * @dev Verify ZK proof (simplified implementation)
     */
    function verifyZKProof(bytes32 proofHash, bytes memory proof) public pure returns (bool) {
        // Simplified verification - in production would use snarkjs verification
        return proof.length > 0 && proofHash != bytes32(0);
    }

    /**
     * @dev Internal function to execute decision logic
     */
    function _executeDecisionLogic(Decision memory decision) internal returns (bool) {
        // Simplified execution logic - in production would have complex treasury operations
        // This would interact with DeFi protocols, cross-chain bridges, etc.
        return true; // Mock success
    }

    /**
     * @dev Update agent performance score
     */
    function _updateAgentPerformance(address agentAddress, bool success) internal {
        // Find agent by address and update performance
        for (uint256 i = 0; i < agentIds.length; i++) {
            Agent storage agent = agents[agentIds[i]];
            if (agent.agentAddress == agentAddress) {
                if (success) {
                    agent.performanceScore = agent.performanceScore < 100 ? agent.performanceScore + 1 : 100;
                } else {
                    agent.performanceScore = agent.performanceScore > 0 ? agent.performanceScore - 5 : 0;
                }
                break;
            }
        }
    }

    // View functions
    function getAgent(bytes32 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }

    function getDecision(bytes32 decisionId) external view returns (Decision memory) {
        return decisions[decisionId];
    }

    function getAgentCount() external view returns (uint256) {
        return agentIds.length;
    }

    function getDecisionCount() external view returns (uint256) {
        return decisionIds.length;
    }

    function getTreasuryBalance(address daoAddress, address token) external view returns (uint256) {
        return treasuries[daoAddress].tokenBalances[token];
    }
}
