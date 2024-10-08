import Link from "next/link";

export default function Button({
  href,
  children,
  onClick,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  if (href)
    return (
      <Link href={href}>
        <div
          className={`text-white select-none cursor-pointer w-fit text-[14px] p-2 px-4 flex justify-center items-center rounded-lg h-[36px] font-semibold text-center bg-slate-950 ${className}`}
        >
          {children}
        </div>
      </Link>
    );
  return (
    <div
      onClick={onClick}
      className={`text-white select-none cursor-pointer w-fit text-[14px] p-2 px-4 flex justify-center items-center rounded-lg h-[36px] font-semibold text-center bg-slate-950 ${className}`}
    >
      {children}
    </div>
  );
}
