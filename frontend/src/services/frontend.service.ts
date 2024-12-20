import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const askQuestion = async (question: string) => {
  const response = await axios.post(`${API_BASE_URL}/questions/answer`, {
    question,
  });
  return response;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/documents/ingest`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
