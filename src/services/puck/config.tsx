import { DropZone } from "@measured/puck";
import "@measured/puck/puck.css";
import { Typography } from "antd";
import Title from "antd/es/typography/Title";
import Image from "next/image";
import SwitchCustom, {
  SwitchCustomPropsType,
} from "@/components/Punk/SwitchCustom";
import UploadCustom, { UploadCustomPropsType } from "@/components/Punk/Upload";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Button from "@/components/common/Button";
import { motion } from "framer-motion";
import SubscribeButton from "@/components/common/SubscribeButton";
import ShowTicketReceipt from "@/components/common/ShowTicketReceipt";

const createMotionField = (label: string): any => ({
  label,
  type: "object",
  objectFields: {
    opacity: { type: "number", defaultValue: 1 },
    x: { type: "number", defaultValue: 0 },
    y: { type: "number", defaultValue: 0 },
    scale: { type: "number", defaultValue: 1 },
    rotate: { type: "number", defaultValue: 0 },
  },
});

const motionProps = {
  initial: createMotionField("Initial State"),
  animate: createMotionField("Animate State"),
  exit: createMotionField("Exit State"),
  whileHover: createMotionField("While Hover"),
  whileTap: createMotionField("While Tap"),
};

const getMotionProps = (obj: any) => {
  const { initial, animate, exit, whileHover, whileTap } = obj;
  return {
    initial,
    animate,
    exit,
    whileHover,
    whileTap,
  };
};

export const initialData = {
  blocks: [],
  root: {
    props: {
      title: "",
    },
  },
  content: [],
  zones: {},
};

