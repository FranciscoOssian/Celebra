"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowPathIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import useUser from "@/services/firebase/Hooks/useUser";
import BottomSheet from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import { getAuth } from "firebase/auth";
import useUserSubscription from "@/services/firebase/Hooks/useUserSubscription";
import { formatDayMonth } from "@/utils/time";
import InternalLayout from "@/components/layout/InternalLayout";
import { motion } from "framer-motion";
import { getTranslations, translations } from "@/services/translations";

const auth = getAuth();

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

const EventPage = ({ params: { lang, id } }: never) => {
  const { user } = useUser();
  const {
    subscription: sub,
    loading,
    error,
  } = useUserSubscription(user?.uid, id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountForBuy, setAmountForBuy] = useState<number | "">("");
  const [isTrying, setIsTrying] = useState(false);
  const [showDone, setShowDone] = useState<boolean>(false);

  const { event, subscription } = useMemo(
    () => ({ event: sub?.event, subscription: sub?.subscription }),
    [sub]
  );

  const t = getTranslations(lang, translations);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setAmountForBuy(newValue === "" ? "" : parseInt(newValue, 10));
  };

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

  if (loading) return <div>{t("Loading")}...</div>;
  if (error)
    return <div>{t("Unable to load the event. Please try again.")}</div>;
  if (!event) return <div>{t("Event not found.")}</div>;

  const eventData = event;

  return (
    <div className="flex flex-col justify-center items-center">
      {eventData.fileHero.startsWith("http") && (
        <div className="select-none w-full h-52 md:w-[50%] relative flex justify-center items-center">
          <div className="max-md:hidden absolute w-[100vw] h-52 opacity-30">
            <Image
              src={eventData.fileHero}
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <Image
            src={eventData.fileHero}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <InternalLayout className="mt-5">
        {eventData.creatorId !== user?.uid && (
          <div className="w-full flex justify-end items-end">
            <Button
              onClick={() => {
                if (!user?.uid)
                  return alert(
                    "precisa ter uma conta logada para se inscrever"
                  );
                setIsModalOpen(true);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              {t(
                `Get ${(subscription?.amount ?? 0) > 0 ? "more" : ""} tickets`
              )}
            </Button>
          </div>
        )}
        <h1 className="mt-5 text-3xl font-bold mb-4">{eventData.name}</h1>
        <div className="flex text-lg mb-2">
          <ClockIcon className="size-7 mr-1" />
          {new Date(eventData.date).toLocaleString()}
        </div>
        <div className="flex text-lg mb-2">
          <MapPinIcon className="size-7 mr-1" />
          {eventData.location}
        </div>
        <p className="text-lg mb-4">
          <strong>{t("About")}:</strong> {eventData.about}
        </p>
      </InternalLayout>

      <BottomSheet
        onClose={() => {
          setIsModalOpen(false);
          setShowDone(false);
        }}
        isOpen={isModalOpen}
      >
        {!showDone ? (
          <div className="w-full h-full flex flex-col justify-start items-center text-center">
            <h2 className="mt-5 text-xl font-bold mb-4 text-center">
              {t(
                `Get ${
                  (subscription?.amount ?? 0) > 0 ? "more" : ""
                } tickets for the event`
              )}
              : {eventData.name}
            </h2>
            {(sub?.subscription.amount ?? 0) > 0 && (
              <div className="mb-4 text-justify px-11">
                {t("You already have")} {subscription?.amount}{" "}
                {t("purchased on")}{" "}
                {formatDayMonth(
                  new Date(subscription?.purchasedAt?.seconds ?? 0)
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
      </BottomSheet>
    </div>
  );
};

export default EventPage;
