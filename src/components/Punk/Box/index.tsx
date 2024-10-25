export interface BoxPropsType {
  name: string;
  Svg: () => React.ReactNode;
  children: React.ReactNode;
}

const Box = ({ name, Svg, children }: BoxPropsType) => (
  <div>
    <div className="flex items-center gap-2 ml-1 pl-1 pb-3 font-semibold">
      {<Svg />}
      {name}
    </div>
    <div className="py-3 px-4 border rounded-md border-zinc-300">
      {children}
    </div>
  </div>
);

export default Box;
