import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_ALCHEMY_ID = 'test-alchemy-id'
process.env.NEXT_PUBLIC_INFURA_ID = 'test-infura-id'
process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = 'test-wallet-connect-id'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.MCP_SERVER_URL = 'ws://localhost:8080'

// Mock Web APIs that might not be available in test environment
global.fetch = jest.fn()
global.WebSocket = jest.fn()

// Mock speech recognition
global.webkitSpeechRecognition = jest.fn(() => ({
  continuous: true,
  interimResults: true,
  lang: 'en-US',
  onresult: null,
  start: jest.fn(),
  stop: jest.fn(),
}))

// Mock crypto for random generation
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
  },
})

// Increase timeout for async operations
jest.setTimeout(30000)
