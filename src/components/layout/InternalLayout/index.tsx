export default function InternalLayout({
  children,
  className,
  id,
  parentClassName,
  childrenClassName,
}: {
  children: React.ReactNode;
  className?: string;
  parentClassName?: string;
  childrenClassName?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`w-full flex justify-center items-center ${className} ${parentClassName}`}
    >
      <div
        className={`md:w-[60%] max-md:w-[90%] ${className} ${childrenClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
