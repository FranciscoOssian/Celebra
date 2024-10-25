import { db, storage } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject, listAll } from "firebase/storage";

export default async function deleteEvent(eventId: string) {
  await deleteDoc(doc(db, "Events", eventId));

  const folderRef = ref(storage, `Events/${eventId}`);

  const list = await listAll(folderRef);
  const deletePromises = list.items.map((fileRef) => deleteObject(fileRef));

  await Promise.all(deletePromises);
}
