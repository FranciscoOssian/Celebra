export default function ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <div className={`md:w-[60%] max-md:w-[90%] ${className}`}>{children}</div>
    </div>
  );
}
