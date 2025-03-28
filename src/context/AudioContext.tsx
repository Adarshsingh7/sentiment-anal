import speechAnalyser from "@/features/analyse/speech";
import SpeechAnalysis from "@/features/analyse/type";
import { AudioContextProps, AudioHistoryType, TabType } from "@/types";
import { createContext, useContext, useState } from "react";

const AudioContext = createContext<AudioContextProps | null>(null);

const useAudio = () => {
  const audioContext = useContext(AudioContext);
  if (!audioContext) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return audioContext;
};

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioHistory, setAudioHistory] = useState<AudioHistoryType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSetAudioHistory = ({
    audio,
    id,
    category,
    analysis,
  }: {
    audio: Blob;
    id: string;
    category: TabType;
    analysis: SpeechAnalysis;
  }) => {
    const duration = audio.size / 1024;
    const dateTimestamp = Date.now();
    const newHistory = [
      { id, analysis, duration, audioBlob: audio, dateTimestamp, category },
      ...audioHistory,
    ];
    setAudioHistory(newHistory);
  };

  const connectWebSocket = (id: string, file: File): void => {
    setIsLoading(true);
    const ws = new WebSocket(`ws://localhost:8000/analysis-report/${id}`);
    ws.onmessage = (event) => {
      console.log("socket connected");
      try {
        const response = JSON.parse(event.data);
        if (!file) {
          throw new Error("File not found");
        }
        console.log("get message");
        setIsLoading(false);
        onSetAudioHistory({
          analysis: response,
          audio: file,
          category: "voice-insights",
          id: id,
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setError(error?.message);
        return error;
      } finally {
        setIsLoading(false);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const handleFileUpload = async (file: File | undefined | null) => {
    console.log({ file });
    if (!file) {
      setError("No file selected");
      return;
    }
    try {
      setFile(file);
      const res = await speechAnalyser.uploadAudioFile(file);
      if (!res) {
        setError("Failed to upload audio file");
        return;
      }
      console.log("audio uploaded successfully");
      connectWebSocket(res.id, file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred during file upload");
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audio: audioHistory[0]?.analysis,
        audioHistory,
        onSetAudioHistory,
        onUploadFile: handleFileUpload,
        isLoading,
        error,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export { useAudio };

export default AudioProvider;
