import { app, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export interface CreateUserType {
  user: Record<string, unknown>;
  register: {
    type: "email" | "google";
    email?: string;
    password?: string;
  };
}

export default async function createUser(userData: CreateUserType) {
  signOut(auth);

  let uid;

  const { register } = userData;

  // Registro com email e senha
  if (register.type === "email" && register.email && register.password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        register.email,
        register.password
      );
      uid = userCredential.user.uid;
    } catch (error) {
      console.error("Error creating user with email:", error);
      throw new Error("User registration with email failed.");
    }
  }
  // Registro com Google
  else if (register.type === "google") {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      uid = userCredential.user.uid;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw new Error("User registration with Google failed.");
    }
  }

  if (!uid) return;

  return setDoc(doc(db, "Users", uid), {
    ...userData.user,
  });
}
