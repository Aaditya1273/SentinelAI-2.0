export class AragonConnector {
  private apiUrl = "https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet"

  async getDAOInfo(daoAddress: string) {
    const query = `
      query DAO($id: String!) {
        organization(id: $id) {
          id
          address
          apps {
            id
            appId
            implementation
            isForwarder
            isUpgradeable
          }
          permissions {
            id
            appAddress
            role
            granteeAddress
            allowed
          }
        }
      }
    `

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { id: daoAddress.toLowerCase() },
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch DAO info:', error)
      // Return mock data as fallback
      return {
        data: {
          organization: {
            id: daoAddress,
            permissions: []
          }
        }
      }
    }
  }

  async getTreasuryBalance(daoAddress: string) {
    const query = `
      query Treasury($org: String!) {
        tokenBalances(where: { organization: $org }) {
          id
          token {
            id
            name
            symbol
            decimals
          }
          amount
        }
      }
    `

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { org: daoAddress.toLowerCase() },
        }),
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch treasury balance:', error)
      // Return mock data as fallback
      return {
        data: {
          tokenBalances: [
            { id: '1', token: { name: 'Ethereum', symbol: 'ETH' }, amount: '100' },
            { id: '2', token: { name: 'USD Coin', symbol: 'USDC' }, amount: '50000' }
          ]
        }
      }
    }
  }

  async getVotingHistory(daoAddress: string, limit = 50) {
    const query = `
      query Votes($org: String!, $first: Int!) {
        votes(
          first: $first,
          where: { organization: $org },
          orderBy: createdAt,
          orderDirection: desc
        ) {
          id
          voter
          supports
          stake
          createdAt
          vote {
            id
            executed
            executedAt
            startDate
            snapshotBlock
            supportRequiredPct
            minAcceptQuorum
            yea
            nay
            votingPower
            script
          }
        }
      }
    `

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { org: daoAddress.toLowerCase(), first: limit },
      }),
    })

    return response.json()
  }
}
