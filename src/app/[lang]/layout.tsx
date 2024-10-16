import { ReactNode } from "react";
import { Metadata } from "next";
import { getTranslations, translations } from "@/services/translations";

interface LayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { lang } = params;

  const t = getTranslations(lang, translations);

  const metadata: Metadata = {
    title: "Celebra",
    description: t("Celebra - Organize your events easily"),
    alternates: {
      languages: {
        en: "http://celebra.foln.dev/en",
        "pt-BR": "http://celebra.foln.dev/pt-BR",
      },
    },
  };

  return metadata;
}

export default function Layout({ children /*params*/ }: LayoutProps) {
  //const { lang } = params;
  return children;
}
