import { describe, expect, it } from "vitest";
import { githubRepoCard } from "./github-card";

describe("githubRepoCard", () => {
  it("リポジトリ以外の URL は対象外", () => {
    expect(githubRepoCard("https://github.com/touyou")).toBeNull();
    expect(githubRepoCard("https://example.com/a/b")).toBeNull();
    expect(githubRepoCard("https://github.com/a/b/issues")).toBeNull();
  });

  it("og:title から説明を取り出す", () => {
    expect(
      githubRepoCard("https://github.com/touyou/IntentTodo", {
        title: "GitHub - touyou/IntentTodo: App Intents中心設計で作るToDoアプリ",
        image: null,
        description:
          "App Intents中心設計で作るToDoアプリ. Contribute to touyou/IntentTodo development by creating an account on GitHub.",
      })
    ).toEqual({
      owner: "touyou",
      repo: "IntentTodo",
      description: "App Intents中心設計で作るToDoアプリ",
    });
  });

  it("タイトルに説明が無ければ og:description の定型文を落として使う", () => {
    expect(
      githubRepoCard("https://github.com/touyou/skills/", {
        title: "",
        image: null,
        description: "Claude Code skills - touyou/skills",
      })?.description
    ).toBe("Claude Code skills");
    expect(
      githubRepoCard("https://github.com/a/b", {
        title: "",
        image: null,
        description: "Nice. Contribute to a/b development by creating an account on GitHub.",
      })?.description
    ).toBe("Nice");
  });

  it("OGP が無くてもオーナーとリポジトリ名は出せる", () => {
    expect(githubRepoCard("https://github.com/goodpatch/sparkle-design")).toEqual({
      owner: "goodpatch",
      repo: "sparkle-design",
      description: undefined,
    });
  });
});
