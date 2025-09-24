export class SnapshotConnector {
  private apiUrl = "https://hub.snapshot.org/graphql"

  async getProposals(space: string, limit = 20) {
    const query = `
      query Proposals($space: String!, $first: Int!) {
        proposals(
          first: $first,
          where: { space: $space },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          scores
          scores_total
          votes
        }
      }
    `

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { space, first: limit },
      }),
    })

    return response.json()
  }

  async getVotes(proposalId: string) {
    const query = `
      query Votes($proposal: String!) {
        votes(
          where: { proposal: $proposal },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          voter
          choice
          vp
          created
        }
      }
    `

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { proposal: proposalId },
      }),
    })

    return response.json()
  }

  async analyzeProposalSentiment(proposalId: string) {
    const votes = await this.getVotes(proposalId)
    const totalVotes = votes.data.votes.length
    const positiveVotes = votes.data.votes.filter((vote: any) => vote.choice === 1).length

    return {
      sentiment: positiveVotes / totalVotes,
      confidence: Math.min(totalVotes / 100, 1),
      totalVotes,
      positiveVotes,
    }
  }
}
