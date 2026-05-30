import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function PricingCard({
  title,
  price,
  description,
  features,
  featured,
  cta,
  onClick,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta: string;
  onClick?: string;
}) {
  return (
    <Card className={featured ? "border-blue-200 bg-blue-50 dark:border-violet-500/50 dark:bg-violet-500/10" : undefined}>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 dark:text-violet-400">{title}</p>
          <div className="text-3xl font-semibold text-slate-950 dark:text-white">{price}</div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-slate-600 dark:text-zinc-300">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-blue-600 dark:text-violet-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={featured ? "default" : "outline"}>
          {onClick ? <a href={onClick}>{cta}</a> : cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
