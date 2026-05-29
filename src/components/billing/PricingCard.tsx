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
    <Card className={featured ? "border-indigo-500/50 bg-indigo-500/5" : undefined}>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-sm font-medium text-indigo-500">{title}</p>
          <div className="text-3xl font-semibold text-zinc-950 dark:text-white">{price}</div>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-indigo-500" />
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
