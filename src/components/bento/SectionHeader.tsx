interface SectionHeaderProps {
  children: React.ReactNode;
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <h2 className="text-gray-600 text-sm font-semibold px-1 mb-3">
      {children}
    </h2>
  );
}
