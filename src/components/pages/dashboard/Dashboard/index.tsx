import SideBar, { NavItem } from "@/components/common/SideBar";
import useDeviceType from "@/hooks/useDeviceType";
import { supportedLanguages } from "@/services/translations";
import { Breadcrumb } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Dashboard({
  navItems,
  secondaryNavItems,
  children,
}: {
  navItems: NavItem[];
  secondaryNavItems: NavItem[];
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const deviceType = useDeviceType();

  const paths = pathname
    .split("/")
    .filter((p) => p !== "")
    .filter((p) => !supportedLanguages.includes(p));

  const breadcrumbItems = paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    return { title: path, href };
  });
  return (
    <motion.div
      initial={{ gap: "0.5rem", paddingLeft: "0.75rem" }}
      animate={{
        gap: sidebarOpen ? "0.5rem" : "0rem",
        paddingLeft: sidebarOpen ? "0.75rem" : "0rem",
      }}
      className={`flex h-dvh bg-[#F7F7F7]`}
    >
      {/* Sidebar */}
      <motion.div
        className="mt-3 overflow-hidden"
        initial={{ width: "auto" }}
        animate={{ width: sidebarOpen ? "auto" : "0px" }} // Anima para a largura total e visível
        transition={{ duration: 0.3, type: "keyframes", stiffness: 300 }} // Duração e tipo de transição
      >
        <SideBar navItems={navItems} secondaryNavItems={secondaryNavItems} />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{
          borderTopLeftRadius: "1.5rem",
          borderBottomLeftRadius: "1.5rem",
        }}
        animate={{
          borderTopLeftRadius: sidebarOpen ? "1.5rem" : "0px",
          borderBottomLeftRadius: sidebarOpen ? "1.5rem" : "0px",
        }}
        className="flex-1 overflow-y-scroll bg-white shadow-md"
      >
        <div
          className={`flex justify-start items-center p-3 gap-3 ${
            deviceType === "mobile"
              ? "fixed bottom-0 w-full h-8"
              : "sticky top-0 rounded-3xl"
          } bg-white z-50`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            onClick={() => setSidebarOpen((p) => !p)}
            className={`size-5 cursor-pointer ${!sidebarOpen && "rotate-180"}`}
          >
            <path
              fillRule="evenodd"
              d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
              clipRule="evenodd"
            />
          </svg>
          <Breadcrumb
            items={breadcrumbItems.map((i) => ({
              title: (
                <Link href={i.href}>
                  {i.title === "adm" ? "dashboard" : i.title}
                </Link>
              ),
            }))}
          />
        </div>
        <div className="max-md:mt-3">{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
