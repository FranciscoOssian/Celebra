"use client";

import { EventType } from "@/types/Event";
import { useParams, useRouter } from "next/navigation";
import { getTranslations, translations } from "@/services/translations";
import useUser from "@/services/firebase/Hooks/useUser";
import Button from "@/components/common/Button";
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase/firebase";
import useUserSubscription from "@/services/firebase/Hooks/useUserSubscription";
import getEvent from "@/services/firebase/Read/event";
import { QRCode } from "antd";

const auth = getAuth(app);

const DisplayJson = ({ data }: { data: { [key: string]: any } }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Purchased Information</h2>
      <div className="space-y-2">
        <div>
          <span className="font-bold">Purchase Date:</span>
          <span>
            {" "}
            {new Date(data.purchasedAt.seconds * 1000).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="font-bold">Amount:</span>
          <span> {data.amount}</span>
        </div>
        <div>
          <span className="font-bold">User ID:</span>
          <span> {data.userId}</span>
        </div>
        <div>
          <span className="font-bold">Event ID:</span>
          <span> {data.eventId}</span>
        </div>
      </div>
    </div>
  );
};

export default function ShowTicketReceipt() {
  const { id, lang } = useParams();

  const [event, setEvent] = useState<EventType | null>(null);
  useEffect(() => {
    const run = async () => {
      setEvent(
        (await getEvent(typeof id === "string" ? id : id[0])) as EventType
      );
    };

    run();
  }, [id]);

  const { user } = useUser();
  const { subscription: sub } = useUserSubscription(
    user?.uid,
    typeof id === "string" ? id : id[0]
  );
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        footer={null}
        onClose={() => handleClose()}
        title={""}
        open={isModalOpen && !!id}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex justify-center items-center flex-wrap">
          <QRCode
            className="w-[200px] h-[200px]"
            value={
              JSON.stringify({
                ...sub?.subscription,
                userId: user.uid,
                eventId: id,
              }) || "-"
            }
          />
          <pre>
            <DisplayJson
              data={{
                ...sub?.subscription,
                userId: user.uid,
                eventId: id,
              }}
            />
          </pre>
        </div>
      </Modal>
      {contextHolder}
      <div className="w-full flex justify-end items-end">
        <Button
          disable={event?.creatorId === user.uid}
          onClick={() => {
            if (!event) return;

            if (!auth.currentUser) {
              api.info({
                message: t("Needs to log in"),
                description: (
                  <div>
                    {t("Error trying to show tickets, you are not logged in.")}
                  </div>
                ),
                placement: "topRight",
              });

              return;
            }

            if (!user.uid) {
              router.push(
                "/auth/signin?redirect=" +
                  encodeURIComponent(window.location.toString())
              );
            }
            showModal();
          }}
        >
          {t(`Show tickets`)}
        </Button>
      </div>
    </>
  );
}
