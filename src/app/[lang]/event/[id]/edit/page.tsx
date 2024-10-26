"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { useMemo } from "react";
import updateEvent from "@/services/firebase/Update/event";
import { useParams } from "next/navigation";
import { initialData, puckConfig } from "@/services/puck/config";
import useEvent from "@/services/firebase/Hooks/useEvent";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase/firebase";
import { Button, notification } from "antd";
import { useRouter } from "next/navigation";
import type { NotificationArgsProps } from "antd";

type NotificationPlacement = NotificationArgsProps["placement"];

const auth = getAuth(app);

export const dynamic = "force-dynamic";

export default function Editor() {
  const { id } = useParams();
  const router = useRouter();

  const { event } = useEvent(typeof id === "string" ? id : id[0]);

  const state = useMemo(() => event?.data()?.puckData ?? initialData, [event]);
  const config = useMemo(() => puckConfig, []);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    const placement: NotificationPlacement = "topRight";
    api.info({
      message: `Saved`,
      description: "Your project has been saved!",
      placement,
      btn: (
        <Button
          type="primary"
          onClick={() => router.push(`/event/${id}/preview`)}
        >
          Go to your website
        </Button>
      ),
    });
  };

  const save = async (data: unknown) => {
    console.log(auth.currentUser);
    console.log("Dados salvos:", data);
    await updateEvent(typeof id === "string" ? id : id[0], { puckData: data });
    openNotification();
  };

  return (
    <>
      {contextHolder}
      {event && <Puck config={config} data={state} onPublish={save} />}
    </>
  );
}
