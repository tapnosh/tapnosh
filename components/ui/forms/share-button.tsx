"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/forms/button";
import { cn } from "@/utils/cn";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
}

export function ShareButton({
  url,
  title = "Check this out!",
  text,
  className,
  variant = "ghost",
  size = "icon",
  label,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          url,
        };

        // Only add title if provided
        if (title && title !== "Check this out!") {
          shareData.title = title;
        }

        // Only add text if provided and different from title
        if (text && text !== title) {
          shareData.text = text;
        }

        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          fallbackCopy();
        }
      }
    } else {
      // Fallback to copying to clipboard
      fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={cn(className)}
      title="Share"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {label && <span>{label}</span>}
    </Button>
  );
}
