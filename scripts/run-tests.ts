import { IntegrationTestSuite } from "../lib/testing/integration-tests"

async function runTests() {
  console.log("[v0] SentinelAI 4.0 Test Suite")
  console.log("[v0] ========================")

  const testSuite = new IntegrationTestSuite()

  try {
    const results = await testSuite.runFullTestSuite()

    console.log("\n[v0] Test Results Summary:")
    console.log(`[v0] Total Tests: ${results.totalTests}`)
    console.log(`[v0] Passed: ${results.passed}`)
    console.log(`[v0] Failed: ${results.failed}`)
    console.log(`[v0] Success Rate: ${results.successRate.toFixed(1)}%`)
    console.log(`[v0] Grade: ${results.grade}`)

    if (results.failed > 0) {
      console.log("\n[v0] Failed Tests:")
      results.results
        .filter((r: any) => r.status === "failed")
        .forEach((r: any) => {
          console.log(`[v0] - ${r.name}: ${r.error}`)
        })
    }

    console.log("\n[v0] Test suite completed!")
    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error("[v0] Test suite failed:", error)
    process.exit(1)
  }
}

runTests()
