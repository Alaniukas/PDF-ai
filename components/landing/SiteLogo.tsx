import Image from "next/image";
import Link from "next/link";

type Props = {
  showText?: boolean;
  className?: string;
};

export function SiteLogo({ showText = true, className = "" }: Props) {
  return (
    <Link href="/" className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <Image
        src="/images/logo-lafela.png"
        alt="Lafela logotipas"
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 rounded-lg object-cover"
        priority
      />
      {showText && (
        <span className="hidden font-serif text-base leading-tight text-ink min-[380px]:inline sm:text-lg">
          DI darbo gidas
        </span>
      )}
    </Link>
  );
}
