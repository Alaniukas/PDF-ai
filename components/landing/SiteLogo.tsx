import Image from "next/image";
import Link from "next/link";

type Props = {
  showText?: boolean;
  className?: string;
};

export function SiteLogo({ showText = true, className = "" }: Props) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/logo-lafela.png"
        alt="Lafela logotipas"
        width={40}
        height={40}
        className="h-9 w-9 rounded-lg object-cover"
        priority
      />
      {showText && (
        <span className="font-serif text-lg text-ink leading-tight">
          DI darbo gidas
        </span>
      )}
    </Link>
  );
}
