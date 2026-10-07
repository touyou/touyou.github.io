import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import homeContent from "@/data/home-content.json";
import { AppCarousel } from "@/components/home/AppCarousel";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface LogoCard {
  id: string;
  type: "logo";
  image: string;
  alt: string;
  rotation?: number;
  width?: number;
  height?: number;
}

interface LinkCard {
  id: string;
  type: "link";
  emoji: string;
  title: string;
  url: string;
  external: boolean;
}

interface BadgesCard {
  id: string;
  type: "badges";
  emoji: string;
  items: Array<{ label: string; variant: BadgeVariant }>;
}

type HomeCard = LogoCard | LinkCard | BadgesCard;

function renderCard(card: HomeCard) {
  switch (card.type) {
    case "logo":
      return (
        <Card key={card.id} className="p-4 w-80 h-80 bg-[#111111]">
          <CardContent className="p-0 w-full h-full flex flex-col items-center justify-center gap-3">
            <Image
              src={card.image}
              alt={card.alt}
              width={card.width || 150}
              height={card.height || 150}
              className={card.rotation ? `rotate-[${card.rotation}deg]` : undefined}
              style={card.rotation ? { transform: `rotate(${card.rotation}deg)` } : undefined}
            />
          </CardContent>
        </Card>
      );

    case "link":
      return (
        <Card key={card.id} className="p-4 w-80 h-80">
          <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
            <p className="text-9xl">{card.emoji}</p>
            <a
              href={card.url}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noreferrer" : undefined}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "font-bold"
              )}
            >
              {card.title}
            </a>
          </CardContent>
        </Card>
      );

    case "badges":
      return (
        <Card key={card.id} className="p-4 w-80 h-80">
          <CardContent className="p-0 h-full w-full flex flex-col items-center justify-center gap-3">
            <p className="text-9xl">{card.emoji}</p>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {card.items.map((item, index) => (
                <Badge key={index} variant={item.variant}>
                  {item.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}

export default async function Home() {
  const cards = homeContent.cards as HomeCard[];

  return (
    <main className="flex min-h-dvh w-full flex-col items-center gap-16 pb-8">
      <div className="flex w-full flex-wrap content-center items-center justify-center gap-4 px-12 pt-16">
        {cards.map((card) => renderCard(card))}
      </div>
      <AppCarousel />
      <footer className="mt-auto w-full cursor-default text-center text-sm text-muted transition hover:text-primary">
        Copyrights © 2015- touyou. All Rights Reserved.
      </footer>
    </main>
  );
}

export const dynamic = "force-dynamic";
