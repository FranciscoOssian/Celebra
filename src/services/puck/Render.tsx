"use client";

import { Render as PuckRender } from "@measured/puck";
import { puckConfig } from "@/services/puck/config";

const Render = ({ data }: { data: never }) => {
  return <PuckRender config={puckConfig} data={data} />;
};

export default Render;
