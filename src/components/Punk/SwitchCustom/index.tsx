import { Switch } from "antd";
import { useEffect } from "react";
import Box from "../Box";

export interface SwitchCustomPropsType {
  name: string;
  value: boolean;
  onChange(v: boolean): void;
  defaultChecked?: boolean;
}

const SwitchCustom = ({
  name,
  value,
  onChange,
  defaultChecked,
}: SwitchCustomPropsType) => {
  useEffect(() => {
    if (defaultChecked) onChange(true);
  }, [defaultChecked, onChange]);
  return (
    <Box
      name={name}
      Svg={() => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-check-circle "
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="m9 11 3 3L22 4"></path>
        </svg>
      )}
    >
      <Switch
        defaultChecked={defaultChecked}
        checked={value}
        onChange={(prev) => onChange(prev)}
      />
    </Box>
  );
};

export default SwitchCustom;
