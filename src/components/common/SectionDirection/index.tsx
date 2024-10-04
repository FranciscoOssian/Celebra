import Image from "next/image";
import Button from "@/components/common/Button";

interface SectionDirectionPropsType {
  image?: string;
  title: string;
  description: string;
  action: () => void;
  direction: "left" | "right";
}

const TextBlock = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: () => void;
}) => {
  return (
    <div>
      <div className="text-5xl font-bold text-blue-900 mb-4">{title}</div>
      <div className=" text-gray-500 text-lg mb-6 w-64">{description}</div>
      <Button onClick={action}>Get Started</Button>
    </div>
  );
};

const Img = ({ src }: { src: string }) => {
  return (
    <div className="relative w-[475px] h-[356px] rounded-3xl overflow-hidden">
      <Image
        src={
          src ??
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI2IiBoZWlnaHQ9IjEyNiI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0xMjYgMHYyMS41ODRMMjEuNTg0IDEyNkgwdi0xNy41ODVMMTA4LjQxNSAwSDEyNlptMCAxMDguNDE0VjEyNmgtMTcuNTg2TDEyNiAxMDguNDE0Wm0wLTg0djM5LjE3MUw2My41ODUgMTI2SDI0LjQxNEwxMjYgMjQuNDE0Wm0wIDQydjM5LjE3TDEwNS41ODQgMTI2aC0zOS4xN0wxMjYgNjYuNDE0Wk0xMDUuNTg2IDAgMCAxMDUuNTg2VjY2LjQxNUw2Ni40MTUgMGgzOS4xNzFabS00MiAwTDAgNjMuNTg2VjI0LjQxNUwyNC40MTUgMGgzOS4xNzFabS00MiAwTDAgMjEuNTg2VjBoMjEuNTg2WiIvPjwvZGVmcz48dXNlIHhsaW5rOmhyZWY9IiNhIiBmaWxsPSIjODg4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4="
        }
        fill
        objectFit="cover"
        alt=""
      />
    </div>
  );
};

export default function SectionDirection({
  image,
  title,
  description,
  action,
  direction,
}: SectionDirectionPropsType) {
  return (
    <div className="flex justify-center items-center gap-4">
      {direction === "left" ? (
        <>
          <Img src={image ?? ""} />
          <TextBlock action={action} title={title} description={description} />
        </>
      ) : (
        <>
          <TextBlock action={action} title={title} description={description} />
          <Img src={image ?? ""} />
        </>
      )}
    </div>
  );
}
