interface SectionHeaderProps {
  children: React.ReactNode;
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <h2 className="col-span-2 md:col-span-4 text-gray-600 text-sm font-semibold mt-6 first:mt-0 px-1">
      {children}
    </h2>
  );
}
