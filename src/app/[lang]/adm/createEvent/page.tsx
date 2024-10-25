"use client";

import { Card } from "antd";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase/firebase";
import { notification } from "antd";
import { useParams, useRouter } from "next/navigation";
import updateEvent from "@/services/firebase/Update/event";
import getDownloadURLFromStorage from "@/services/firebase/Read/fileInEvent";
import EventForm, {
  EventFormType,
} from "@/components/pages/dashboard/EventForm";
import Button from "@/components/common/Button";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { getTranslations, translations } from "@/services/translations";

const auth = getAuth(app);

const CreateEvent = () => {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const { lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  const handleSubmit = async (values: EventFormType) => {
    await handleCreateEvent(values);
  };

  const handleCreateEvent = async (eventData: EventFormType) => {
    try {
      const tokenId = await auth.currentUser?.getIdToken();

      const { fileHero, ...event } = eventData;

      const formData = new FormData();
      formData.append("tokenId", tokenId ?? "");
      formData.append("event", JSON.stringify({ ...event }));

      if (fileHero.originFileObj) {
        formData.append("file", fileHero.originFileObj);
      }

      const response = await fetch("/api/createEvent", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await updateEvent(result?.event?.id, {
          fileHero: await getDownloadURLFromStorage(
            result?.event?.id,
            result?.event?.fileHero
          ),
        });
        router.push("/adm/events");
        api.open({
          message: eventData.name,
          description: "Your event, has been created",
          duration: 0,
        });
      } else if (result.url) {
        api.open({
          message: "",
          description: (
            <div>
              <Title level={4}>
                {t("You have reached the limit for free events.")}
              </Title>
              <Paragraph>
                {t("Click on payment to increase your management limit.")}
              </Paragraph>
              <div style={{ marginTop: 10 }}>
                <Button href={result.url}>{t("Payment")}</Button>
              </div>
            </div>
          ),
          duration: 0,
        });
      } else {
        api.open({
          role: "alert",
          message: "Error",
          description: `${result.error}`,
          duration: 0,
        });
        console.error(result.error);
      }
    } catch (error) {
      api.open({
        role: "alert",
        message: "Error",
        description: `${error}`,
        duration: 0,
      });
      console.error("Erro ao criar evento:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      {contextHolder}
      <Card className="w-full max-w-3xl shadow-md">
        <h2 className="text-center text-2xl mb-4">{t("Create Event")}</h2>
        <EventForm onSubmit={(values) => handleSubmit(values)} />
      </Card>
    </div>
  );
};

export default CreateEvent;
