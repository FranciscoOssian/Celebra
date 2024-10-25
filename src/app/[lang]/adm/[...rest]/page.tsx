"use client";

import Button from "@/components/common/Button";
import { getTranslations, translations } from "@/services/translations";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const NotFound = () => {
  const { lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );
  return (
    <div className="select-none h-[80vh] p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl mt-4">
          {t("Page not found or under construction.")}
        </h2>
        <p className="mt-2 text-gray-700">
          {t("Sorry, but the page you are looking for does not exist.")}
        </p>
        <Button href="/adm" className="mt-6">
          {t("Go back to the homepage")}
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
