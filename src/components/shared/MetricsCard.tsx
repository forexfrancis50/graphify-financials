import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    direction: "up" | "down";
    value: string;
  };
}

export function MetricsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: MetricsCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        {Icon && (
          <div className="p-2 rounded-lg bg-accent/10">
            <Icon className="w-6 h-6 text-accent" />
          </div>
        )}
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.direction === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
}