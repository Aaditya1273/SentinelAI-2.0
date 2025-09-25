// REAL Market Data API - Server-side CoinGecko Integration
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('[Market API] 🌐 Fetching REAL market data from CoinGecko...')
    
    // Server-side API calls avoid CORS issues
    const [pricesResponse, globalResponse] = await Promise.all([
      // Get real cryptocurrency prices
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,uniswap,aave,compound-governance-token,chainlink,polygon&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_24hr_vol=true', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SentinelAI/4.0'
        }
      }),
      
      // Get global market data
      fetch('https://api.coingecko.com/api/v3/global', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SentinelAI/4.0'
        }
      })
    ])

    if (!pricesResponse.ok || !globalResponse.ok) {
      throw new Error(`API Error: ${pricesResponse.status} / ${globalResponse.status}`)
    }

    const pricesData = await pricesResponse.json()
    const globalData = await globalResponse.json()

    // Format real market data
    const realMarketData = {
      prices: {
        ETH: pricesData.ethereum?.usd || 0,
        BTC: pricesData.bitcoin?.usd || 0,
        UNI: pricesData.uniswap?.usd || 0,
        AAVE: pricesData.aave?.usd || 0,
        COMP: pricesData['compound-governance-token']?.usd || 0,
        LINK: pricesData.chainlink?.usd || 0,
        MATIC: pricesData.polygon?.usd || 0,
      },
      marketCaps: {
        ETH: pricesData.ethereum?.usd_market_cap || 0,
        BTC: pricesData.bitcoin?.usd_market_cap || 0,
        UNI: pricesData.uniswap?.usd_market_cap || 0,
        AAVE: pricesData.aave?.usd_market_cap || 0,
        COMP: pricesData['compound-governance-token']?.usd_market_cap || 0,
      },
      changes: {
        ETH: pricesData.ethereum?.usd_24h_change || 0,
        BTC: pricesData.bitcoin?.usd_24h_change || 0,
        UNI: pricesData.uniswap?.usd_24h_change || 0,
        AAVE: pricesData.aave?.usd_24h_change || 0,
        COMP: pricesData['compound-governance-token']?.usd_24h_change || 0,
      },
      volume24h: {
        ETH: pricesData.ethereum?.usd_24h_vol || 0,
        BTC: pricesData.bitcoin?.usd_24h_vol || 0,
        UNI: pricesData.uniswap?.usd_24h_vol || 0,
        AAVE: pricesData.aave?.usd_24h_vol || 0,
        COMP: pricesData['compound-governance-token']?.usd_24h_vol || 0,
      },
      global: {
        totalMarketCap: globalData.data?.total_market_cap?.usd || 0,
        marketCapChange: globalData.data?.market_cap_change_percentage_24h_usd || 0,
        bitcoinDominance: globalData.data?.market_cap_percentage?.btc || 0,
        ethereumDominance: globalData.data?.market_cap_percentage?.eth || 0,
        activeCoins: globalData.data?.active_cryptocurrencies || 0,
      }
    }

    console.log('[Market API] ✅ REAL market data fetched successfully')
    console.log(`[Market API] ETH: $${realMarketData.prices.ETH}, BTC: $${realMarketData.prices.BTC}`)

    return NextResponse.json({
      success: true,
      data: realMarketData,
      timestamp: new Date().toISOString(),
      source: 'CoinGecko API'
    })

  } catch (error) {
    console.error('[Market API] ❌ Failed to fetch real market data:', error)
    
    // Return fallback data instead of failing
    return NextResponse.json({
      success: true,
      data: {
        prices: {
          ETH: 2456.78,
          BTC: 43290.12,
          UNI: 5.23,
          AAVE: 95.41,
          COMP: 58.92,
          LINK: 14.56,
          MATIC: 0.87
        },
        marketCaps: {
          ETH: 295000000000,
          BTC: 850000000000,
          UNI: 3200000000,
          AAVE: 1400000000,
          COMP: 580000000
        },
        changes: {
          ETH: 2.34,
          BTC: -1.23,
          UNI: -1.45,
          AAVE: 4.12,
          COMP: 1.87
        },
        volume24h: {
          ETH: 12000000000,
          BTC: 18000000000,
          UNI: 180000000,
          AAVE: 95000000,
          COMP: 45000000
        },
        global: {
          totalMarketCap: 1234600000000,
          marketCapChange: 2.34,
          bitcoinDominance: 42.1,
          ethereumDominance: 18.7,
          activeCoins: 8945
        }
      },
      timestamp: new Date().toISOString(),
      source: 'Fallback Data (CoinGecko API unavailable)'
    })
  }
}
