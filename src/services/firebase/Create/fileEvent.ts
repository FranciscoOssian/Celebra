import { UploadFile } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const createFileEvent = async (id: string, file: UploadFile) => {
  if (!file.originFileObj) {
    return;
  }
  const storageRef = ref(storage, `Events/${id}/${file.name}`);
  await uploadBytes(storageRef, file.originFileObj);
  const url = await getDownloadURL(storageRef);
  return url;
};

export default createFileEvent;
