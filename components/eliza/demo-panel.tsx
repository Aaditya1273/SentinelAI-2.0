'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Send, Bot, Users } from 'lucide-react'

interface Agent {
  id: string
  name: string
  bio: string
}

interface ElizaStatus {
  initialized: boolean
  runtime: string
  characters: number
  isReal: boolean
}

export default function ElizaDemoPanel() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [status, setStatus] = useState<ElizaStatus | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string>('oracle-agent')
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    fetchElizaStatus()
  }, [])

  const fetchElizaStatus = async () => {
    try {
      const res = await fetch('/api/eliza')
      const data = await res.json()
      
      if (data.success) {
        setStatus(data.status)
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Failed to fetch ElizaOS status:', error)
    }
  }

  const handleQuery = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/eliza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent,
          query: query,
          type: 'chat'
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setResponse(data.response)
      } else {
        setResponse(`Error: ${data.error}`)
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceQuery = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      
      setIsLoading(true)
      try {
        const res = await fetch('/api/eliza', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: transcript,
            type: 'voice'
          })
        })
        
        const data = await res.json()
        
        if (data.success) {
          setResponse(data.response)
          
          // Text-to-speech response
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(data.response)
            speechSynthesis.speak(utterance)
          }
        } else {
          setResponse(`Error: ${data.error}`)
        }
      } catch (error) {
        setResponse(`Error: ${error.message}`)
      } finally {
        setIsLoading(false)
        setIsListening(false)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const demoQueries = [
    "What's the current treasury risk level?",
    "Analyze our DeFi yield farming positions",
    "Check compliance status for recent transactions",
    "Recommend portfolio rebalancing strategy",
    "What are the current market conditions?",
    "Assess smart contract security risks"
  ]

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-purple-600" />
            <span>ElizaOS Status</span>
            {status?.isReal && <Badge className="bg-green-500">REAL ELIZAOS</Badge>}
            {!status?.isReal && <Badge variant="outline">ENHANCED DEMO</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {status.initialized ? '✅' : '❌'}
                </div>
                <div className="text-sm text-gray-600">Initialized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.characters}</div>
                <div className="text-sm text-gray-600">Agents</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{status.runtime}</div>
                <div className="text-sm text-gray-600">Runtime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">🚀</div>
                <div className="text-sm text-gray-600">Ready</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Loading status...</div>
          )}
        </CardContent>
      </Card>

      {/* Agents Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Available Agents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAgent === agent.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="font-semibold text-gray-900">{agent.name}</div>
                <div className="text-sm text-gray-600 mt-1">{agent.bio.substring(0, 100)}...</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Query Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Query ElizaOS Agents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Queries */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Quick Demo Queries:</div>
            <div className="flex flex-wrap gap-2">
              {demoQueries.map((demoQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(demoQuery)}
                  className="text-xs"
                >
                  {demoQuery}
                </Button>
              ))}
            </div>
          </div>

          {/* Query Input */}
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your SentinelAI agents about treasury management..."
              onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              className="flex-1"
            />
            <Button
              onClick={handleVoiceQuery}
              variant="outline"
              size="icon"
              disabled={isListening}
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={handleQuery} disabled={isLoading || !query.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Response */}
          {(response || isLoading) && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-gray-600">Processing with ElizaOS...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-800">{response}</div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
