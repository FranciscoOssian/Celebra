"use client";

import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import useUser from "@/services/firebase/Hooks/useUser";
import { useParams, useRouter } from "next/navigation";
import {
  getAuth,
  deleteUser,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { getTranslations, translations } from "@/services/translations";

export default function Home() {
  const { user } = useUser();
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const avatar = user?.photoURL;
  const { lang } = useParams();
  const t = getTranslations(
    typeof lang === "string" ? lang : lang[0],
    translations
  );

  // Função para deletar todos os eventos do usuário
  const deleteUserEvents = async () => {
    if (user?.events && user.events.length > 0) {
      try {
        const eventDeletions = user.events.map((eventId: string) =>
          deleteDoc(doc(db, "Events", eventId))
        );
        await Promise.all(eventDeletions); // Espera deletar todos os eventos
        console.log("Eventos deletados com sucesso.");
      } catch (error) {
        console.error("Erro ao deletar eventos:", error);
        throw new Error("Erro ao deletar eventos."); // Propaga o erro se não conseguir deletar eventos
      }
    }
  };

  // Função para deletar o documento do usuário na coleção 'Users'
  const deleteUserDoc = async () => {
    if (user?.uid) {
      try {
        await deleteDoc(doc(db, "Users", user.uid)); // Deleta o documento do usuário
        console.log("Documento do usuário deletado com sucesso.");
      } catch (error) {
        console.error("Erro ao deletar documento do usuário:", error);
        throw new Error("Erro ao deletar documento do usuário.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (auth.currentUser) {
      const confirmation = window.confirm(
        t(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      );

      if (confirmation) {
        try {
          await deleteUserEvents(); // Deleta os eventos do usuário
          await deleteUserDoc(); // Deleta o documento do usuário
          await deleteUser(auth.currentUser); // Deleta a conta do usuário
          alert(t("Account, events, and user documents deleted successfully."));
          router.push("/auth/signin");
        } catch (error) {
          console.error("Erro ao deletar conta ou eventos/documento:", error);
          alert(
            t("Error deleting the account. Please log in again and try again.")
          );
        }
      } else {
        alert(t("Account deletion action canceled."));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Saiu da conta.");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert(t("Error logging out of the account."));
    }
  };

  const handleChangePassword = async () => {
    if (auth.currentUser?.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        alert(t("Password reset email sent."));
      } catch (error) {
        console.error("Erro ao mudar senha:", error);
        alert(t("Error sending the password reset email."));
      }
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 text-2xl flex-col">
      {avatar && <Avatar alt="" size={200} src={avatar} />}
      {!avatar && (
        <div className="size-48 select-none bg-slate-800 rounded-full text-8xl flex justify-center items-center">
          👤
        </div>
      )}
      <div>{user?.displayName}</div>
      <div>{user?.email}</div>
      <div className="mt-3 flex flex-col justify-center items-center gap-5">
        <Button onClick={handleDeleteAccount}>{t("Delete account")}</Button>
        <Button onClick={handleSignOut}>{t("Log out of the account")}</Button>
        <Button onClick={handleChangePassword}>{t("Change password")}</Button>
      </div>
    </div>
  );
}
