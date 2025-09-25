// PRODUCTION DATABASE - Real Data Storage for SentinelAI 4.0
import Database from 'better-sqlite3';
import { randomBytes } from 'crypto';
import path from 'path';

// Production database interfaces
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  session_id: string;
  created_at: string;
  last_active: string;
  is_connected: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  api_calls_used: number;
  api_calls_limit: number;
}

export interface TreasuryData {
  id: string;
  session_id: string;
  total_value: number;
  eth_price: number;
  btc_price: number;
  tokens: string; // JSON string
  defi_positions: string; // JSON string
  last_updated: string;
}

export interface AgentData {
  id: string;
  session_id: string;
  agent_id: string;
  name: string;
  status: string;
  performance: number;
  last_action: string;
  decisions: number;
  uptime: string;
  created_at: string;
}

export interface DecisionData {
  id: string;
  session_id: string;
  agent_id: string;
  timestamp: string;
  type: string;
  action: string;
  confidence: number;
  impact: string;
}

export interface AnalyticsData {
  id: string;
  session_id: string;
  portfolio_return: number;
  risk_score: number;
  efficiency: number;
  sharpe_ratio: number;
  max_drawdown: number;
  volatility: number;
  total_value: number;
  daily_change: number;
  weekly_change: number;
  monthly_change: number;
  last_updated: string;
}

class SentinelAIDatabase {
  private db: Database.Database;

  constructor() {
    // Create database in project root for hackathon
    const dbPath = path.join(process.cwd(), 'sentinelai_hackathon.db');
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  private initializeTables() {
    // Users table with session management
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        session_id TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_active TEXT DEFAULT CURRENT_TIMESTAMP,
        is_connected BOOLEAN DEFAULT true
      )
    `);

    // Treasury data per session
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS treasury_data (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        total_value REAL NOT NULL,
        eth_price REAL NOT NULL,
        btc_price REAL NOT NULL,
        tokens TEXT NOT NULL,
        defi_positions TEXT NOT NULL,
        last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `);

