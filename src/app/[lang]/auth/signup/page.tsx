"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import useUser from "@/services/firebase/Hooks/useUser";
import { useRouter, useSearchParams } from "next/navigation";
import createUser, { CreateUserType } from "@/services/firebase/Create/user";
import { AuthErrorCodes } from "firebase/auth";
import { getTranslations, translations } from "@/services/translations";

export default function SignUpPage({ params: { lang } }: never) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailRegisterVisible, setIsEmailRegisterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect");

  const router = useRouter();

  const { user } = useUser();

  const t = getTranslations(lang, translations);

  useEffect(() => {
    if (user?.uid && !redirectTo) router.push("/adm");
    if (redirectTo) router.push(redirectTo);
  }, [user, router, redirectTo]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData: CreateUserType = {
      user: {},
      register: {
        type: "email",
        email,
        password,
      },
    };
    try {
      setLoading(true);
      await createUser(userData);
    } catch (error) {
      const err: { message: string; code: string } = error as never;

      const message = err.message;
      const code = err.code;

      let alertMessage = t("An unexpected error occurred.");

      switch (code) {
        case AuthErrorCodes["EMAIL_EXISTS"]:
          alertMessage = t("The email has already been used.");
          break;
        case AuthErrorCodes["INVALID_EMAIL"]:
          alertMessage = t("The email is invalid.");
          break;
        case AuthErrorCodes["INVALID_PASSWORD"]:
          alertMessage = t("Invalid password.");
          break;
        case AuthErrorCodes["WEAK_PASSWORD"]:
          alertMessage = t(
            "Weak password. Your password must be at least 6 characters long."
          );
          break;
        default:
          alertMessage = message; // Use a mensagem padrão do erro se não houver correspondência
          break;
      }

      alert(alertMessage);

      console.error("Error. user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const userData: CreateUserType = {
      user: {},
      register: {
        type: "google",
      },
    };
    try {
      setLoading(true);
      await createUser(userData);
    } catch (error) {
      alert(error);
      console.error("Error. user with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">SignUp</h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleSignUp}
            className={`w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            {t("Sign up with Google")}
          </button>

          <div className="text-center text-gray-500">{t("or")}</div>

          <button
            onClick={() => setIsEmailRegisterVisible(true)}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200`}
          >
            {t("Sign up with Email")}
          </button>
        </div>

        {isEmailRegisterVisible && (
          <motion.form
            onSubmit={handleEmailSignUp}
            className="space-y-4 mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Seu email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                {t("Password")}:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Sua senha"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "SignUp..." : "SignUp"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
