import { storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";

export default async function deleteEventFile(fileUrl: string) {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch {}
}
