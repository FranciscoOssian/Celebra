"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../context";
import { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Progress,
  Typography,
  Card,
  Divider,
  Col,
  Row,
  Statistic,
} from "antd";
import Button from "@/components/common/Button";
import updateEvent from "@/services/firebase/Update/event";
import createFileEvent from "@/services/firebase/Create/fileEvent";
import deleteEventFile from "@/services/firebase/Delete/eventFile";
import { UserOutlined } from "@ant-design/icons";
import EventForm, {
  EventFormType,
} from "@/components/pages/dashboard/EventForm";
import { getTranslations, translations } from "@/services/translations";

const { Title, Text } = Typography;
export default function Page() {
  const { subscriptions, setSubscriptions } = useAppContext();

  const { id, lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  const router = useRouter();
  const resp = useMemo(
    () => subscriptions.find((e) => e.event.id === id),
    [subscriptions, id]
  );
  const event = resp?.event;

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("");

  const onHandleCancel = () => {
    setOpen(false);
  };

  const handleOpen = useCallback(async () => {
    if (!event) return;
    if (event?.usePuck) {
      setModalText(
        t(
          "Hey, do you want to return to the traditional page? No problem! Your customized page will be saved and can be used again within this event."
        )
      );
    } else {
      setModalText(
        t(
          "This will set your event to be loaded in a special way, but you can change it later. You will not lose your current page, but you will have to build a new one."
        )
      );
    }
    setOpen(true);
  }, [event, t]);

  const handleOk = useCallback(async () => {
    setConfirmLoading(true);
    setModalText("Carregando...");
    const newUsePuck = !event?.usePuck;
    await updateEvent(event?.id ?? "", { usePuck: newUsePuck });
    setSubscriptions(
      subscriptions.map((s) =>
        s.event.id === event?.id
          ? {
              event: { ...s.event, usePuck: newUsePuck },
              subscriptions: { ...s.subscriptions },
            }
          : s
      )
    );
    setConfirmLoading(false);
    setOpen(false);
  }, [event, setSubscriptions, subscriptions]);

  console.log(subscriptions);

  return (
    <div className="ml-5 mt-5">
      <Modal
        title={t("Manage Event Display")}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onHandleCancel}
      >
        <p>{modalText}</p>
      </Modal>

      <div className="w-full max-md:min-w-full flex max-md:flex-col max-md:justify-center max-md:items-center">
        <div className="w-[40%] max-md:w-full pr-4 flex flex-col gap-6">
          <Card className="shadow-lg !bg-slate-100">
            <Title level={5}>{t("Event Status")}</Title>
            <Progress percent={event?.usePuck ? 100 : 50} />
            <Text>
              {event && (
                <div>
                  {event?.usePuck
                    ? t("Custom page active")
                    : t("Default page active")}
                </div>
              )}
            </Text>

            <div className="w-full flex max-md:flex-col justify-end items-end mt-3 gap-3">
              <Button
                className="!bg-white !text-black !border"
                onClick={handleOpen}
              >
                {event?.usePuck
                  ? t("Return to traditional page")
                  : t("Try the event customization page")}
              </Button>

              {event?.usePuck ? (
                <Button onClick={() => router.push(`/event/${event?.id}/edit`)}>
                  {t("Edit custom page")}
                </Button>
              ) : null}
            </div>
          </Card>

          <Card className="shadow-lg !bg-slate-100 !w-full">
            <div className="flex flex-wrap justify-end items-end gap-5">
              <Button
                onClick={() => router.push(`/event/${event?.id}/preview`)}
              >
                {t("View event page")}
              </Button>
            </div>
          </Card>
        </div>

        <div className="w-[60%] max-md:w-full md:pl-4 max-md:mt-6">
          <div>
            <Card className="shadow-lg !bg-slate-100">
              <Title level={4}>{t("Exclusive Event Customization")}</Title>
              <Text>
                {t(
                  "Our platform offers an innovative feature for customizing event pages. With the integrated building tool, you can create a unique experience for your event participants. Take advantage of customizing every detail, from colors and layout to the arrangement of page elements, reflecting your event's identity and increasing audience engagement."
                )}
              </Text>
              <br />
              <Text>
                {t(
                  "Don’t want to worry about this now? No problem! Your default page is always available and can be activated with a simple click. All customization is preserved so you can enable or disable it whenever you want."
                )}
              </Text>
              <br />
              <Text strong>
                {t(
                  "Try it now and discover how to elevate your event with a fully customized page, tailored for you and your audience."
                )}
              </Text>
            </Card>
          </div>
        </div>
      </div>

      <Divider />

      <div className="p-4">
        {/* KPIs */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title={t("Total Guests reached")}
                value={
                  subscriptions.find((item) => item.event.id === id)
                    ?.subscriptions &&
                  Array.isArray(
                    subscriptions.find((item) => item.event.id === id)
                      ?.subscriptions
                  )
                    ? subscriptions
                        .find((item) => item.event.id === id)
                        ?.subscriptions.reduce(
                          (acc, subscription) => acc + subscription.amount,
                          0
                        )
                    : 0
                }
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
        <Card className="w-full max-w-3xl shadow-md">
          <h2 className="text-center text-2xl mb-4">{t("Edit Event")}</h2>
          <EventForm
            initialValues={event}
            onSubmit={async (values: EventFormType) => {
              const { name, description, date, time, location, fileHero } =
                values;

              console.log(fileHero);

              const uri = await createFileEvent(
                typeof id === "string" ? id : id[0],
                fileHero
              );

              let imageUri = event?.fileHero;

              if (uri) {
                imageUri = uri;
              }

              updateEvent(typeof id === "string" ? id : id[0], {
                name,
                description,
                date: new Date(date).toISOString(),
                time: new Date(time).toISOString(),
                location,
                fileHero: imageUri,
              });

              deleteEventFile(event?.fileHero ?? "");
            }}
          />
        </Card>
      </div>
    </div>
  );
}
