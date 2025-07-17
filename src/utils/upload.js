import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME2;

export const uploadFiles = async (files) => {
  let uploaded = [];

  for (const f of files) {
    const { file, type } = f;
    let formData = new FormData();
    formData.append("upload_preset", "vaiturbo");
    formData.append("file", file);

    // Determina o tipo do recurso
    const resourceType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : file.type.startsWith("audio/")
      ? "audio"
      : "raw";

    // Corrigido: salvar em uploads/{tipo}, ex: uploads/raw
    const folder = `uploads/${resourceType}s`;
    formData.append("folder", folder);

    const res = await uploadToCloudinary(formData, resourceType);
    uploaded.push({
      file: res,
      type,
    });
  }

  return uploaded;
};

const uploadToCloudinary = async (formData, resourceType) => {
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
      formData
    );
    return data;
  } catch (err) {
    console.error("Erro ao enviar arquivo:", err);
    throw err;
  }
};
