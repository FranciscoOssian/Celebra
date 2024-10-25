import SubscribeButton from "@/components/common/SubscribeButton";
import Header from "@/components/layout/Header";
import InternalLayout from "@/components/layout/InternalLayout";
import { getTranslations, translations } from "@/services/translations";
import { EventType } from "@/types/Event";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export const NormalPage = ({
  lang,
  event,
}: {
  lang: string;
  event: EventType;
}) => {
  const t = getTranslations(lang, translations);

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center">
        <div className="select-none w-full h-52 md:w-[50%] relative flex justify-center items-center">
          <div className="max-md:hidden absolute w-[100vw] h-52 opacity-30">
            <Image
              src={event.fileHero}
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <Image
            src={event.fileHero}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <InternalLayout className="mt-5 break-words">
          <SubscribeButton eventId={event.id} />
          <h1 className="mt-5 text-3xl font-bold mb-4">{event.name}</h1>
          <div className="flex text-lg mb-2">
            <ClockIcon className="size-7 mr-1" />
            {new Date(event.date).toLocaleString()}
          </div>
          <div className="flex text-lg mb-2">
            <MapPinIcon className="size-7 mr-1" />
            {event.location}
          </div>
          <p className="text-lg mb-4">
            <strong>{t("About")}:</strong> {event.description}
          </p>
        </InternalLayout>
      </div>
    </>
  );
};
