import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OGPImage } from "./OGPImage";

const card = { owner: "touyou", repo: "skills", description: "Claude Code skills" };

describe("OGPImage", () => {
  it("画像が読めなければ GitHub 風のプレースホルダーに差し替える", () => {
    const { container } = render(
      <OGPImage src="https://opengraph.githubassets.com/x/touyou/skills" githubCard={card} />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(screen.getByTestId("github-card-placeholder")).toBeInTheDocument();
    expect(screen.getByText("skills")).toBeInTheDocument();
    expect(screen.getByText("Claude Code skills")).toBeInTheDocument();
  });

  it("画像が無い GitHub リンクは最初からプレースホルダー", () => {
    render(<OGPImage src={null} githubCard={card} />);
    expect(screen.getByTestId("github-card-placeholder")).toBeInTheDocument();
  });

  it("GitHub 以外で画像が無ければリンクのアイコン", () => {
    render(<OGPImage src={null} githubCard={null} />);
    expect(screen.queryByTestId("github-card-placeholder")).toBeNull();
  });
});
