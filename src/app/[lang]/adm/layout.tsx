"use client";

import {
  ChartBarIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Dashboard from "@/components/pages/dashboard/Dashboard";
import React, { useMemo } from "react";
import { AppProvider, useAppContext } from "./context";
import { ArrowTurnDownRightIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { getTranslations, translations } from "@/services/translations";

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { lang } = useParams();
  const { subscriptions } = useAppContext();

  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  const navItems = useMemo(
    () => [
      {
        href: "/adm",
        label: "DashBoard",
        icon: <ChartBarIcon className="size-4" />,
      },
      {
        href: "/adm/events",
        label: t("Events"),
        icon: <CalendarIcon className="size-4" />,
        childrenClassName: "max-h-40 overflow-auto scrollbar-custom",

        children: subscriptions.map((e) => ({
          label: e.event.name,
          href: `/adm/events/${e.event.id}`,
          icon: <ArrowTurnDownRightIcon className="size-4" />,
        })),
      },
    ],
    [lang, subscriptions, t]
  );

  const secondaryNavItems = useMemo(
    () => [
      {
        label: t("Help Center"),
        href: "/adm/help",
        icon: <QuestionMarkCircleIcon className="size-4" />,
      },
      {
        label: t("Notifications"),
        href: "/adm/notifications",
        icon: <BellIcon className="size-4" />,
      },
      {
        label: t("Profile"),
        href: "/adm/profile",
        icon: <UserIcon className="size-4" />,
      },
    ],
    [lang, t]
  );

  return (
    <Dashboard navItems={navItems} secondaryNavItems={secondaryNavItems}>
      {children}
    </Dashboard>
  );
}

export default function WithAppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <RootLayout>{children}</RootLayout>
    </AppProvider>
  );
}
