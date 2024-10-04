import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { app, db } from "../firebase";
import { doc } from "firebase/firestore";
import { User as U } from "firebase/auth";
import { UserType } from "@/types/user";

const auth = getAuth(app);

type User = U & UserType;

const useUser = () => {
  const [user, loading, error] = useAuthState(auth);

  // Hook para escutar as mudanças no documento do Firestore
  const userDocRef = user ? doc(db, "Users", user.uid) : null;
  const [fireUser, fireUserLoading, fireUserError] =
    useDocumentData(userDocRef);

  const combinedUser = { ...user, ...(fireUser || {}) };

  return {
    user: combinedUser as User,
    loading: loading || fireUserLoading,
    error: error || fireUserError,
  };
};

export default useUser;
