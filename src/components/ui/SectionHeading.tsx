interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
