"use client";

import Button from "@/components/common/Button";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MyButton = dynamic(() => import("./button"), { ssr: false });

export default function SubscribeButton({ eventId }: { eventId: string }) {
  return (
    <Suspense fallback={<Button>...</Button>}>
      <MyButton id={eventId} />
    </Suspense>
  );
}
