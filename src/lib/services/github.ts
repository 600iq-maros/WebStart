import { Octokit } from "octokit"

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

function getOwner(): string {
  return process.env.GITHUB_USERNAME!
}

export async function createRepoAndPush({
  name,
  files,
  packageJson,
}: {
  name: string
  files: Record<string, string>
  packageJson: Record<string, unknown>
}): Promise<string> {
  const owner = getOwner()

  // 1. Create the repository
  await octokit.rest.repos.createForAuthenticatedUser({
    name,
    private: true,
    auto_init: true,
  })

  // Brief pause for GitHub to initialize the repo
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const repoFullName = `${owner}/${name}`

  // 2. Prepare all files
  const allFiles: Record<string, string> = {
    ...files,
    "package.json": JSON.stringify(packageJson, null, 2),
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "es5",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2
    ),
    "postcss.config.js":
      "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}\n",
  }

  // 3. Get the current commit SHA on main
  const { data: ref } = await octokit.rest.git.getRef({
    owner,
    repo: name,
    ref: "heads/main",
  })
  const latestCommitSha = ref.object.sha

  // 4. Get the tree SHA of the latest commit
  const { data: commit } = await octokit.rest.git.getCommit({
    owner,
    repo: name,
    commit_sha: latestCommitSha,
  })
  const baseTreeSha = commit.tree.sha

  // 5. Create blobs for each file
  const treeItems: Array<{
    path: string
    mode: "100644"
    type: "blob"
    sha: string
  }> = []

  for (const [filePath, content] of Object.entries(allFiles)) {
    const { data: blob } = await octokit.rest.git.createBlob({
      owner,
      repo: name,
      content: Buffer.from(content).toString("base64"),
      encoding: "base64",
    })
    treeItems.push({
      path: filePath,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    })
  }

  // 6. Create a new tree
  const { data: newTree } = await octokit.rest.git.createTree({
    owner,
    repo: name,
    base_tree: baseTreeSha,
    tree: treeItems,
  })

  // 7. Create a new commit
  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner,
    repo: name,
    message: "Initial website generation by Web Factory",
    tree: newTree.sha,
    parents: [latestCommitSha],
  })

  // 8. Update the reference
  await octokit.rest.git.updateRef({
    owner,
    repo: name,
    ref: "heads/main",
    sha: newCommit.sha,
  })

  return repoFullName
}

export async function fetchRepoFiles(
  repoFullName: string
): Promise<Record<string, string>> {
  const [owner, repo] = repoFullName.split("/")
  const files: Record<string, string> = {}

  // Get the tree recursively
  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: "heads/main",
  })
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: refData.object.sha,
    recursive: "true",
  })

  // Fetch content for code files only
  for (const item of treeData.tree) {
    if (
      item.type === "blob" &&
      item.path &&
      item.sha &&
      (item.path.endsWith(".tsx") ||
        item.path.endsWith(".ts") ||
        item.path.endsWith(".css") ||
        item.path.endsWith(".json") ||
        item.path.endsWith(".js") ||
        item.path.endsWith(".mjs"))
    ) {
      const { data: blobData } = await octokit.rest.git.getBlob({
        owner,
        repo,
        file_sha: item.sha,
      })
      files[item.path] = Buffer.from(blobData.content, "base64").toString(
        "utf-8"
      )
    }
  }

  return files
}

export async function commitChanges({
  repoFullName,
  filesToUpdate,
  filesToDelete,
  commitMessage,
}: {
  repoFullName: string
  filesToUpdate: Record<string, string>
  filesToDelete: string[]
  commitMessage: string
}) {
  const [owner, repo] = repoFullName.split("/")

  // 1. Get current commit
  const { data: ref } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: "heads/main",
  })
  const latestCommitSha = ref.object.sha

  const { data: commit } = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  })
  const baseTreeSha = commit.tree.sha

  // 2. Create blobs for updated/created files
  const treeItems: Array<{
    path: string
    mode: "100644"
    type: "blob"
    sha: string | null
  }> = []

  for (const [filePath, content] of Object.entries(filesToUpdate)) {
    const { data: blob } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(content).toString("base64"),
      encoding: "base64",
    })
    treeItems.push({
      path: filePath,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    })
  }

  // 3. Mark deleted files
  for (const filePath of filesToDelete) {
    treeItems.push({
      path: filePath,
      mode: "100644",
      type: "blob",
      sha: null,
    })
  }

  // 4. Create tree, commit, update ref
  const { data: newTree } = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeItems,
  })

  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: newTree.sha,
    parents: [latestCommitSha],
  })

  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: "heads/main",
    sha: newCommit.sha,
  })
}
