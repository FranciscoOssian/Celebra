"use client";

import { EventType } from "@/types/Event";
import { useParams, useRouter } from "next/navigation";
import { getTranslations, translations } from "@/services/translations";
import useUser from "@/services/firebase/Hooks/useUser";
import Button from "@/components/common/Button";
import { Modal, notification } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase/firebase";
import { motion } from "framer-motion";
import useUserSubscription from "@/services/firebase/Hooks/useUserSubscription";
import { formatDayMonth } from "@/utils/time";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import getEvent from "@/services/firebase/Read/event";

const auth = getAuth(app);

const AnimatedCheck = () => {
  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex justify-center items-center p-6">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-green-500"
        viewBox="0 0 52 52"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="stroke-green-500"
        />
        <motion.path
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l7 7 17-17"
          variants={checkVariants}
        />
      </motion.svg>
    </div>
  );
};

export default function SubscribeButton({ id }: { id: string }) {
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    const run = async () => {
      setEvent((await getEvent(id)) as EventType);
    };

    run();
  }, [id]);

  const { user } = useUser();
  const { subscription: sub } = useUserSubscription(user?.uid, id);
  const { lang } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [isTrying, setIsTrying] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [amountForBuy, setAmountForBuy] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setAmountForBuy(newValue === "" ? "" : parseInt(newValue, 10));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  const onHandleSubscribe = async (amount: number) => {
    try {
      setIsTrying(true);
      const tokenId = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("tokenId", tokenId ?? "");
      formData.append("eventId", id);
      formData.append("amount", amount.toString());

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setShowDone(true);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    } finally {
      setIsTrying(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsTrying(false);
    setShowDone(false);
  };

  return (
    <>
      <Modal
        footer={null}
        onClose={() => handleClose()}
        title={t(
          `Get ${
            (sub?.subscription?.amount ?? 0) > 0 ? "more" : ""
          } tickets for the event`
        )}
        open={isModalOpen && !!id}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {!showDone ? (
          <div className="w-full h-full flex flex-col justify-start items-center text-center">
            <h2 className="mt-5 text-xl font-bold mb-4 text-center">
              {event?.name}
            </h2>
            {(sub?.subscription.amount ?? 0) > 0 && (
              <div className="mb-4 text-justify px-11">
                {t("You already have")} {sub?.subscription?.amount}{" "}
                {t("purchased on")}{" "}
                {formatDayMonth(
                  new Date(sub?.subscription?.purchasedAt?.seconds ?? 0)
                )}
                .
                <br />
                {t(
                  "If you wish to purchase more, fill in the field and buy again."
                )}
              </div>
            )}
            <form
              className="flex flex-col justify-center items-center w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (typeof amountForBuy === "number")
                  onHandleSubscribe(amountForBuy);
              }}
            >
              <label htmlFor="amount" className="text-lg font-medium mb-2">
                {t("Number of tickets")}:
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="100"
                value={amountForBuy}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-3/4 max-w-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="defaultNumbers">
                {Array.from({ length: 100 }, (_, i) => i + 1).map((i) => (
                  <option key={i} value={i}></option>
                ))}
              </datalist>
              <Button type="submit">
                {!isTrying ? (
                  t("Confirm")
                ) : (
                  <ArrowPathIcon className="size-5 animate-spin" />
                )}
              </Button>
            </form>
          </div>
        ) : (
          <AnimatedCheck />
        )}
      </Modal>
      {contextHolder}
      <div className="w-full flex justify-end items-end">
        <Button
          disable={event?.creatorId === user.uid}
          onClick={() => {
            if (!event) return;

            if (!auth.currentUser) {
              api.info({
                message: `Precisa logar`,
                description: (
                  <div>Você precisa está em uma conta para se inscrever</div>
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
          {t(`Get tickets`)}
        </Button>
      </div>
    </>
  );
}
