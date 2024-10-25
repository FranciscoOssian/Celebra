"use client";

import { Row, Col, Card, Statistic, Table } from "antd";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useAppContext } from "./context";
import Title from "antd/es/typography/Title";
import {
  calculateTotalTickets,
  calculateTotalTicketsForEvent,
} from "@/services/firebase/Read/totalTickets";
import { formatDayMonth } from "@/utils/time";
import { getTranslations, translations } from "@/services/translations";
import { useParams } from "next/navigation";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const Page = () => {
  const { subscriptions, user } = useAppContext();
  const { lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  return (
    <div className="p-4">
      <Title>
        {t("Welcome")} {user?.user?.displayName}
      </Title>
      {/* KPIs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={t("Total Events")}
              value={subscriptions.length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={t("Total Guests reached")}
              value={calculateTotalTickets(subscriptions)}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={t("Average guests per event")}
              value={
                subscriptions.length
                  ? parseInt(
                      `${
                        calculateTotalTickets(subscriptions) /
                        subscriptions.length
                      }`
                    )
                  : 0
              }
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráfico de pizza para status dos convidados */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={12} md={12}>
          <Card title={t("Guest ratio per event")}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptions.map((sub) => ({
                    name: sub.event.name,
                    value: calculateTotalTicketsForEvent(
                      sub.event.id,
                      subscriptions
                    ),
                  }))}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12}>
          <Card title={t("Upcoming Events")}>
            <Table
              columns={[
                { title: t("Event"), dataIndex: "event", key: "event" },
                { title: t("Date"), dataIndex: "date", key: "date" },
              ]}
              dataSource={subscriptions
                .sort(
                  (a, b) =>
                    new Date(b.event.date).getTime() -
                    new Date(a.event.date).getTime()
                )
                .slice(0, 3)
                .map((sub, i) => ({
                  key: i,
                  event: sub.event.name,
                  date: formatDayMonth(new Date(sub.event.date)),
                }))}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;