    // Agents per session
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        performance REAL NOT NULL,
        last_action TEXT NOT NULL,
        decisions INTEGER NOT NULL,
        uptime TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `);

    // Decisions per session
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        type TEXT NOT NULL,
        action TEXT NOT NULL,
        confidence REAL NOT NULL,
        impact TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `);

    // Analytics per session
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        portfolio_return REAL NOT NULL,
        risk_score REAL NOT NULL,
        efficiency REAL NOT NULL,
        sharpe_ratio REAL NOT NULL,
        max_drawdown REAL NOT NULL,
        volatility REAL NOT NULL,
        total_value REAL NOT NULL,
        daily_change REAL NOT NULL,
        weekly_change REAL NOT NULL,
        monthly_change REAL NOT NULL,
        last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_session ON users (session_id);
      CREATE INDEX IF NOT EXISTS idx_treasury_session ON treasury_data (session_id);
      CREATE INDEX IF NOT EXISTS idx_agents_session ON agents (session_id);
      CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions (session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics (session_id);
    `);
  }

  // Generate unique session ID
  generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  // User management
  createUser(address: string): { user: User; sessionId: string } {
    const sessionId = this.generateSessionId();
    const userId = randomBytes(16).toString('hex');
    
    const stmt = this.db.prepare(`
      INSERT INTO users (id, address, session_id)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(userId, address, sessionId);
    
    const user = this.getUser(sessionId);
    return { user: user!, sessionId };
  }

  getUser(sessionId: string): User | null {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE session_id = ?
    `);
    return stmt.get(sessionId) as User | null;
  }

  updateUserActivity(sessionId: string): void {
    const stmt = this.db.prepare(`
      UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE session_id = ?
    `);
    stmt.run(sessionId);
  }

  disconnectUser(sessionId: string): void {
    const stmt = this.db.prepare(`
      UPDATE users SET is_connected = false WHERE session_id = ?
    `);
    stmt.run(sessionId);
  }

  // Treasury data management
  saveTreasuryData(sessionId: string, data: Omit<TreasuryData, 'id' | 'session_id' | 'last_updated'>): void {
    const id = randomBytes(16).toString('hex');
    
    // Delete existing data for this session
    this.db.prepare('DELETE FROM treasury_data WHERE session_id = ?').run(sessionId);
    
    const stmt = this.db.prepare(`
      INSERT INTO treasury_data (id, session_id, total_value, eth_price, btc_price, tokens, defi_positions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      sessionId,
      data.total_value,
      data.eth_price,
      data.btc_price,
      data.tokens,
      data.defi_positions
    );
  }

  getTreasuryData(sessionId: string): TreasuryData | null {
    const stmt = this.db.prepare(`
      SELECT * FROM treasury_data WHERE session_id = ? ORDER BY last_updated DESC LIMIT 1
    `);
    return stmt.get(sessionId) as TreasuryData | null;
  }

  // Agent management
  saveAgent(sessionId: string, agent: Omit<AgentData, 'id' | 'session_id' | 'created_at'>): void {
    const id = randomBytes(16).toString('hex');
    
    // Update if exists, insert if not
    const existing = this.db.prepare(`
      SELECT id FROM agents WHERE session_id = ? AND agent_id = ?
    `).get(sessionId, agent.agent_id);

    if (existing) {
      const stmt = this.db.prepare(`
        UPDATE agents SET name = ?, status = ?, performance = ?, last_action = ?, decisions = ?, uptime = ?
        WHERE session_id = ? AND agent_id = ?
      `);
      stmt.run(agent.name, agent.status, agent.performance, agent.last_action, agent.decisions, agent.uptime, sessionId, agent.agent_id);
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO agents (id, session_id, agent_id, name, status, performance, last_action, decisions, uptime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, sessionId, agent.agent_id, agent.name, agent.status, agent.performance, agent.last_action, agent.decisions, agent.uptime);
    }
  }

  getAgents(sessionId: string): AgentData[] {
    const stmt = this.db.prepare(`
      SELECT * FROM agents WHERE session_id = ? ORDER BY created_at DESC
    `);
    return stmt.all(sessionId) as AgentData[];
  }

  // Decision management
  saveDecision(sessionId: string, decision: Omit<DecisionData, 'id' | 'session_id'>): void {
    const id = randomBytes(16).toString('hex');
    
    const stmt = this.db.prepare(`
      INSERT INTO decisions (id, session_id, agent_id, timestamp, type, action, confidence, impact)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      sessionId,
      decision.agent_id,
      decision.timestamp,
      decision.type,
      decision.action,
      decision.confidence,
      decision.impact
    );
  }

  getDecisions(sessionId: string, limit: number = 10): DecisionData[] {
    const stmt = this.db.prepare(`
      SELECT * FROM decisions WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?
    `);
    return stmt.all(sessionId, limit) as DecisionData[];
  }

  // Analytics management
  saveAnalytics(sessionId: string, analytics: Omit<AnalyticsData, 'id' | 'session_id' | 'last_updated'>): void {
    const id = randomBytes(16).toString('hex');
    
    // Delete existing analytics for this session
    this.db.prepare('DELETE FROM analytics WHERE session_id = ?').run(sessionId);
    
    const stmt = this.db.prepare(`
      INSERT INTO analytics (
        id, session_id, portfolio_return, risk_score, efficiency, sharpe_ratio,
        max_drawdown, volatility, total_value, daily_change, weekly_change, monthly_change
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      sessionId,
      analytics.portfolio_return,
      analytics.risk_score,
      analytics.efficiency,
      analytics.sharpe_ratio,
      analytics.max_drawdown,
      analytics.volatility,
      analytics.total_value,
      analytics.daily_change,
      analytics.weekly_change,
      analytics.monthly_change
    );
  }

  getAnalytics(sessionId: string): AnalyticsData | null {
    const stmt = this.db.prepare(`
      SELECT * FROM analytics WHERE session_id = ? ORDER BY last_updated DESC LIMIT 1
    `);
    return stmt.get(sessionId) as AnalyticsData | null;
  }

  // Initialize default data for new session
  initializeDefaultData(sessionId: string): void {
    // Initialize default treasury data
    this.saveTreasuryData(sessionId, {
      total_value: 2345678.90,
      eth_price: 2456.78,
      btc_price: 43290.12,
      tokens: JSON.stringify([
        { symbol: 'ETH', amount: 1250.5, value: 2456.78 * 1250.5, change: 2.3 },
        { symbol: 'UNI', amount: 15420, value: 5.2 * 15420, change: -1.2 },
        { symbol: 'AAVE', amount: 890, value: 95.4 * 890, change: 4.1 },
        { symbol: 'COMP', amount: 245, value: 58.9 * 245, change: 1.8 }
      ]),
      defi_positions: JSON.stringify([
        { name: 'Aave', tvl: 7200000000, change: 2.1 },
        { name: 'Compound', tvl: 3800000000, change: -0.8 }
      ])
    });

    // Initialize default agents
    const defaultAgents = [
      {
        agent_id: 'trader',
        name: 'Trader Agent',
        status: 'active',
        performance: 94.2,
        last_action: 'Portfolio rebalanced +2.3% efficiency',
        decisions: 45,
        uptime: '99.8%'
      },
      {
        agent_id: 'compliance',
        name: 'Compliance Agent',
        status: 'active',
        performance: 98.7,
        last_action: 'Verified regulatory requirements',
        decisions: 23,
        uptime: '100%'
      },
      {
        agent_id: 'risk',
        name: 'Risk Monitor',
        status: 'active',
        performance: 91.5,
        last_action: 'Market volatility analysis complete',
        decisions: 67,
        uptime: '99.9%'
      },
      {
        agent_id: 'advisor',
        name: 'Strategy Advisor',
        status: 'active',
        performance: 89.3,
        last_action: 'Recommended yield optimization',
        decisions: 34,
        uptime: '99.7%'
      }
    ];

    defaultAgents.forEach(agent => {
      this.saveAgent(sessionId, agent);
    });

    // Initialize default analytics
    this.saveAnalytics(sessionId, {
      portfolio_return: 24.7,
      risk_score: 6.2,
      efficiency: 94.3,
      sharpe_ratio: 1.85,
      max_drawdown: 8.3,
      volatility: 12.4,
      total_value: 2.8,
      daily_change: 5.2,
      weekly_change: -2.1,
      monthly_change: 12.5
    });
  }

  // Cleanup old sessions (for hackathon maintenance)
  cleanupOldSessions(hoursOld: number = 24): void {
    const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000).toISOString();
    
    // Get old session IDs
    const oldSessions = this.db.prepare(`
      SELECT session_id FROM users WHERE last_active < ?
    `).all(cutoffTime) as { session_id: string }[];

    // Delete related data
    const transaction = this.db.transaction(() => {
      for (const { session_id } of oldSessions) {
        this.db.prepare('DELETE FROM decisions WHERE session_id = ?').run(session_id);
        this.db.prepare('DELETE FROM agents WHERE session_id = ?').run(session_id);
        this.db.prepare('DELETE FROM treasury_data WHERE session_id = ?').run(session_id);
        this.db.prepare('DELETE FROM analytics WHERE session_id = ?').run(session_id);
        this.db.prepare('DELETE FROM users WHERE session_id = ?').run(session_id);
      }
    });

    transaction();
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

// Singleton instance
let dbInstance: SentinelAIDatabase | null = null;

export function getDatabase(): SentinelAIDatabase {
  if (!dbInstance) {
    dbInstance = new SentinelAIDatabase();
  }
  return dbInstance;
}

export default SentinelAIDatabase;
