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
        className={`md:max-w-[900px] md:w-[900px] max-md:min-w-[400px] max-md:w-[400px] ${className} ${childrenClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
