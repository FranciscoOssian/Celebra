"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import useUser from "@/services/firebase/Hooks/useUser";
import { useRouter } from "next/navigation";
import { app } from "@/services/firebase/firebase";
import { useSearchParams } from "next/navigation";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getTranslations, translations } from "@/services/translations";
import { doesDocExist } from "@/services/firebase/utils";
import createEmptyDoc from "@/services/firebase/Create/emptyDoc";

export default function SignInPage({ params: { lang } }: never) {
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
    if (user?.uid && redirectTo) router.push(redirectTo);
  }, [user, router, redirectTo]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );

      if (!(await doesDocExist("Users", credential.user.uid))) {
        await createEmptyDoc("Users", credential.user.uid);
      }
      signOut(getAuth(app));
    } catch (error) {
      alert(error);
      console.error("Error. user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const credential = await signInWithPopup(
        getAuth(app),
        new GoogleAuthProvider()
      );
      if (!(await doesDocExist("Users", credential.user.uid))) {
        await createEmptyDoc("Users", credential.user.uid);
      }
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
        <h1 className="text-2xl font-bold mb-6 text-center">SignIn</h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className={`w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            {t("Sign in with Google")}
          </button>

          <div className="text-center text-gray-500">{t("or")}</div>

          <button
            onClick={() => setIsEmailRegisterVisible(true)}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200`}
          >
            {t("Sign in with Email")}
          </button>
        </div>

        {isEmailRegisterVisible && (
          <motion.form
            onSubmit={handleEmailSignIn}
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
                placeholder={t("Your password")}
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
              {loading ? "SignIn..." : "SignIn"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
