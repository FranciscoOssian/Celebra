import { supportedLanguages } from "@/services/translations";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useId, useEffect } from "react";
import Button from "../Button";

const SearchBar = ({ className }: { className?: string }) => {
  const [searchTerm, setSearchTerm] = useState("");

  //const handleClear = () => {
  //  setSearchTerm("");
  //};

  return (
    <div
      className={`
        flex items-center border-none rounded-xl px-4 py-2 bg-[#F0F0F0] shadow-sm w-full h-fit ${className}`}
    >
      {/* Ícone de Search */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m1.42-5.37a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
        />
      </svg>

      {/* Input de texto */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none text-sm"
      />
    </div>
  );
};

export interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
  childrenClassName?: string;
  children?: NavItem[];
}

function hasHref(items: NavItem[], href: string): boolean {
  return items.some((item) => {
    if (item.href === href) {
      return true;
    }

    // Se o item tem filhos, percorre-os recursivamente
    if (item.children) {
      return hasHref(item.children, href);
    }

    return false;
  });
}

const TreeNav = ({
  items,
  selected,
  setSelected,
  id,
  level = 0,
}: {
  items: NavItem[];
  selected: string;
  setSelected: (s: string) => void;
  id: string;
  level?: number;
}) => {
  return (
    <nav>
      <ul className="flex flex-col gap-3">
        <AnimatePresence>
          {items.map(({ href, label, icon, children, childrenClassName }) => (
            <li key={href} className="relative">
              <Link
                href={href}
                onClick={() => setSelected(href)}
                className="relative"
              >
                {selected === href && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId={id}
                    className="absolute inset-0 bg-slate-300 w-full h-full rounded-md z-0" // Fundo com z-0
                  />
                )}
                <div
                  style={{
                    fontSize: `${16 - level * 3}px`,
                    marginTop: `${4 - level < 0 ? 0 : 4 - level}px`,
                    gap: `${12 / (level + 1)}px`,
                  }}
                  className="relative z-10 flex items-center px-2"
                >
                  <div className="flex-shrink-0">{icon}</div> {label}
                </div>
              </Link>
              {children &&
                children.length > 0 &&
                (selected === href || hasHref(children, selected)) && (
                  <div
                    className={`ml-4 pl-2 border-l border-gray-200 ${childrenClassName}`}
                  >
                    <TreeNav
                      items={children}
                      selected={selected}
                      setSelected={setSelected}
                      id={id}
                      level={level + 1}
                    />
                  </div>
                )}
            </li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
};

const SideBar = ({
  navItems,
  secondaryNavItems,
  className = "",
}: {
  navItems: NavItem[];
  secondaryNavItems: NavItem[];
  className?: string;
}) => {
  const pathname = usePathname();

  const path = useMemo(
    () =>
      "/" +
      pathname
        .split("/")
        .filter((i) => i !== "")
        .filter((p) => !supportedLanguages.includes(p))
        .join("/"),
    [pathname]
  );

  const [selected, setSelected] = useState(path);
  const id = useId();

  useEffect(() => {
    setSelected(path);
  }, [path]);

  return (
    <ul
      className={`pb-7 flex flex-col justify-between gap-4 w-[166px] max-md:w-[125px] h-full ${className}`}
    >
      <li className="max-md:order-2 flex flex-col gap-4">
        <h2>Celebra</h2>
        <SearchBar />
        <TreeNav
          selected={selected}
          items={navItems}
          setSelected={setSelected}
          id={id}
        />
        <Button
          href="/adm/createEvent"
          className="flex items-center gap-3 w-full max-md:gap-0"
        >
          <PlusIcon className="size-4" /> Criar Evento
        </Button>
      </li>
      <li className="max-md:order-1">
        <TreeNav
          items={secondaryNavItems}
          selected={selected}
          setSelected={setSelected}
          id={id}
        />
      </li>
    </ul>
  );
};

export default SideBar;
