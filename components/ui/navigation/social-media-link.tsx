import { Facebook, Instagram } from "lucide-react";
import { ComponentProps } from "react";

import { cn } from "@/utils/cn";

type SocialMediaPlatform = "facebook" | "instagram";

interface SocialMediaLinkProps extends ComponentProps<"a"> {
  platform: SocialMediaPlatform;
  url: string;
}

const platformConfig = {
  facebook: {
    icon: Facebook,
    label: "Facebook",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram",
  },
} as const;

export function SocialMediaLink({
  platform,
  url,
  className,
  ...props
}: SocialMediaLinkProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 flex size-10 items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105",
        className,
      )}
      aria-label={config.label}
      {...props}
    >
      <Icon className="size-5" />
    </a>
  );
}
