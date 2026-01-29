import { Viewport } from "next";
import { BentoBackground } from "@/components/bento/BentoBackground";

// Override theme color for iOS Safari overscroll areas
export const viewport: Viewport = {
  themeColor: "#f5f5f7",
};

export default function BentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BentoBackground />
      {children}
    </>
  );
}