export const puckConfig = {
  categories: {
    typography: {
      components: ["HeadingBlock", "ParagraphBlock"],
      defaultExpanded: false,
      title: "Typography", // call here to in future trasnlate
    },
    Elements: {
      components: ["ButtonBlock", "ImageBlock"],
      defaultExpanded: false,
      title: "Elements",
    },
    Layout: {
      components: ["Flex"],
      defaultExpanded: false,
      title: "Layout",
    },
    ActionButtons: {
      components: ["SubscribeButton", "ShowTicketReceipt"],
      defaultExpanded: true,
      title: "Action Buttons",
    },
  },
  components: {
    // Títulos (Typography)
    HeadingBlock: {
      label: "Título",
      fields: {
        children: { label: "Texto", type: "text" },
        level: {
          label: "Nível do Título",
          type: "select",
          options: [
            { label: "H1", value: 1 },
            { label: "H2", value: 2 },
            { label: "H3", value: 3 },
            { label: "H4", value: 4 },
          ],
          defaultValue: 1,
        },
        ...motionProps,
      },
      render: ({
        children,
        level,
        ...rest
      }: {
        children: string;
        level: 1 | 2 | 3 | 4;
      }) => {
        return (
          <motion.div {...getMotionProps(rest)}>
            <Title level={level}>{children}</Title>
          </motion.div>
        );
      },
    },

    // Parágrafos (Typography)
    ParagraphBlock: {
      label: "Parágrafo",
      fields: {
        children: { label: "Texto", type: "text" },
        className: {
          label: "classes",
          type: "text",
        },
        ...motionProps,
      },
      render: ({
        children,
        className,
        ...rest
      }: {
        children: string;
        className: string;
      }) => {
        return (
          <motion.div {...getMotionProps(rest)}>
            <Typography.Paragraph className={className}>
              {children}
            </Typography.Paragraph>
          </motion.div>
        );
      },
    },

    // Botões (Button)
    ButtonBlock: {
      label: "Botão",
      fields: {
        text: { label: "Texto", type: "text" },
        type: {
          label: "Tipo do Botão",
          type: "select",
          options: [
            { label: "Primário", value: "primary" },
            { label: "Secundário", value: "default" },
            { label: "Link", value: "link" },
          ],
          defaultValue: "primary",
        },
        link: {
          label: "Link do Botão",
          type: "text",
        },
        ...motionProps,
      },
      render: ({
        text,
        link,
        ...rest
      }: {
        text: string;
        type: "primary" | "default" | "link";
        link: string;
      }) => {
        return (
          <div {...getMotionProps(rest)}>
            <Button href={link}>{text}</Button>
          </div>
        );
      },
    },

    // Imagem (Next.js Image)
    ImageBlock: {
      label: "Imagem",
      resolveFields: () => {
        const fields = {
          src: {
            label: "Imagem",
            type: "custom",
            render: ({ onChange, value }: UploadCustomPropsType) => (
              <UploadCustom
                Icon={() => <PhotoIcon className="size-5" />}
                name="Imagem"
                value={value}
                onChange={onChange}
              />
            ),
          },
          alt: { label: "Texto Alternativo", type: "text" },
          width: { label: "Largura", type: "number" },
          height: { label: "Altura", type: "number" },
          priority: {
            label: "Prioritária",
            type: "custom",
            render: ({ name, onChange, value }: SwitchCustomPropsType) => (
              <SwitchCustom name={name} onChange={onChange} value={value} />
            ),
          },
          ...motionProps,
        };

        return fields;
      },
      render: ({
        src = "",
        alt,
        width = 400,
        height = 400,
        priority,
        ...rest
      }: {
        src: string;
        alt: string;
        width: number;
        height: number;
        priority: boolean;
      }) => {
        return (
          <motion.div {...getMotionProps(rest)}>
            <Image
              src={
                src !== ""
                  ? src
                  : "data:image/jpeg;base64,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"
              }
              alt={alt}
              width={width}
              height={height}
              priority={priority}
            />
          </motion.div>
        );
      },
    },

    Flex: {
      label: "Flex",
      fields: {
        flexDirection: {
          label: "Flex Direction",
          type: "radio",
          options: [
            { label: "Row", value: "row" },
            { label: "Row Reverse", value: "row-reverse" },
            { label: "Column", value: "column" },
            { label: "Column Reverse", value: "column-reverse" },
          ],
        },
        justifyContent: {
          label: "Justify Content",
          type: "select",
          options: [
            { label: "Flex Start", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Space Between", value: "space-between" },
            { label: "Space Around", value: "space-around" },
            { label: "Space Evenly", value: "space-evenly" },
          ],
        },
        alignItems: {
          label: "Align Items",
          type: "select",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Flex Start", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Flex End", value: "flex-end" },
            { label: "Baseline", value: "baseline" },
          ],
        },
        flexWrap: {
          label: "Wrap",
          type: "radio",
          options: [
            { label: "No Wrap", value: "nowrap" },
            { label: "Wrap", value: "wrap" },
            { label: "Wrap Reverse", value: "wrap-reverse" },
          ],
        },
        alignContent: {
          label: "Align Content",
          type: "select",
          options: [
            { label: "Flex Start", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Flex End", value: "flex-end" },
            { label: "Space Between", value: "space-between" },
            { label: "Space Around", value: "space-around" },
            { label: "Stretch", value: "stretch" },
          ],
        },
        gap: {
          label: "Gap",
          type: "number",
          defaultValue: 0,
        },
        flexGrow: {
          label: "Flex Grow",
          type: "number",
          defaultValue: 0,
        },
        flexShrink: {
          label: "Flex Shrink",
          type: "number",
          defaultValue: 1,
        },
        flexBasis: {
          label: "Flex Basis",
          type: "text",
          defaultValue: "auto",
        },
        order: {
          label: "Order",
          type: "number",
          defaultValue: 0,
        },
        ...motionProps,
      },
      render: (props: any) => {
        const flexStyles = {
          display: "flex",
          flexDirection: props.flexDirection,
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          flexWrap: props.flexWrap,
          alignContent: props.alignContent,
          gap: `${props.gap}px`,
          flexGrow: props.flexGrow,
          flexShrink: props.flexShrink,
          flexBasis: props.flexBasis,
          order: props.order,
          height: "fit-content",
        };

        return (
          <motion.div
            style={flexStyles}
            initial={props.initial}
            animate={props.animate}
            exit={props.exit}
            whileHover={props.whileHover}
            whileTap={props.whileTap}
            id="flex"
          >
            <DropZone style={flexStyles} zone="Flex" />
          </motion.div>
        );
      },
    },

    SubscribeButton: {
      label: "Subscribe Button",
      fields: {
        eventId: {
          label: "Event Id",
          type: "text",
        },
        ...motionProps,
      },
      render: ({ eventId, ...rest }: any) => {
        return (
          <motion.div {...getMotionProps(rest)}>
            <SubscribeButton eventId={eventId} />
          </motion.div>
        );
      },
    },

    ShowTicketReceipt: {
      label: "Show TicketReceipt Button",
      fields: {
        ...motionProps,
      },
      render: ({ ...rest }: any) => {
        return (
          <motion.div {...getMotionProps(rest)}>
            <ShowTicketReceipt />
          </motion.div>
        );
      },
    },
  },
};
