// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title USDM Token - SentinelAI 4.0 Tokenized Agent Economy
 * @dev ERC20 token for agent hiring, staking, and governance
 */
contract USDMToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    // Tokenomics parameters
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    
    // Staking and rewards
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public stakingRewards;
    mapping(address => uint256) public lastStakeTime;
    
    // Agent marketplace
    mapping(bytes32 => AgentListing) public agentListings;
    mapping(address => bytes32[]) public userAgents;
    
    struct AgentListing {
        address owner;
        string agentType;
        uint256 hourlyRate;
        uint256 stakingRequirement;
        uint256 performanceScore;
        bool isActive;
        uint256 totalEarnings;
        uint256 hiredCount;
    }
    
    // Governance
    mapping(address => uint256) public votingPower;
    mapping(bytes32 => Proposal) public proposals;
    mapping(bytes32 => mapping(address => bool)) public hasVoted;
    
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 deadline;
        bool executed;
        address proposer;
    }
    
    // Events
    event AgentListed(bytes32 indexed agentId, address indexed owner, string agentType, uint256 hourlyRate);
    event AgentHired(bytes32 indexed agentId, address indexed hirer, uint256 duration, uint256 cost);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsDistributed(address indexed agent, uint256 amount);
    event ProposalCreated(bytes32 indexed proposalId, address indexed proposer, string description);
    event VoteCast(bytes32 indexed proposalId, address indexed voter, bool support, uint256 weight);

    constructor() ERC20("USDM Token", "USDM") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        // Mint initial supply
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Mint new tokens (only by minter role)
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Pause token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Stake tokens for rewards and voting power
     */
    function stakeTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update staking records
        stakedBalances[msg.sender] += amount;
        lastStakeTime[msg.sender] = block.timestamp;
        votingPower[msg.sender] += amount;
        
        emit TokensStaked(msg.sender, amount);
    }

    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstakeTokens(uint256 amount) external nonReentrant {
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");
        
        // Calculate rewards (5% APY)
        uint256 stakingDuration = block.timestamp - lastStakeTime[msg.sender];
        uint256 rewards = (amount * 5 * stakingDuration) / (100 * 365 days);
        
        // Update records
        stakedBalances[msg.sender] -= amount;
        stakingRewards[msg.sender] += rewards;
        votingPower[msg.sender] -= amount;
        
        // Transfer tokens back
        _transfer(address(this), msg.sender, amount);
        
        // Mint rewards if within max supply
        if (totalSupply() + rewards <= MAX_SUPPLY) {
            _mint(msg.sender, rewards);
        }
        
        emit TokensUnstaked(msg.sender, amount, rewards);
    }

    /**
     * @dev List an agent in the marketplace
     */
    function listAgent(
        string memory agentType,
        uint256 hourlyRate,
        uint256 stakingRequirement
    ) external returns (bytes32) {
        require(hourlyRate > 0, "Hourly rate must be positive");
        require(stakingRequirement >= 1000 * 10**18, "Minimum staking requirement is 1000 USDM");
        require(stakedBalances[msg.sender] >= stakingRequirement, "Insufficient staked tokens");
        
        bytes32 agentId = keccak256(abi.encodePacked(msg.sender, agentType, block.timestamp));
        
        agentListings[agentId] = AgentListing({
            owner: msg.sender,
            agentType: agentType,
            hourlyRate: hourlyRate,
            stakingRequirement: stakingRequirement,
            performanceScore: 100, // Start with perfect score
            isActive: true,
            totalEarnings: 0,
            hiredCount: 0
        });
        
        userAgents[msg.sender].push(agentId);
        _grantRole(AGENT_ROLE, msg.sender);
        
        emit AgentListed(agentId, msg.sender, agentType, hourlyRate);
        return agentId;
    }

    /**
     * @dev Hire an agent for a specific duration
     */
    function hireAgent(bytes32 agentId, uint256 durationHours) external nonReentrant {
        AgentListing storage agent = agentListings[agentId];
        require(agent.isActive, "Agent not active");
        require(agent.owner != msg.sender, "Cannot hire your own agent");
        
        uint256 totalCost = agent.hourlyRate * durationHours;
        require(balanceOf(msg.sender) >= totalCost, "Insufficient balance");
        
        // Transfer payment
        _transfer(msg.sender, agent.owner, totalCost);
        
        // Update agent stats
        agent.totalEarnings += totalCost;
        agent.hiredCount += 1;
        
        // Distribute rewards to stakers (10% of payment)
        uint256 stakingReward = totalCost / 10;
        _distributeStakingRewards(stakingReward);
        
        emit AgentHired(agentId, msg.sender, durationHours, totalCost);
    }

    /**
     * @dev Update agent performance score (only by supervisor)
     */
    function updateAgentPerformance(bytes32 agentId, uint256 newScore) external onlyRole(AGENT_ROLE) {
        require(newScore <= 100, "Score cannot exceed 100");
        agentListings[agentId].performanceScore = newScore;
        
        // Suspend agent if performance is too low
        if (newScore < 50) {
            agentListings[agentId].isActive = false;
        }
    }

    /**
     * @dev Create a governance proposal
     */
    function createProposal(string memory description, uint256 votingDuration) external returns (bytes32) {
        require(votingPower[msg.sender] >= 10000 * 10**18, "Insufficient voting power to propose");
        
        bytes32 proposalId = keccak256(abi.encodePacked(description, msg.sender, block.timestamp));
        
        proposals[proposalId] = Proposal({
            description: description,
            forVotes: 0,
            againstVotes: 0,
            deadline: block.timestamp + votingDuration,
            executed: false,
            proposer: msg.sender
        });
        
        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }

    /**
     * @dev Vote on a proposal
     */
    function vote(bytes32 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        uint256 weight = votingPower[msg.sender];
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        hasVoted[proposalId][msg.sender] = true;
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /**
     * @dev Distribute staking rewards proportionally
     */
    function _distributeStakingRewards(uint256 totalReward) internal {
        uint256 totalStaked = balanceOf(address(this));
        if (totalStaked == 0) return;
        
        // In a real implementation, you would iterate through all stakers
        // For simplicity, we'll mint the rewards to the contract for later distribution
        if (totalSupply() + totalReward <= MAX_SUPPLY) {
            _mint(address(this), totalReward);
        }
    }

    /**
     * @dev Get agent listing details
     */
    function getAgent(bytes32 agentId) external view returns (AgentListing memory) {
        return agentListings[agentId];
    }

    /**
     * @dev Get user's agents
     */
    function getUserAgents(address user) external view returns (bytes32[] memory) {
        return userAgents[user];
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(bytes32 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    /**
     * @dev Get staking info for user
     */
    function getStakingInfo(address user) external view returns (
        uint256 staked,
        uint256 rewards,
        uint256 voting,
        uint256 lastStake
    ) {
        return (
            stakedBalances[user],
            stakingRewards[user],
            votingPower[user],
            lastStakeTime[user]
        );
    }

    // Override required by Solidity
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
}
