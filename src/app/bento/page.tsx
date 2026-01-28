import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "touyou (Fujii Yosuke) - Software Engineer Profile",
};

// SNS Link icons as simple SVG components
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const ZennIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z" />
  </svg>
);

const NoteIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 17.25h-9a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75h6l3.75 3.75v6a.75.75 0 0 1-.75.75z" />
  </svg>
);

const SpeakerDeckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M10.025 13.875H4.687a4.688 4.688 0 0 1 0-9.375h6.227a.46.46 0 0 1 .46.46v8.455a.46.46 0 0 1-.46.46h-.889zm3.95 0h5.338a4.688 4.688 0 0 0 0-9.375h-6.227a.46.46 0 0 0-.46.46v8.455c0 .254.206.46.46.46h.889zM10.914 19.5H4.687a4.687 4.687 0 0 1-3.316-8.003.46.46 0 0 1 .326-.135h8.328a.46.46 0 0 1 .46.46v7.218a.46.46 0 0 1-.46.46h.889zm2.172 0h6.227a4.687 4.687 0 0 0 3.316-8.003.46.46 0 0 0-.326-.135h-8.328a.46.46 0 0 0-.46.46v7.218c0 .254.206.46.46.46h-.889z" />
  </svg>
);

export default function BentoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[120px] md:auto-rows-[140px]">
          {/* Profile Card - Large */}
          <Card className="col-span-2 row-span-2 bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="touyou"
                  width={80}
                  height={80}
                  className="invert"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  touyou
                </h1>
                <p className="text-zinc-400 text-sm md:text-base">
                  Fujii Yosuke / 藤井陽介
                </p>
                <p className="text-zinc-500 text-xs md:text-sm mt-2">
                  Software Engineer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* X (Twitter) */}
          <Card className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors group">
            <a
              href="https://x.com/touyoubuntu"
              target="_blank"
              rel="noreferrer"
              className="h-full w-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-white transition"
            >
              <XIcon />
              <span className="text-sm">@touyoubuntu</span>
            </a>
          </Card>

          {/* GitHub */}
          <Card className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors group">
            <a
              href="https://github.com/touyou"
              target="_blank"
              rel="noreferrer"
              className="h-full w-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-white transition"
            >
              <GitHubIcon />
              <span className="text-sm">@touyou</span>
            </a>
          </Card>

          {/* Current Work - Wide */}
          <Card className="col-span-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-zinc-700">
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <p className="text-zinc-400 text-xs mb-2">Current</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                  Goodpatch Inc.
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-400"
                >
                  Engineer
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Zenn */}
          <Card className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors group">
            <a
              href="https://zenn.dev/touyou"
              target="_blank"
              rel="noreferrer"
              className="h-full w-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-[#3EA8FF] transition"
            >
              <ZennIcon />
              <span className="text-sm">Zenn</span>
            </a>
          </Card>

          {/* note */}
          <Card className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors group">
            <a
              href="https://note.com/touyou"
              target="_blank"
              rel="noreferrer"
              className="h-full w-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-[#41C9B4] transition"
            >
              <NoteIcon />
              <span className="text-sm">note</span>
            </a>
          </Card>

          {/* Side Work */}
          <Card className="col-span-2 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-zinc-700">
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <p className="text-zinc-400 text-xs mb-2">Side Work</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  オンライン劇場 ZA
                </Badge>
                <Badge
                  variant="outline"
                  className="border-emerald-500 text-emerald-400"
                >
                  UX Engineer
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Skills - Large */}
          <Card className="col-span-2 row-span-2 bg-zinc-900 border-zinc-700">
            <CardContent className="p-4 h-full flex flex-col">
              <p className="text-zinc-400 text-xs mb-3 flex items-center gap-2">
                <span className="text-lg">💻</span> Skills
              </p>
              <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                <Badge className="bg-orange-600 text-white">Swift</Badge>
                <Badge
                  variant="outline"
                  className="border-orange-500 text-orange-400"
                >
                  SwiftUI
                </Badge>
                <Badge
                  variant="outline"
                  className="border-orange-500 text-orange-400"
                >
                  UIKit
                </Badge>
                <Badge className="bg-blue-600 text-white">TypeScript</Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-400"
                >
                  Next.js
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-400"
                >
                  Angular
                </Badge>
                <Badge className="bg-cyan-600 text-white">Flutter</Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  C/C++
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Kotlin
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Java
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Dart
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Haskell
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* SpeakerDeck */}
          <Card className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors group">
            <a
              href="https://speakerdeck.com/touyou"
              target="_blank"
              rel="noreferrer"
              className="h-full w-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-[#009287] transition"
            >
              <SpeakerDeckIcon />
              <span className="text-sm">SpeakerDeck</span>
            </a>
          </Card>

          {/* Qiita */}
          <Card className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors group">
            <a
              href="https://qiita.com/touyoubuntu"
              target="_blank"
              rel="noreferrer"
              className="h-full w-full flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-[#55C500] transition"
            >
              <span className="text-2xl font-bold">Q</span>
              <span className="text-sm">Qiita</span>
            </a>
          </Card>

          {/* Other Affiliations */}
          <Card className="col-span-2 bg-zinc-900 border-zinc-700">
            <CardContent className="p-4 h-full flex flex-col justify-center">
              <p className="text-zinc-400 text-xs mb-2">Also</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  NOTHING NEW
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Life is Tech !
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Games - Wide */}
          <Card className="col-span-2 row-span-2 bg-gradient-to-br from-violet-900/30 to-pink-900/30 border-zinc-700">
            <CardContent className="p-4 h-full flex flex-col">
              <p className="text-zinc-400 text-xs mb-3 flex items-center gap-2">
                <span className="text-lg">🎮</span> Games
              </p>
              <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                <Badge className="bg-yellow-600 text-white">原神</Badge>
                <Badge className="bg-purple-600 text-white">
                  崩壊: スターレイル
                </Badge>
                <Badge className="bg-orange-600 text-white">
                  ゼンレスゾーンゼロ
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  Splatoon3
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  ポケモン バイオレット
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  HOGWARTS LEGACY
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  MHワイルズ
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Hobbies - Wide */}
          <Card className="col-span-2 row-span-2 bg-gradient-to-br from-rose-900/30 to-amber-900/30 border-zinc-700">
            <CardContent className="p-4 h-full flex flex-col">
              <p className="text-zinc-400 text-xs mb-3 flex items-center gap-2">
                <span className="text-lg">🧸</span> Hobbies
              </p>
              <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                <Badge className="bg-green-600 text-white">フットサル</Badge>
                <Badge className="bg-amber-600 text-white">ギター</Badge>
                <Badge className="bg-pink-600 text-white">歌</Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  バイオリン
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  謎解き
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  漫画
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  アニメ
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  映画
                </Badge>
                <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                  ドラマ
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Featured Project */}
          <Card className="col-span-2 md:col-span-4 bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-700 hover:border-zinc-600 transition-colors">
            <a
              href="https://github.com/touyou/NeumorphismTab"
              target="_blank"
              rel="noreferrer"
              className="block h-full"
            >
              <CardContent className="p-4 h-full flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GitHubIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-400 text-xs mb-1">Featured Project</p>
                  <h3 className="text-white font-semibold truncate">
                    NeumorphismTab
                  </h3>
                  <p className="text-zinc-500 text-sm truncate">
                    Custom TabBarController with Neumorphism design for iOS
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-zinc-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </CardContent>
            </a>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-zinc-500 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
