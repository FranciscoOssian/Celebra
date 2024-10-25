import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Button({
  href,
  children,
  onMouseEnter,
  onClick,
  className,
  type,
  loading,
  LoadingComponent,
  target,
  rel,
  disable,
  done,
}: {
  onMouseEnter?: () => void;
  done?: boolean;
  disable?: boolean;
  target?: string;
  rel?: string;
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  loading?: boolean;
  LoadingComponent?: React.ReactNode;
}) {
  const baseClasses = `text-white select-none w-fit text-[14px] p-2 px-4 flex justify-center items-center rounded-lg h-[36px] font-semibold text-center bg-slate-950 ${className}`;
  const disabledClasses = disable ? "bg-slate-700 cursor-not-allowed" : "";

  const loadingIndicator = loading ? (
    <>
      {!LoadingComponent && (
        <ArrowPathIcon className="animate-spin size-5 mr-4" />
      )}
      {LoadingComponent}
    </>
  ) : done ? (
    <CheckIcon className="size-5 mr-4" />
  ) : null;

  if (disable) {
    return (
      <div className={`${baseClasses} ${disabledClasses}`}>
        {loadingIndicator}
        {children}
      </div>
    );
  }

  if (href) {
    return (
      <Link onMouseEnter={onMouseEnter} target={target} rel={rel} href={href}>
        <div className={`${baseClasses} ${disabledClasses}`}>
          {loadingIndicator}
          {children}
        </div>
      </Link>
    );
  }

  return (
    <button
      onMouseEnter={onMouseEnter}
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${disabledClasses}`}
    >
      {loadingIndicator}
      {children}
    </button>
  );
}
