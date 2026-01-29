# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for touyou (Fujii Yosuke), built with Next.js 16 and React 19.

## Tech Stack

- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **Language**: TypeScript 5.9
- **UI**: React 19, Tailwind CSS 3.4
- **Package Manager**: pnpm 9.15
- **Node.js**: 22.13 (LTS)

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

## Path Aliases

- `@/*` maps to `./src/*`
