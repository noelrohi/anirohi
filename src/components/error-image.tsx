"use client";
import { placeholderImage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import NextImage, { ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  errorText?: string;
};

export function WithErrorImage({ className, errorText, src, ...props }: Props) {
  const [newSrc, setSrc] = useState(src);
  const [isLoading, setLoading] = useState(true);
  return (
    <NextImage
      {...props}
      className={cn(
        className,
        isLoading
          ? "scale-110 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0"
      )}
      src={newSrc}
      onError={() => setSrc(placeholderImage(errorText ?? props.alt))}
      onLoad={() => setLoading(false)}
    />
  );
}