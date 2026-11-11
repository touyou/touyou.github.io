import type { OGPData } from "./bento-types";

export interface GitHubRepoCard {
  owner: string;
  repo: string;
  description?: string;
}

const GITHUB_REPO_URL = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/;

// og:title は「GitHub - owner/repo: 説明」の形。説明は og:description より
// こちらのほうが「Contribute to …」などの定型文が付かない。
const GITHUB_TITLE = /^GitHub - [\w.-]+\/[\w.-]+(?::\s*(.+))?$/s;
const BOILERPLATE = /(?:\.\s*Contribute to .+ by creating an account on GitHub\.|\s+-\s+[\w.-]+\/[\w.-]+)\s*$/;

export function githubRepoCard(
  url: string,
  ogp?: OGPData
): GitHubRepoCard | null {
  const match = url.match(GITHUB_REPO_URL);
  if (!match) return null;
  const [, owner, repo] = match;

  const fromTitle = ogp?.title?.match(GITHUB_TITLE)?.[1]?.trim();
  const fromDescription = ogp?.description?.replace(BOILERPLATE, "").trim();
  const description = fromTitle || fromDescription || undefined;

  return { owner, repo, description };
}
