import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

async function getDownloadURLFromStorage(eventId: string, fileName: string) {
  const storage = getStorage(app);
  const fileRef = ref(storage, `Events/${eventId}/${fileName}`);
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Erro ao obter a URL de download:", error);
    throw error;
  }
}

export default getDownloadURLFromStorage;
