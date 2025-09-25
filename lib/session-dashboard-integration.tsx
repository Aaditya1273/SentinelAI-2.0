// Example integration of session management with your existing dashboard
// This shows how to modify your dashboard to use the SQLite database

import { useEffect, useState } from 'react';
import { useSession, useSessionApi } from '@/hooks/useSession';

// Example: Updated Dashboard Component with Session Management
export function SessionAwareDashboard() {
  const { sessionId, isLoading: sessionLoading } = useSession();
  const { apiCall, postData } = useSessionApi();
  
  const [treasuryData, setTreasuryData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database when session is ready
  useEffect(() => {
    if (!sessionId) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data in parallel
        const [treasuryResponse, agentsResponse, decisionsResponse] = await Promise.all([
          apiCall('/api/treasury'),
          apiCall('/api/agents'),
          apiCall('/api/decisions?limit=10')
        ]);

        if (treasuryResponse.success) {
          setTreasuryData(treasuryResponse.data);
        }
        
        if (agentsResponse.success) {
          setAgents(agentsResponse.data);
        }
        
        if (decisionsResponse.success) {
          setDecisions(decisionsResponse.data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId, apiCall]);

  // Save treasury data to database
  const saveTreasuryData = async (newData: any) => {
    try {
      await postData('/api/treasury', { treasuryData: newData });
      setTreasuryData(newData);
    } catch (error) {
      console.error('Failed to save treasury data:', error);
    }
  };

  // Add new decision to database
  const addDecision = async (decision: any) => {
    try {
      await postData('/api/decisions', { decision });
      setDecisions(prev => [decision, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Failed to save decision:', error);
    }
  };

  if (sessionLoading || isLoading) {
    return <div>Loading your personalized dashboard...</div>;
  }

  if (!sessionId) {
    return <div>Please connect your wallet to continue...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Your Personal SentinelAI Dashboard</h1>
      <p>Session ID: {sessionId}</p>
      
      {/* Your existing dashboard components here */}
      {treasuryData && (
        <div>
          <h2>Treasury Data</h2>
          <pre>{JSON.stringify(treasuryData, null, 2)}</pre>
        </div>
      )}
      
      {agents.length > 0 && (
        <div>
          <h2>Your AI Agents</h2>
          {agents.map((agent: any) => (
            <div key={agent.id}>
              {agent.name} - {agent.status}
            </div>
          ))}
        </div>
      )}
      
      {decisions.length > 0 && (
        <div>
          <h2>Recent Decisions</h2>
          {decisions.map((decision: any) => (
            <div key={decision.id}>
              {decision.type}: {decision.action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example: How to modify your existing RealDataDashboard
export function updateExistingDashboard() {
  /*
  In your existing app/dashboard/page.tsx, replace the useState calls with session-aware versions:

  // OLD CODE:
  const [treasuryData, setTreasuryData] = useState(null)
  const [agents, setAgents] = useState([])
  const [decisions, setDecisions] = useState([])

  // NEW CODE:
  const { sessionId } = useSession();
  const { apiCall, postData } = useSessionApi();
  const [treasuryData, setTreasuryData] = useState(null)
  const [agents, setAgents] = useState([])
  const [decisions, setDecisions] = useState([])

  // Load data from database instead of generating mock data
  useEffect(() => {
    if (!sessionId) return;
    
    const loadSessionData = async () => {
      const treasuryResponse = await apiCall('/api/treasury');
      if (treasuryResponse.success) {
        setTreasuryData(treasuryResponse.data);
      }
      
      const agentsResponse = await apiCall('/api/agents');
      if (agentsResponse.success) {
        setAgents(agentsResponse.data);
      }
    };
    
    loadSessionData();
  }, [sessionId]);

  // When updating data, save to database
  const updateTreasuryData = async (newData) => {
    await postData('/api/treasury', { treasuryData: newData });
    setTreasuryData(newData);
  };
  */
}

// Example: Session-aware agent simulator
export function SessionAwareAgentSimulator() {
  const { sessionId } = useSession();
  const { postData } = useSessionApi();

  const generateAndSaveDecision = async () => {
    const decisions = [
      { type: 'rebalance', action: 'Moved 50 ETH to high-yield farming', confidence: 94, impact: 'positive' },
      { type: 'risk', action: 'Detected volatility spike, reduced exposure by 15%', confidence: 87, impact: 'protective' },
      { type: 'yield', action: 'Optimized DeFi positions, +2.3% APY', confidence: 91, impact: 'positive' },
    ];
    
    const decision = {
      ...decisions[Math.floor(Math.random() * decisions.length)],
      timestamp: new Date().toISOString(),
      agentId: 'trader'
    };

    // Save to database instead of just updating local state
    try {
      await postData('/api/decisions', { decision });
      return decision;
    } catch (error) {
      console.error('Failed to save decision:', error);
      return null;
    }
  };

  return { generateAndSaveDecision };
}
