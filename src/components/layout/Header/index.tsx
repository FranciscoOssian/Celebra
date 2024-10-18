"use client";

import Button from "@/components/common/Button";
import { useState } from "react";
import Avatar from "@/components/common/Avatar";
import useUser from "@/services/firebase/Hooks/useUser";
import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";
import { getTranslations, translations } from "@/services/translations";
import InternalLayout from "../InternalLayout";
import Link from "next/link";

const Menu = ({
  className,
  onClick,
  isLoggedIn,
  avatar,
}: {
  className?: string;
  onClick: () => void;
  isLoggedIn: boolean;
  avatar: string;
}) => {
  const router = useRouter();

  const { lang } = useParams();

  const t = getTranslations(
    typeof lang === "string" ? lang : "en",
    translations
  );

  return (
    <nav className={`flex justify-center items-center ${className}`}>
      {!isLoggedIn ? (
        <>
          <Link
            onClick={onClick}
            href="#faq"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            FAQ
          </Link>
          <Link
            onClick={onClick}
            href="#pricing"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            {t("Pricing")}
          </Link>
          <Button
            onClick={() => {
              router.push("/auth/signin");
              onClick();
            }}
            className="bg-[#001122] text-white rounded-md px-4 py-2 hover:bg-[#002244] transition duration-300"
          >
            {t("Login")}
          </Button>
          <Button
            onClick={() => {
              router.push("/auth/signup");
              onClick();
            }}
            className="bg-[#00bfff] text-white rounded-md px-4 py-2 hover:bg-[#0099cc] transition duration-300"
          >
            {t("Signup")}
          </Button>
        </>
      ) : (
        <>
          <Link
            onClick={onClick}
            href="/dashboard"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            {t("My Events")}
          </Link>
          <Link
            onClick={onClick}
            href="/account"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            {t("Profile")}
          </Link>
          {avatar && <Avatar alt="" size={40} src={avatar} />}
          {!avatar && (
            <div className="size-10 select-none bg-slate-800 rounded-full flex justify-center items-center">
              👤
            </div>
          )}
          <Link
            onClick={() => {
              import("@/services/firebase/firebase").then(({ app }) => {
                import("firebase/auth").then(({ signOut, getAuth }) => {
                  signOut(getAuth(app));
                });
              });
            }}
            href="/"
            className="text-gray-700 mouse-pointer hover:text-[#00bfff]"
          >
            {t("Logout")}
          </Link>
        </>
      )}
    </nav>
  );
};

const SVG = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const MenuButton = ({ toggleMenu }: { toggleMenu: () => void }) => (
  <div className="md:hidden">
    <button onClick={toggleMenu} className="text-[#001122] focus:outline-none">
      <SVG />
    </button>
  </div>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <InternalLayout>
      <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-3xl font-bold text-[#001122]">
            <Link href="/">Celebra</Link>
          </div>
          <MenuButton toggleMenu={toggleMenu} />
          <Menu
            onClick={toggleMenu}
            className="hidden md:flex gap-6"
            isLoggedIn={!!user.uid}
            avatar={user.photoURL ?? ""}
          />
        </div>
        <Menu
          onClick={toggleMenu}
          className={`md:hidden ${
            isOpen ? "block" : "hidden"
          } flex !justify-start !items-start gap-8 flex-col p-4 w-1/2 h-[100vh]`}
          isLoggedIn={!!user.uid}
          avatar={user.photoURL ?? ""}
        />
      </header>
      <div className="h-[68px]"></div>
    </InternalLayout>
  );
}
