"use client";

import Button from "@/components/common/Button";
import { getTranslations, translations } from "@/services/translations";
import { useParams } from "next/navigation";

interface PriceCardPropsType {
  title: string;
  price: number;
  benefits: string[];
  monthly?: boolean;
  annual?: boolean;
  single?: boolean;
  product: string;
}

const SVG = () => (
  <svg
    className="w-4 h-4 mr-2 fill-gray-700 flex-shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12C2.25 17.385 6.615 21.75 12 21.75C17.385 21.75 21.75 17.385 21.75 12C21.74 6.62 17.38 2.26 12 2.25Z M16.641 10.294L11.147 15.544C11.005 15.677 10.817 15.751 10.622 15.75C10.429 15.753 10.244 15.679 10.106 15.544L7.359 12.919C7.152 12.738 7.06 12.458 7.121 12.189C7.181 11.92 7.384 11.706 7.649 11.632C7.914 11.557 8.199 11.634 8.391 11.831L10.622 13.959L15.609 9.206C15.912 8.942 16.37 8.964 16.647 9.255C16.923 9.547 16.921 10.005 16.641 10.294Z"
      fill="#333"
    />
  </svg>
);

export default function PriceCard({
  title,
  price,
  benefits,
  monthly,
  annual,
  single,
  product,
}: PriceCardPropsType) {
  const { lang } = useParams();

  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  return (
    <div className="bg-white p-7 rounded-3xl shadow-[0px_0.796192px_3.38858px_-0.625px_rgba(0,0,0,0.07),0px_2.41451px_9.24352px_-1.25px_rgba(0,0,0,0.07),0px_6.38265px_24.148px_-1.875px_rgba(0,0,0,0.07),0px_20px_rgba(0,0,0,0.07)] w-[320px] h-[395px]">
      <div className="text-gray-600 text-lg font-semibold mb-2">{title}</div>
      <div className="flex items-center mb-8">
        <div className="text-5xl font-bold text-gray-900 mr-2">R${price}</div>
        <div className="text-gray-600 text-lg font-semibold">
          p/
          {monthly
            ? t("month")
            : annual
            ? t("year")
            : single
            ? product
            : product}
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        {benefits.map((benefit, i) => (
          <div key={i} className="flex items-center">
            <SVG />
            <span className="text-gray-600">{benefit}</span>
          </div>
        ))}
      </div>
      <Button href="/auth/signup">{t("Get Started")}</Button>
    </div>
  );
}
