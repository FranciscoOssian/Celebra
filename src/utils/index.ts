import { GetProp, UploadProps } from "antd";

export const getBase64 = (
  file: Parameters<GetProp<UploadProps, "beforeUpload">>[0] | File
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
