"use client";

import { notFound } from "next/navigation";
import { MastodonEmptyState } from "@/components/bento/MastodonEmptyState";

// Dev-only visual preview of Mastodon section states.
// Shows each state (empty / loading / failed) for both layouts side by side
// so we can tune the styling without needing to simulate Fedibird errors.
// Access at /preview/mastodon-states
function SidebarFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-72">
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col h-[600px]">
        <div className="px-4 py-3 border-b border-gray-100">
          <a className="text-gray-600 text-sm font-semibold">
            Mastodon (Fedibird)
          </a>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

function CarouselFrame({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full max-w-md">
      <div className="px-1 mb-3">
        <a className="text-gray-600 text-sm font-semibold">
          Mastodon (Fedibird)
        </a>
      </div>
      {children}
    </section>
  );
}

function Cell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-mono text-gray-500">{label}</p>
      {children}
    </div>
  );
}

const noop = () => {};

export default function MastodonStatesPreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header>
          <h1 className="text-xl font-semibold text-gray-900">
            Mastodon Empty State Preview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            `src/components/bento/MastodonEmptyState.tsx` を編集してスタイル調整
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Sidebar (compact) — Desktop
          </h2>
          <div className="flex gap-6 flex-wrap">
            <Cell label="empty">
              <SidebarFrame>
                <MastodonEmptyState
                  onReload={noop}
                  loading={false}
                  failed={false}
                  compact
                />
              </SidebarFrame>
            </Cell>
            <Cell label="loading (skeleton)">
              <SidebarFrame>
                <MastodonEmptyState
                  onReload={noop}
                  loading={true}
                  failed={false}
                  compact
                />
              </SidebarFrame>
            </Cell>
            <Cell label="failed">
              <SidebarFrame>
                <MastodonEmptyState
                  onReload={noop}
                  loading={false}
                  failed={true}
                  compact
                />
              </SidebarFrame>
            </Cell>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Carousel (!compact) — Mobile
          </h2>
          <div className="flex gap-6 flex-wrap">
            <Cell label="empty">
              <CarouselFrame>
                <MastodonEmptyState
                  onReload={noop}
                  loading={false}
                  failed={false}
                />
              </CarouselFrame>
            </Cell>
            <Cell label="loading (skeleton)">
              <CarouselFrame>
                <MastodonEmptyState
                  onReload={noop}
                  loading={true}
                  failed={false}
                />
              </CarouselFrame>
            </Cell>
            <Cell label="failed">
              <CarouselFrame>
                <MastodonEmptyState
                  onReload={noop}
                  loading={false}
                  failed={true}
                />
              </CarouselFrame>
            </Cell>
          </div>
        </section>
      </div>
    </main>
  );
}
