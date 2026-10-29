import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "alt"> & {
  alt: string;
};

export function SmartImage({ alt, quality = 75, ...props }: Props) {
  return <Image alt={alt} quality={quality} {...props} />;
}
