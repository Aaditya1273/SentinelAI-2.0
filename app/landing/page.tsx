"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shield, Brain, Lock, Zap, ArrowRight, CheckCircle, Sparkles, Star, TrendingUp, Users, Award, Globe, Database, Cpu, LogOut } from "lucide-react"

export default function EnhancedLandingPage() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Auto redirect to dashboard if wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
  }, [isConnected, address, router])

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const features = [
    {
      icon: Brain,
      title: "Multi-Agent AI",
      description: "Advanced AI agents for trading, compliance, and risk management",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "DAO Treasury Guardian",
      description: "Protect and optimize your DAO's treasury with AI-powered insights",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Privacy",
      description: "Privacy-first architecture with ZK proofs and quantum resistance",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Zap,
      title: "Real-time Decisions",
      description: "Sub-1s predictions and automated crisis response systems",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const stats = [
    { value: "99.9%", label: "System Uptime", icon: TrendingUp },
    { value: "<450ms", label: "Response Time", icon: Zap },
    { value: "4", label: "AI Agents Active", icon: Brain },
    { value: "$2.3M+", label: "Assets Protected", icon: Shield }
  ]

  const achievements = [
    { title: "Best DeFi Innovation", event: "ETHGlobal 2024", icon: Award },
    { title: "Privacy Tech Award", event: "ZK Summit 2024", icon: Lock },
    { title: "Top AI Project", event: "AI/Web3 Hackathon", icon: Brain },
    { title: "Community Choice", event: "DAO Awards 2024", icon: Users }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-16 h-16 border-4 border-violet-600 border-b-transparent rounded-full animate-spin mx-auto"
              style={{ animationDirection: 'reverse' }}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Initializing SentinelAI 4.0
            </h2>
            <p className="text-gray-600">Connecting to your secure dashboard...</p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-purple-600 font-medium"
            >
              Activating AI agents...
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-violet-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -100, -20],
              x: [0, 30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${60 + i * 5}%`
            }}
          />
        ))}
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 border-b border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 rounded-xl shadow-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl opacity-20 blur-sm"
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
                  SentinelAI 4.0
                </h1>
                <p className="text-sm text-gray-600 font-medium">Multi-Agent DAO Treasury Guardian</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {!isConnected ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ConnectButton />
                </motion.div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium border border-green-200">
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDisconnect}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center space-y-16 max-w-7xl mx-auto">
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 via-white to-violet-100 border border-purple-300 rounded-full shadow-lg"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">
              Introducing SentinelAI 4.0
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-5 h-5 text-purple-600" />
            </motion.div>
          </motion.div>

          {/* Enhanced Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
              >
                The Future of
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent"
              >
                AI-Powered
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
              >
                DAO Management
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
            >
              Secure, intelligent, and autonomous treasury management powered by{" "}
              <span className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                advanced AI agents
              </span>{" "}
              with zero-knowledge privacy and quantum-resistant security.
            </motion.p>
          </motion.div>

          {/* Enhanced Connect Wallet CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="space-y-8"
          >
            {!isConnected ? (
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group flex justify-center w-full max-w-2xl mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity w-full" />
                  <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white px-16 py-8 rounded-3xl font-bold text-xl shadow-2xl border-0 transition-all duration-300 flex items-center justify-center w-full">
                    <ConnectButton />
                  </div>
                </motion.div>
                <p className="text-lg text-gray-600 font-medium">
                  Connect your wallet to access the{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent font-bold">
                    SentinelAI 4.0
                  </span>{" "}
                  dashboard
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-6"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-4 text-green-600"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                    <span className="text-2xl font-bold">Wallet Connected Successfully!</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoToDashboard}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl border-0 transition-all duration-300 flex items-center gap-4 mx-auto"
                  >
                    Enter Dashboard
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Enhanced Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                  <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-purple-300 transition-all rounded-2xl p-8 text-center space-y-6 shadow-lg hover:shadow-xl">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-gray-300"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl mx-auto flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Awards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 pt-16 border-t border-gray-300"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Awards & Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 text-center space-y-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mx-auto flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.event}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}