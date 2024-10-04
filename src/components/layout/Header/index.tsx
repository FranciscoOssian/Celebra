"use client";

import Button from "@/components/common/Button";
import { useState } from "react";
import Avatar from "@/components/common/Avatar";
import useUser from "@/services/firebase/Hooks/useUser";
import { useRouter } from "next/navigation";

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

  return (
    <nav className={`flex justify-center items-center ${className}`}>
      {!isLoggedIn ? (
        <>
          <a
            onClick={onClick}
            href="#faq"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            FAQ
          </a>
          <a
            onClick={onClick}
            href="#pricing"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            Pricing
          </a>
          <Button
            onClick={() => {
              router.push("/auth/register");
              onClick();
            }}
            className="bg-[#001122] text-white rounded-md px-4 py-2 hover:bg-[#002244] transition duration-300"
          >
            Login
          </Button>
          <Button
            onClick={() => {
              router.push("/auth/register");
              onClick();
            }}
            className="bg-[#00bfff] text-white rounded-md px-4 py-2 hover:bg-[#0099cc] transition duration-300"
          >
            Cadastrar
          </Button>
        </>
      ) : (
        <>
          <a
            onClick={onClick}
            href="/dashboard"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            Meus eventos
          </a>
          <a
            onClick={onClick}
            href="/account"
            className="text-gray-700 hover:text-[#00bfff]"
          >
            Perfil
          </a>
          <Avatar alt="" size={40} src={avatar} />
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
    <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-3xl font-bold text-[#001122]">
          <a href="/">Celebra</a>
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
  );
}
