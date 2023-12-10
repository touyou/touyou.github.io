import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="relative w-full h-full flex overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full flex flex-col justify-center items-center p-12 gap-4">
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
              <p className="text-9xl">🎮</p>
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
