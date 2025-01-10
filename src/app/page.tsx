import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="relative w-full h-full flex overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full min-h-full flex flex-wrap justify-center items-center content-center px-12 py-16 gap-4">
          <Card className="p-4 w-80 h-80 bg-[#111111]">
            <CardContent className="p-0 w-full h-full flex flex-col items-center justify-center gap-3">
              <Image
                src="logo.svg"
                alt="logo"
                width="150"
                height="150"
                className="rotate-[11.21deg]"
              />
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80">
            <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
              <p className="text-9xl">📚</p>
              <a
                href="https://touyou.github.io"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "font-bold"
                )}
              >
                大学時代のポートフォリオ
              </a>
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80">
            <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
              <p className="text-9xl">🍱</p>
              <a
                href="https://bento.me/touyou"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "font-bold"
                )}
              >
                bento.me
              </a>
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80">
            <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
              <p className="text-9xl">🏢</p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge>Goodpatch Inc.</Badge>
                <Badge variant="outline">Engineer</Badge>
                <Badge>オンライン劇場 ZA</Badge>
                <Badge variant="outline">UX Engineer</Badge>
                <Badge variant="secondary">NOTHING NEW</Badge>
                <Badge variant="secondary">Life is Tech !</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80">
            <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
              <p className="text-9xl">💻</p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge>Swift</Badge>
                <Badge variant="outline">SwiftUI/UIKit</Badge>
                <Badge>TypeScript</Badge>
                <Badge variant="outline">Next.js/Angular</Badge>
                <Badge variant="outline">Flutter</Badge>
                <Badge variant="secondary">C/C++</Badge>
                <Badge variant="secondary">Java</Badge>
                <Badge variant="secondary">Kotlin</Badge>
                <Badge variant="secondary">Dart</Badge>
                <Badge variant="secondary">Haskell</Badge>
                <Badge variant="secondary">Scheme</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80">
            <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
              <p className="text-9xl">🎮</p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge>原神</Badge>
                <Badge>崩壊: スターレイル</Badge>
                <Badge>ゼンレスゾーンゼロ</Badge>
                <Badge variant="secondary">Splatoon3</Badge>
                <Badge variant="secondary">
                  ポケットモンスター バイオレット
                </Badge>
                <Badge variant="secondary">HOGWARTS LEGACY</Badge>
                <Badge variant="secondary">モンスターハンターワイルズ</Badge>
                <Badge variant="secondary">
                  モンスターハンターライズ：サンブレイク
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80">
            <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
              <p className="text-9xl">🧸</p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge>フットサル</Badge>
                <Badge>ギター</Badge>
                <Badge>歌</Badge>
                <Badge variant="secondary">バイオリン</Badge>
                <Badge variant="secondary">謎解き</Badge>
                <Badge variant="secondary">漫画</Badge>
                <Badge variant="secondary">アニメ</Badge>
                <Badge variant="secondary">映画</Badge>
                <Badge variant="secondary">ドラマ</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 w-80 h-80 bg-[#111111]">
            <CardContent className="p-0 w-full h-full flex flex-col items-center justify-center gap-3">
              <Image
                src="logo_title.svg"
                alt="touyou"
                width="150"
                height="80"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="absolute bottom-2 text-center w-full text-sm text-muted hover:text-primary transition cursor-default">
        Copyrights © 2015- touyou. All Rights Reserved.
      </footer>
    </main>
  );
}

export const dynamic = "force-dynamic";
