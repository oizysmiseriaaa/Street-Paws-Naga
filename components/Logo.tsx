import Image from "next/image";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ showText = true, size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo/logo.png"
        alt="Street Paws Naga Logo"
        width={64}
        height={64}
        unoptimized
        className={`${sizeClasses[size]} object-contain rounded-xl`}
      />
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
          Street Paws Naga
        </span>
      )}
    </div>
  );
}

