import Button from "@/components/common/Button";
import InternalLayout from "@/components/layout/InternalLayout";
import { getTranslations, translations } from "@/services/translations";

export default function Hero({ lang }: { lang: string }) {
  const t = getTranslations(
    typeof lang === "string" ? lang : "en",
    translations
  );

  return (
    <div className="mb-11 overflow-hidden isolate relative w-full h-[454px] flex flex-col justify-center items-center text-center">
      <div className=" absolute top-0 w-full h-ful flex justify-center items-center">
        <div className="bg-black overflow-hidden rounded-b-xl">
          <div className="w-[805px] h-[454px]">
            <video
              className={`w-[100%] h-[100%] opacity-60`}
              playsInline
              autoPlay
              muted
              loop
            >
              <source
                src="https://firebasestorage.googleapis.com/v0/b/celebra-edbb4.appspot.com/o/filesForCelebraSite%2F3188887-hd_1920_1080_25fps.mp4?alt=media&token=826677a8-78b6-489c-95be-cf1378c68c77"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      <InternalLayout className="z-10 text-white">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-[40px] font-bold tracking-tight">
            🎉{t("Celebra")}🎉
          </h2>
          <h2 className="mt-4 text-[24px] font-medium leading-[1.5em] max-w-[400px] mx-auto">
            {t(
              "Celebra is the perfect solution for those who want to organize events in a simple and fun way. Come celebrate with us!"
            )}
          </h2>
          <Button
            href="/auth/signin"
            className="mt-6 bg-[#00bfff] text-white rounded-md px-4 py-2 hover:bg-[#0099cc] transition duration-300"
          >
            {t("Get Started")}
          </Button>
        </div>
      </InternalLayout>
    </div>
  );
}
