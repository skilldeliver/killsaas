import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/black_rose.svg" 
        alt="Black Rose" 
        width={size} 
        height={size} 
        className="object-contain"
      />
      <span className="font-[family-name:var(--font-louize)] text-xl lowercase tracking-tight">
        killsaas
      </span>
    </div>
  );
}
