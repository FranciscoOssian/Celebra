import Image from "next/image";

const Avatar = ({
  src,
  alt,
  size = 40,
}: {
  src: string;
  alt: string;
  size: number;
}) => {
  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default Avatar;
