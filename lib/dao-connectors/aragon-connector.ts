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

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { id: daoAddress.toLowerCase() },
      }),
    })

    return response.json()
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

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { org: daoAddress.toLowerCase() },
      }),
    })

    return response.json()
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
