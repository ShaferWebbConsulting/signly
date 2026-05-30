import { cn } from "@/lib/utils";

export function Avatar({ name, src, className }: { name?: string | null; src?: string | null; className?: string }) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "SU";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={name ?? "Avatar"} src={src} className={cn("h-10 w-10 rounded-full object-cover", className)} />
    );
  }

  return <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-violet-500/15 dark:text-violet-300", className)}>{initials}</div>;
}
