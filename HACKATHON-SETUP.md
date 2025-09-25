# 🚀 SentinelAI 4.0 - Hackathon Multi-Browser Setup

## 🎯 Problem Solved

**BEFORE:** Multiple browser tabs shared the same state - if you went to dashboard in one browser, all other browsers would redirect to dashboard too.

**AFTER:** Each browser tab/window now has completely independent sessions with their own data stored in SQLite database.

## 🔧 Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
npm install better-sqlite3 @types/better-sqlite3
```

### 2. Initialize Database
```bash
node scripts/setup-hackathon-db.js
npm run db:init
```

### 3. Start Demo
```bash
npm run dev
```

## 🎮 How It Works

### Session Management
- Each browser tab gets a unique `sessionId` stored in `sessionStorage`
- `sessionStorage` is tab-specific (unlike `localStorage` which is shared)
- When you connect a wallet, a new session is created in SQLite database
- All data (treasury, agents, decisions, analytics) is tied to that session

### Database Structure
```sql
-- Each user session
users (id, address, session_id, created_at, last_active, is_connected)

-- Independent data per session
treasury_data (session_id, total_value, eth_price, tokens, ...)
agents (session_id, agent_id, name, status, performance, ...)
decisions (session_id, agent_id, timestamp, type, action, ...)
analytics (session_id, portfolio_return, risk_score, ...)
```

## 🎪 Demo Flow

1. **Open Browser Tab 1**
   - Connect Wallet A
   - Gets sessionId: `abc123...`
   - See default treasury: $2.3M
   - 4 AI agents active

2. **Open Browser Tab 2** 
   - Connect Wallet B (or same wallet)
   - Gets sessionId: `def456...` (different!)
   - See fresh default treasury: $2.3M
   - 4 fresh AI agents

3. **Make Changes in Tab 1**
   - Treasury updates, agent decisions
   - Data saved to database with sessionId `abc123`

4. **Check Tab 2**
   - Completely unchanged!
   - Has its own independent data
   - No shared state between tabs

## 🔨 Integration with Existing Code

### Before (Shared State)
```tsx
// Old dashboard code
const [treasuryData, setTreasuryData] = useState(null)
const [agents, setAgents] = useState([])

// Data was generated locally and shared via localStorage
```

### After (Session-Aware)
```tsx
// New session-aware code
import { useSession, useSessionApi } from '@/hooks/useSession'

const { sessionId } = useSession()
const { apiCall, postData } = useSessionApi()
const [treasuryData, setTreasuryData] = useState(null)

// Load data from database per session
useEffect(() => {
  if (!sessionId) return
  
  const loadData = async () => {
    const response = await apiCall('/api/treasury')
    if (response.success) {
      setTreasuryData(response.data)
    }
  }
  loadData()
}, [sessionId])

// Save data to database per session
const updateTreasury = async (newData) => {
  await postData('/api/treasury', { treasuryData: newData })
  setTreasuryData(newData)
}
```

## 📁 Files Created

### Core Database
- `lib/database.ts` - SQLite database with session management
- `hooks/useSession.ts` - React hooks for session management

### API Routes
- `app/api/session/route.ts` - Create/validate sessions
- `app/api/treasury/route.ts` - Treasury data per session
- `app/api/agents/route.ts` - AI agents per session
- `app/api/decisions/route.ts` - Decision history per session
- `app/api/analytics/route.ts` - Analytics per session

### Setup & Examples
- `scripts/setup-hackathon-db.js` - Automated setup script
- `lib/session-dashboard-integration.tsx` - Integration examples

## 🎯 Key Benefits for Hackathon

1. **Perfect for Demos**: Show multiple users simultaneously
2. **No Conflicts**: Each browser session is completely independent
3. **Realistic**: Simulates real multi-user environment
4. **Easy Setup**: One command to get everything working
5. **Persistent**: Data survives page refreshes (per session)
6. **Clean**: Automatic cleanup of old sessions

## 🚨 Important Notes

- **sessionStorage**: Used instead of localStorage for tab isolation
- **SQLite**: Perfect for hackathon - no external database needed
- **Session Cleanup**: Old sessions auto-deleted after 24 hours
- **Fresh Data**: Each new session gets default SentinelAI data
- **Independent**: No shared state between any browser tabs

## 🎪 Perfect Hackathon Demo Script

1. **"Let me show you multi-user capability"**
2. **Open 3 browser tabs**
3. **Connect different wallets in each**
4. **Show each has independent:**
   - Treasury portfolios
   - AI agent performance  
   - Decision histories
   - Analytics dashboards
5. **Make changes in one tab**
6. **Show others are unaffected**
7. **"This is how SentinelAI scales to multiple DAOs!"**

## 🔧 Troubleshooting

### If sessions are still shared:
- Clear all browser storage
- Restart dev server
- Check sessionStorage (not localStorage) is being used

### If database errors:
```bash
npm run db:reset  # Reset database
npm run db:init   # Reinitialize
```

### If TypeScript errors:
```bash
npm install @types/better-sqlite3
```

## 🎉 You're Ready!

Your SentinelAI 4.0 now supports true multi-browser sessions perfect for hackathon demos. Each browser tab is like a different DAO with independent AI agents, treasury, and decision-making!

**Demo Command:**
```bash
npm run hackathon:demo
```

**Then open multiple browser tabs and watch the magic! 🪄**
