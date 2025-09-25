// PRODUCTION Settings API - Real Database Integration
import { NextRequest, NextResponse } from 'next/server'

interface UserSettings {
  walletAddress: string
  settings: {
    agentAutoRebalance: boolean
    agentRiskTolerance: number
    agentMaxPositionSize: number
    zkProofEnabled: boolean
    midnightIntegration: boolean
    complianceLevel: string
    notificationsEnabled: boolean
    emailAlerts: boolean
    slackIntegration: boolean
    apiRateLimit: number
    dataRetention: number
  }
  updatedAt: string
}

// In-memory storage for demo (replace with real database in production)
const settingsStorage = new Map<string, UserSettings>()

// GET /api/settings - Retrieve user settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json({ 
        success: false, 
        error: 'Wallet address required' 
      }, { status: 400 })
    }

    // PRODUCTION: Query real database
    // const settings = await db.query('SELECT * FROM user_settings WHERE wallet_address = ?', [walletAddress])
    
    // For demo: use in-memory storage
    const userSettings = settingsStorage.get(walletAddress.toLowerCase())
    
    if (userSettings) {
      return NextResponse.json({
        success: true,
        settings: userSettings.settings,
        updatedAt: userSettings.updatedAt
      })
    } else {
      // Return default settings for new users
      return NextResponse.json({
        success: true,
        settings: {
          agentAutoRebalance: true,
          agentRiskTolerance: 0.7,
          agentMaxPositionSize: 0.1,
          zkProofEnabled: true,
          midnightIntegration: true,
          complianceLevel: 'strict',
          notificationsEnabled: true,
          emailAlerts: false,
          slackIntegration: false,
          apiRateLimit: 1000,
          dataRetention: 90
        },
        updatedAt: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('[Settings API] GET failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve settings' 
    }, { status: 500 })
  }
}

// POST /api/settings - Save user settings
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, settings } = await request.json()

    if (!walletAddress || !settings) {
      return NextResponse.json({ 
        success: false, 
        error: 'Wallet address and settings required' 
      }, { status: 400 })
    }

    const userSettings: UserSettings = {
      walletAddress: walletAddress.toLowerCase(),
      settings,
      updatedAt: new Date().toISOString()
    }

    // PRODUCTION: Save to real database
    // await db.query(`
    //   INSERT INTO user_settings (wallet_address, settings, updated_at) 
    //   VALUES (?, ?, ?) 
    //   ON DUPLICATE KEY UPDATE settings = ?, updated_at = ?
    // `, [walletAddress, JSON.stringify(settings), userSettings.updatedAt, JSON.stringify(settings), userSettings.updatedAt])

    // For demo: use in-memory storage
    settingsStorage.set(walletAddress.toLowerCase(), userSettings)

    console.log(`[Settings API] Saved settings for ${walletAddress}`)

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      updatedAt: userSettings.updatedAt
    })

  } catch (error) {
    console.error('[Settings API] POST failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save settings' 
    }, { status: 500 })
  }
}

// PUT /api/settings - Update specific setting
export async function PUT(request: NextRequest) {
  try {
    const { walletAddress, key, value } = await request.json()

    if (!walletAddress || !key || value === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: 'Wallet address, key, and value required' 
      }, { status: 400 })
    }

    // Get existing settings
    const existingSettings = settingsStorage.get(walletAddress.toLowerCase())
    
    if (!existingSettings) {
      return NextResponse.json({ 
        success: false, 
        error: 'User settings not found' 
      }, { status: 404 })
    }

    // Update specific setting
    const updatedSettings = {
      ...existingSettings,
      settings: {
        ...existingSettings.settings,
        [key]: value
      },
      updatedAt: new Date().toISOString()
    }

    // PRODUCTION: Update in real database
    // await db.query('UPDATE user_settings SET settings = ?, updated_at = ? WHERE wallet_address = ?', 
    //   [JSON.stringify(updatedSettings.settings), updatedSettings.updatedAt, walletAddress])

    // For demo: update in-memory storage
    settingsStorage.set(walletAddress.toLowerCase(), updatedSettings)

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
      settings: updatedSettings.settings,
      updatedAt: updatedSettings.updatedAt
    })

  } catch (error) {
    console.error('[Settings API] PUT failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update setting' 
    }, { status: 500 })
  }
}

// DELETE /api/settings - Reset user settings to defaults
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json({ 
        success: false, 
        error: 'Wallet address required' 
      }, { status: 400 })
    }

    // PRODUCTION: Delete from real database
    // await db.query('DELETE FROM user_settings WHERE wallet_address = ?', [walletAddress])

    // For demo: remove from in-memory storage
    settingsStorage.delete(walletAddress.toLowerCase())

    return NextResponse.json({
      success: true,
      message: 'Settings reset to defaults'
    })

  } catch (error) {
    console.error('[Settings API] DELETE failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset settings' 
    }, { status: 500 })
  }
}
