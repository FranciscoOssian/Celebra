"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import useUser from "@/services/firebase/Hooks/useUser";
import { useRouter } from "next/navigation";
import createUser, { CreateUserType } from "@/services/firebase/Create/user";
import { AuthErrorCodes } from "firebase/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailRegisterVisible, setIsEmailRegisterVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { user } = useUser();
  useEffect(() => {
    if (user?.uid) router.push("/dashboard");
  }, [user, router]);

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

      let alertMessage = "Ocorreu um erro inesperado.";

      switch (code) {
        case AuthErrorCodes["EMAIL_EXISTS"]:
          alertMessage = "O e-mail já usado.";
          break;
        case AuthErrorCodes["INVALID_EMAIL"]:
          alertMessage = "O email é inválido";
          break;
        case AuthErrorCodes["INVALID_PASSWORD"]:
          alertMessage = "Senha inválida";
          break;
        case AuthErrorCodes["WEAK_PASSWORD"]:
          alertMessage =
            "Senha fraca, sua senha deve ter no mínimo 6 caracteres";
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
        <h1 className="text-2xl font-bold mb-6 text-center">SignIn</h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleSignUp}
            className={`w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            SignIn com Google
          </button>

          <div className="text-center text-gray-500">ou</div>

          <button
            onClick={() => setIsEmailRegisterVisible(true)}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200`}
          >
            SignIn com Email
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
                Senha:
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
              {loading ? "SignIn..." : "SignIn"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
