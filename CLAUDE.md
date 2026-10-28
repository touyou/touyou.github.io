# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for touyou (Fujii Yosuke), built with Next.js 16 and React 19.

## Tech Stack

- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **Language**: TypeScript 5.9
- **UI**: React 19, Tailwind CSS 3.4
- **Package Manager**: pnpm 9.15
- **Node.js**: 24 (LTS)

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run tests (watch mode)
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── layout.tsx    # Root layout with metadata
│   ├── page.tsx      # Home page component
│   └── globals.css   # Global styles (Tailwind)
├── components/
│   ├── common/       # Shared components
│   └── ui/           # UI primitives (Button, Card, Badge)
└── lib/
    └── utils.ts      # Utility functions (cn for classNames)
```

## Architecture Notes

- Uses Next.js App Router with typed routes enabled
- UI components are built with Radix UI primitives and styled with Tailwind CSS
- The `cn()` utility combines `clsx` and `tailwind-merge` for conditional class handling
- Static site with dynamic rendering for the home page (`export const dynamic = "force-dynamic"`)

## Code Style

- ESLint 9 with flat config (`eslint.config.mjs`)
- Prettier for formatting
- TypeScript strict mode enabled

## CSS/Tailwind Rules

- **Use parent `gap` instead of child `margin` for spacing**: When laying out multiple elements (sections, cards, etc.), use `flex` or `grid` with `gap-*` on the parent container rather than adding `mt-*` or `mb-*` to each child element. This keeps spacing consistent and easier to maintain.
  ```tsx
  // Good: Parent controls spacing
  <div className="flex flex-col gap-6">
    <Section />
    <Section />
  </div>

  // Avoid: Each child has its own margin
  <div>
    <Section className="mt-6" />
    <Section className="mt-6" />
  </div>
  ```

## Testing

- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library
- **Test files**: Located alongside source files as `*.test.ts` or `*.test.tsx`
- **Coverage**: Configured for `src/lib/**/*.ts`

When adding new utility functions or logic-heavy code, write tests following TDD principles:
1. Write the test first
2. Run the test to see it fail
3. Implement the minimum code to pass
4. Refactor if needed

## Path Aliases

- `@/*` maps to `./src/*`

## 共通の運用ルール（全リポジトリ共通）

- **ブランチ名は役割で付ける**: `feature/` `fix/` `chore/` `docs/` `refactor/` `style/` `release/x.y.z` などの接頭辞 + 短い英語の説明（例: `fix/widget-crash`）。`claude/...` や自動生成の名前は使わない。このリポジトリに別の命名ルールが書いてあればそちらに従う
- **アップデート文は少しあたたかく**: App Store の What's New・Google Play のリリースノート・`.github/devnull/next.md` などの告知は、変更点を並べるだけにしない。冒頭に使う人へのひとこと（その変更で何がうれしくなるか、など）を添えてから変更点を書く。ja / en とも同じ温度にする（Play は 500 字以内）
  - 例:「いつも使ってくださり、ありがとうございます。今回は○○をもっと気持ちよく使えるようにしました。」→ 続けて変更点
- **使い終わったものは消す**: マージ済み・不要になった作業ブランチ（リモートも）、一時ファイル、ビルド成果物、書き出した画像などは作業の最後に削除して容量を空ける。`main` / `production` / 既定ブランチ / 開いている PR のブランチは消さない
