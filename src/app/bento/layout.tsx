export default function BentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#f5f5f7]">
      {children}
    </div>
  );
}
