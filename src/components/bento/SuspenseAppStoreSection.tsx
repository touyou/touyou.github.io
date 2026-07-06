"use client";

import { use } from "react";
import type { AppStoreApp } from "@/lib/app-store";
import { AppStoreSection } from "./AppStoreSection";

interface SuspenseAppStoreSectionProps {
  appsPromise: Promise<AppStoreApp[]>;
  title?: string;
}

export function SuspenseAppStoreSection({
  appsPromise,
  title,
}: SuspenseAppStoreSectionProps) {
  const apps = use(appsPromise);
  return <AppStoreSection apps={apps} title={title} />;
}
