import Image, { type ImageProps } from "next/image";

type ResponsiveImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
};

export function ResponsiveImage({
  alt,
  sizes = "100vw",
  className,
  unoptimized,
  src,
  ...props
}: ResponsiveImageProps) {
  const isRemote = typeof src === "string" && /^https?:\/\//.test(src);

  return (
    <Image
      src={src}
      sizes={sizes}
      alt={alt}
      className={className}
      unoptimized={unoptimized ?? isRemote}
      {...props}
    />
  );
}
