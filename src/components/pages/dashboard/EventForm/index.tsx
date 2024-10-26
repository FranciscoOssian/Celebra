"use client";

import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Upload,
  UploadFile,
  UploadProps,
  Image as ImageAntd,
} from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import { getBase64 } from "@/utils";
import { EventType } from "@/types/Event";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { getTranslations, translations } from "@/services/translations";

export type EventFormType = Omit<
  EventType,
  "createdAt" | "puckData" | "usePuck" | "fileHero"
> & {
  fileHero: UploadFile;
};

interface EventFormProps {
  initialValues?: Omit<EventFormType, "fileHero"> & { fileHero: string };
  onSubmit: (values: EventFormType) => Promise<void>;
}

const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<boolean>(false);

  const { lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  useEffect(() => {
    if (initialValues) {
      const { date, time, fileHero, ...rest } = initialValues;
      console.log(date, time);
      const formattedInitialValues = {
        ...rest,
      };
      form.setFieldsValue(formattedInitialValues);
      if (fileHero) {
        setFileList([
          {
            uid: "-1", // Um UID único para o arquivo
            name: "hero-image.png", // Nome fictício
            status: "done", // O status do upload
            url: fileHero, // A URL da imagem
          },
        ]);
      }
    }
  }, [form, initialValues]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values: EventFormType) => {
    setLoading(true);
    setDone(false);
    try {
      await onSubmit({ ...values, fileHero: fileList[0] });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Você pode adicionar uma notificação de erro aqui, se quiser.
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  return (
    <div>
      {previewImage && (
        <ImageAntd
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Upload da Imagem Hero do Evento */}
        <Form.Item label={t("Event Image (Hero)")} valuePropName="fileList">
          <Upload
            name="hero"
            listType="picture-card"
            showUploadList
            beforeUpload={() => false}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={() => {}}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <UploadOutlined />
                <p className="mt-2">{t("Click to upload")}</p>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Campos do Evento */}
        <Form.Item
          name="name"
          label="Nome do Evento"
          rules={[
            { required: true, message: "Por favor insira o nome do evento" },
          ]}
        >
          <Input
            prefix={<FileTextOutlined />}
            placeholder={t("Eg: Birthday Party")}
          />
        </Form.Item>

        <Form.Item
          name="date"
          initialValue={dayjs(initialValues?.date)}
          label={t("Event Date")}
          rules={
            !initialValues?.date
              ? [
                  {
                    required: true,
                    message: t("Please select the event date"),
                  },
                ]
              : []
          }
        >
          <DatePicker
            defaultValue={dayjs(initialValues?.date)}
            className="w-full"
            placeholder={t("Select the date")}
          />
        </Form.Item>

        <Form.Item
          name="time"
          label={t("Event Time")}
          initialValue={dayjs(initialValues?.time)}
          rules={
            !initialValues?.time
              ? [
                  {
                    required: true,
                    message: t("Please select the event time"),
                  },
                ]
              : []
          }
        >
          <TimePicker
            defaultValue={dayjs(initialValues?.time)}
            className="w-full"
            placeholder={t("Select the time")}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label={t("Event Location")}
          rules={[
            { required: true, message: t("Please enter the event location") },
          ]}
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder={t("Eg: Rua das Flores, 123")}
          />
        </Form.Item>

        <Form.Item name="description" label={t("Event Description")}>
          <Input.TextArea
            rows={4}
            placeholder={t("Describe the event here...")}
          />
        </Form.Item>

        <Form.Item>
          <Button done={done} type="submit" loading={loading}>
            {initialValues ? t("Edit Event") : t("Create Event")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EventForm;
