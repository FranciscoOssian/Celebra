"use client";

import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import useUser from "@/services/firebase/Hooks/useUser";
import { useRouter } from "next/navigation";
import {
  getAuth,
  deleteUser,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const { user } = useUser();
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const avatar = user?.photoURL;

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
        "Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita."
      );

      if (confirmation) {
        try {
          await deleteUserEvents(); // Deleta os eventos do usuário
          await deleteUserDoc(); // Deleta o documento do usuário
          await deleteUser(auth.currentUser); // Deleta a conta do usuário
          alert("Conta, eventos e documento do usuário deletados com sucesso.");
          router.push("/auth/signin");
        } catch (error) {
          console.error("Erro ao deletar conta ou eventos/documento:", error);
          alert(
            "Erro ao deletar a conta. Faça login novamente e tente de novo."
          );
        }
      } else {
        alert("Ação de deletar conta cancelada.");
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
      alert("Erro ao sair da conta.");
    }
  };

  const handleChangePassword = async () => {
    if (auth.currentUser?.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        alert("E-mail de redefinição de senha enviado.");
      } catch (error) {
        console.error("Erro ao mudar senha:", error);
        alert("Erro ao enviar o e-mail de redefinição de senha.");
      }
    }
  };

  return (
    <div className="mt-40 flex justify-center items-center gap-2 text-2xl flex-col">
      {avatar && <Avatar alt="" size={200} src={avatar} />}
      {!avatar && (
        <div className="size-48 select-none bg-slate-800 rounded-full text-8xl flex justify-center items-center">
          👤
        </div>
      )}
      <div>{user?.displayName}</div>
      <div>{user?.email}</div>
      <div className="mt-3 flex flex-col justify-center items-center gap-5">
        <Button onClick={handleDeleteAccount}>Deletar conta</Button>
        <Button onClick={handleSignOut}>Sair da conta</Button>
        <Button onClick={handleChangePassword}>Mudar senha</Button>
      </div>
    </div>
  );
}
