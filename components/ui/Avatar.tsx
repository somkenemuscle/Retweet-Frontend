import Image from "next/image";
import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-[hsl(214_80%_92%)] text-[hsl(214_70%_35%)]",
  "bg-[hsl(262_70%_93%)] text-[hsl(262_55%_42%)]",
  "bg-[hsl(152_55%_90%)] text-[hsl(152_45%_30%)]",
  "bg-[hsl(32_85%_90%)] text-[hsl(32_70%_38%)]",
  "bg-[hsl(340_75%_93%)] text-[hsl(340_55%_42%)]",
  "bg-[hsl(190_65%_90%)] text-[hsl(190_60%_30%)]",
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

type AvatarProps = {
  username?: string;
  src?: string | null;
  size?: number;
  className?: string;
};

/** Round avatar. Uses the image when present, otherwise a deterministic initial. */
export default function Avatar({ username = "", src, size = 40, className }: AvatarProps) {
  const initial = (username.trim()[0] || "?").toUpperCase();
  const tone = PALETTE[hash(username || "?") % PALETTE.length];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border/60",
        !src && tone,
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={username}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="font-semibold leading-none"
          style={{ fontSize: Math.max(size * 0.4, 11) }}
        >
          {initial}
        </span>
      )}
    </span>
  );
}
