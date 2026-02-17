const VERCEL_TOKEN = process.env.VERCEL_TOKEN!
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID
const VERCEL_API = "https://api.vercel.com"

function teamQuery(): string {
  return VERCEL_TEAM_ID ? `teamId=${VERCEL_TEAM_ID}` : ""
}

export async function createVercelProject({
  name,
  repoFullName,
  onDeploymentPolling,
}: {
  name: string
  repoFullName: string
  onDeploymentPolling?: () => Promise<void>
}): Promise<{ projectId: string; deploymentUrl: string }> {
  const tq = teamQuery()

  // 1. Create project linked to GitHub repo
  console.log(`[Vercel] Creating project "${name}" linked to ${repoFullName}...`)
  const createRes = await fetch(
    `${VERCEL_API}/v11/projects${tq ? `?${tq}` : ""}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        framework: "nextjs",
        gitRepository: {
          repo: repoFullName,
          type: "github",
        },
      }),
    }
  )

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Failed to create Vercel project: ${err}`)
  }

  const projectData = await createRes.json()
  console.log(`[Vercel] Project created with id: ${projectData.id}`)

  // 2. Explicitly trigger a deployment via the Vercel API.
  //    Auto-deploy only fires on NEW push events. Since we pushed code
  //    to GitHub BEFORE linking the repo to Vercel, there's no webhook
  //    event to trigger a deployment. We must create one manually.
  console.log(`[Vercel] Triggering deployment for ${repoFullName}...`)
  const [owner, repo] = repoFullName.split("/")

  const deployRes = await fetch(
    `${VERCEL_API}/v13/deployments${tq ? `?${tq}` : ""}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        project: projectData.id,
        gitSource: {
          type: "github",
          org: owner,
          repo: repo,
          ref: "main",
        },
      }),
    }
  )

  if (!deployRes.ok) {
    const err = await deployRes.text()
    console.error(`[Vercel] Failed to trigger deployment: ${err}`)
    // Fall through to polling — maybe auto-deploy kicked in
  } else {
    const deployData = await deployRes.json()
    console.log(
      `[Vercel] Deployment triggered: ${deployData.id} (${deployData.url})`
    )
  }

  // 3. Wait a bit for deployment to register
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // Notify that we're entering the deployment polling phase
  if (onDeploymentPolling) {
    await onDeploymentPolling()
  }

  // 4. Poll for deployment completion (up to 10 minutes for large sites)
  const deploymentUrl = await pollDeployment(projectData.id)

  return {
    projectId: projectData.id,
    deploymentUrl,
  }
}

/**
 * Trigger a new deployment for an existing Vercel project.
 * Used when retrying a failed deployment.
 */
export async function triggerDeployment({
  projectId,
  repoFullName,
}: {
  projectId: string
  repoFullName: string
}): Promise<string> {
  const tq = teamQuery()
  const [owner, repo] = repoFullName.split("/")

  console.log(`[Vercel] Re-triggering deployment for ${repoFullName}...`)

  const deployRes = await fetch(
    `${VERCEL_API}/v13/deployments${tq ? `?${tq}` : ""}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repo,
        project: projectId,
        gitSource: {
          type: "github",
          org: owner,
          repo: repo,
          ref: "main",
        },
      }),
    }
  )

  if (!deployRes.ok) {
    const err = await deployRes.text()
    throw new Error(`Failed to trigger deployment: ${err}`)
  }

  const deployData = await deployRes.json()
  console.log(
    `[Vercel] Deployment triggered: ${deployData.id} (${deployData.url})`
  )

  // Wait a bit then poll
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return await pollDeployment(projectId)
}

async function pollDeployment(
  projectId: string,
  maxAttempts = 60
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const query = teamQuery()
    const url = `${VERCEL_API}/v6/deployments?projectId=${projectId}${query ? `&${query}` : ""}&limit=1`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    })
    const data = await res.json()
    const deployment = data.deployments?.[0]

    if (deployment) {
      console.log(
        `[Vercel] Poll ${i + 1}/${maxAttempts}: deployment state = ${deployment.state}`
      )
    } else {
      console.log(
        `[Vercel] Poll ${i + 1}/${maxAttempts}: no deployments yet`
      )
    }

    if (deployment?.state === "READY") {
      return `https://${deployment.url}`
    }
    if (deployment?.state === "ERROR" || deployment?.state === "CANCELED") {
      // Fetch more details about the error
      let errorDetail = deployment.errorMessage || "Unknown error"
      try {
        const detailRes = await fetch(
          `${VERCEL_API}/v13/deployments/${deployment.uid}${query ? `?${query}` : ""}`,
          {
            headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
          }
        )
        const detailData = await detailRes.json()
        if (detailData.errorMessage) {
          errorDetail = detailData.errorMessage
        }
      } catch {
        // Ignore detail fetch errors
      }
      throw new Error(`Deployment failed: ${errorDetail}`)
    }

    // Wait 10 seconds between polls
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }

  throw new Error("Deployment timed out after 10 minutes")
}
