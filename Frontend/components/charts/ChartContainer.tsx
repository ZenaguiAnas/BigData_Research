import { Card } from '@/components/ui/card';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ title, children, className }: ChartContainerProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      {children}
    </Card>
  );
}