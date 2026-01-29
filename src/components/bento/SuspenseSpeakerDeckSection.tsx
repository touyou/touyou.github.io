"use client";

import { use } from "react";
import type { SpeakerDeckTalk } from "@/lib/speakerdeck";
import { SpeakerDeckSection } from "./SpeakerDeckSection";

interface SuspenseSpeakerDeckSectionProps {
  talksPromise: Promise<SpeakerDeckTalk[]>;
  title?: string;
}

export function SuspenseSpeakerDeckSection({
  talksPromise,
  title = "Speaker Deck",
}: SuspenseSpeakerDeckSectionProps) {
  const talks = use(talksPromise);
  return <SpeakerDeckSection talks={talks} title={title} />;
}
