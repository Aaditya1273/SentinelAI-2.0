#!/usr/bin/env node

/**
 * SentinelAI 4.0 Hackathon Database Setup Script
 * 
 * This script sets up the SQLite database for hackathon demo
 * Each browser session will have independent data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SentinelAI 4.0 Hackathon Database...\n');

// Step 1: Install dependencies
console.log('📦 Installing SQLite dependencies...');
try {
  execSync('npm install better-sqlite3 @types/better-sqlite3', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 2: Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('📁 Created database directory\n');
}

// Step 3: Test database connection
console.log('🔧 Testing database connection...');
try {
  const Database = require('better-sqlite3');
  const testDb = new Database(':memory:');
  
  // Test basic operations
  testDb.exec(`
    CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);
    INSERT INTO test (name) VALUES ('SentinelAI 4.0');
  `);
  
  const result = testDb.prepare('SELECT * FROM test').get();
  testDb.close();
  
  if (result && result.name === 'SentinelAI 4.0') {
    console.log('✅ Database connection test passed\n');
  } else {
    throw new Error('Database test failed');
  }
} catch (error) {
  console.error('❌ Database test failed:', error.message);
  process.exit(1);
}

// Step 4: Create environment file if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# SentinelAI 4.0 Hackathon Configuration
DATABASE_PATH=./sentinelai_hackathon.db
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=SentinelAI 4.0
NEXT_PUBLIC_SESSION_STORAGE=true
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('📝 Created .env.local file\n');
}

// Step 5: Create database initialization script
const initDbScript = `
// Auto-generated database initialization
const { getDatabase } = require('./lib/database');

async function initializeDatabase() {
  console.log('Initializing SentinelAI 4.0 database...');
  
  try {
    const db = getDatabase();
    console.log('✅ Database initialized successfully');
    console.log('📊 Database location: sentinelai_hackathon.db');
    
    // Test with a sample session
    const { user, sessionId } = db.createUser('0x1234567890123456789012345678901234567890');
    db.initializeDefaultData(sessionId);
    
    console.log('✅ Sample session created:', sessionId);
    console.log('🎯 Ready for hackathon demo!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
`;

fs.writeFileSync(path.join(process.cwd(), 'init-db.js'), initDbScript);
console.log('📝 Created database initialization script\n');

// Step 6: Add npm scripts
console.log('📝 Adding npm scripts...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add hackathon-specific scripts
packageJson.scripts = {
  ...packageJson.scripts,
  'db:init': 'node init-db.js',
  'db:reset': 'rm -f sentinelai_hackathon.db && node init-db.js',
  'hackathon:setup': 'node scripts/setup-hackathon-db.js',
  'hackathon:demo': 'npm run db:init && npm run dev'
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Added npm scripts to package.json\n');

// Step 7: Create README for hackathon
const hackathonReadme = `# SentinelAI 4.0 - Hackathon Setup

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Initialize database:**
   \`\`\`bash
   npm run db:init
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🎯 Hackathon Features

### Multi-Browser Session Management
- Each browser tab gets its own independent session
- No shared state between different browser instances
- Perfect for demo with multiple users

### SQLite Database
- Local SQLite database for hackathon demo
- Independent user sessions with unique data
- Automatic cleanup of old sessions

### Session-Aware Components
- Treasury data per session
- AI agents per session  
- Decision history per session
- Analytics per session

## 🔧 Commands

- \`npm run hackathon:demo\` - Initialize DB and start dev server
- \`npm run db:reset\` - Reset database and create fresh data
- \`npm run db:init\` - Initialize database with sample data

## 🎮 Demo Flow

1. Open multiple browser tabs/windows
2. Connect different wallets in each tab
3. Each tab will have independent:
   - Treasury data
   - AI agent performance
   - Decision history
   - Analytics dashboard

## 🗄️ Database Schema

- **users** - Session management
- **treasury_data** - Portfolio data per session
- **agents** - AI agent data per session
- **decisions** - Decision history per session
- **analytics** - Performance metrics per session

## 🔍 Debugging

- Database file: \`sentinelai_hackathon.db\`
- Session storage: Browser sessionStorage
- Logs: Check browser console and server logs

Perfect for hackathon demos where you need to show multiple independent users!
`;

fs.writeFileSync(path.join(process.cwd(), 'HACKATHON.md'), hackathonReadme);
console.log('📚 Created HACKATHON.md guide\n');

console.log('🎉 SentinelAI 4.0 Hackathon Database Setup Complete!\n');
console.log('📋 Next steps:');
console.log('   1. Run: npm run db:init');
console.log('   2. Run: npm run dev');
console.log('   3. Open multiple browser tabs for demo');
console.log('   4. Each tab will have independent data!\n');
console.log('📖 Read HACKATHON.md for detailed instructions');
console.log('🚀 Ready for your hackathon demo!');
