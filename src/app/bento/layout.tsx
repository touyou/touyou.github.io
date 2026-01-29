import { Viewport } from "next";

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
      {/* Fixed background that covers entire viewport including overscroll */}
      <div className="fixed inset-0 bg-[#f5f5f7] -z-10" aria-hidden="true" />
      <div className="relative min-h-dvh">
        {children}
      </div>
    </>
  );
}
