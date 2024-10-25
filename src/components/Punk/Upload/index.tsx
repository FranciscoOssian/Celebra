import { UploadFile, Image, Upload, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Box from "../Box";
import { getBase64 } from "@/utils";
import { useParams } from "next/navigation";
import createFileEvent from "@/services/firebase/Create/fileEvent";
import deleteEventFile from "@/services/firebase/Delete/eventFile";

export interface UploadCustomPropsType {
  name: string;
  value: string; // URL da imagem atual
  onChange(v: string): void; // onChange será chamado com a URL da imagem
  Icon: () => React.ReactNode;
}

const UploadCustom = ({
  name,
  value,
  onChange,
  Icon,
}: UploadCustomPropsType) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { id } = useParams();

  useEffect(() => {
    if (value) {
      setPreviewImage(value);
      setFileList([
        { uid: "-1", name: "image.png", status: "done", url: value },
      ]); // Preenche o fileList com a imagem atual
    }
  }, [value]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const file = newFileList[0];

    if (file) {
      // Exclui a imagem anterior, se existir
      await deleteEventFile(value);
      const url = await createFileEvent(
        typeof id === "string" ? id : id[0],
        file
      );
      if (!url) return;

      setPreviewImage(url);
      onChange(url); // Atualiza a URL no componente pai

      // Atualiza o fileList para incluir apenas o novo arquivo
      setFileList([{ uid: file.uid, name: file.name, status: "done", url }]);
    }
  };

  const handleDelete = async () => {
    // Exclui a imagem do Firebase
    await deleteEventFile(previewImage);

    // Limpa o estado
    setPreviewImage("");
    setFileList([]);
    onChange(""); // Chama onChange com uma string vazia
  };

  return (
    <>
      {previewImage && (
        <Image
          alt=""
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
      <Box name={name} Svg={() => <Icon />}>
        <Upload
          name="hero"
          listType="picture-card"
          showUploadList // Mostra a lista de uploads
          fileList={fileList}
          beforeUpload={() => false} // Para evitar que o Ant Design processe automaticamente o upload
          onPreview={handlePreview}
          onChange={handleChange}
          // Configuração do botão de deletar
          onRemove={handleDelete}
        >
          {!previewImage ? ( // Se não houver imagem, mostra o botão de upload
            <div>
              <UploadOutlined />
              <p className="mt-2">Clique para fazer upload {name}</p>
            </div>
          ) : null}
        </Upload>
      </Box>
    </>
  );
};

export default UploadCustom;
