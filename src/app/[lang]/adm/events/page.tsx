"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Table, Button, Popconfirm, Typography, Input } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useAppContext } from "../context";
import { EventType } from "@/types/Event";
import { motion } from "framer-motion";
import Link from "next/link";
import deleteEvent from "@/services/firebase/Delete/event";
import { getTranslations, translations } from "@/services/translations";
import { useParams } from "next/navigation";

const { Title } = Typography;
const { Search } = Input;

const App: React.FC = () => {
  const { subscriptions } = useAppContext();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const onHandleDeleteEvent = useCallback((id: string) => {
    deleteEvent(id);
  }, []);

  const filteredData = useMemo(
    () =>
      subscriptions
        .filter(({ event }) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((sub) => ({ ...sub.event })),
    [subscriptions, searchTerm]
  );

  const { lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  const columns: TableProps<EventType>["columns"] = useMemo(
    () => [
      {
        title: t("Events"),
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <Link href={"/adm/events/" + record.id}>{text}</Link>
        ),
      },
      {
        title: t("Date and Time"),
        dataIndex: "date",
        key: "date",
        render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"), // Converte string para formato de data
      },
      {
        title: t("Actions"),
        key: "action",
        render: (_, record) => (
          <div className="flex space-x-2">
            <Popconfirm
              title="Tem certeza que deseja excluir este evento?"
              onConfirm={() => onHandleDeleteEvent(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button type="link">Excluir</Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [onHandleDeleteEvent, lang]
  );

  return (
    <div className="w-full px-10 pb-10">
      <Title level={4} className="mb-4">
        {t("Event Management")} ({filteredData.length})
      </Title>
      <div className="flex justify-between mb-4">
        <Search
          placeholder={t("Search for events...")}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      {filteredData.length === 0 && (
        <div className="text-center text-gray-500">{t("No events found.")}</div>
      )}
      {filteredData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: "0", maxHeight: "200000000px" }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="min-w-3 border rounded-lg overflow-hidden shadow-md"
        >
          <Table<EventType>
            columns={columns}
            dataSource={filteredData as unknown as readonly EventType[]}
            pagination={false}
            scroll={{ x: "max-content" }} // Rolagem horizontal
            rowClassName={(_record, index) =>
              `hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-100" : ""}`
            }
          />
        </motion.div>
      )}
    </div>
  );
};

export default App;
