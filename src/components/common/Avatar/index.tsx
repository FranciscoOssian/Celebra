import Image from "next/image";

const Avatar = ({
  src,
  alt,
  size = 40,
}: {
  src: string;
  alt: string;
  size?: number;
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className="relative rounded-full overflow-hidden"
    >
      <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
    </div>
  );
};

export default Avatar;
