import { db, storage, app } from "../firebase";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { ref, deleteObject, listAll } from "firebase/storage";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export default async function deleteEvent(eventId: string) {
  await deleteDoc(doc(db, "Events", eventId));

  const folderRef = ref(storage, `Events/${eventId}`);
  const list = await listAll(folderRef);
  const deletePromises = list.items.map((fileRef) => deleteObject(fileRef));
  await Promise.all(deletePromises);

  const userId = auth.currentUser?.uid;
  if (userId) {
    const userDocRef = doc(db, "Users", userId);
    await updateDoc(userDocRef, {
      events: arrayRemove(eventId),
    });
  }
}
