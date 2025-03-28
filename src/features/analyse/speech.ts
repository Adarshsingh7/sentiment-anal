import BaseService from "@/utils/BaseClass";
import SpeechAnalysis from "./type";
import axios from "axios";

class SpeechAnalyser extends BaseService<SpeechAnalysis> {
  constructor() {
    super("http://localhost:8000");
  }
  async uploadAudioFile(file: File): Promise<{ id: string } | undefined> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:8000/upload-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("File uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return undefined;
    }
  }
}

const speechAnalyser = new SpeechAnalyser();
export default speechAnalyser;
