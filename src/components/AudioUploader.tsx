import { useAudio } from "@/context/AudioContext";
import speechAnalyser from "@/features/analyse/speech";
import React, { useState } from "react";
import Loader from "@/components/Loader";

const AudioUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { onSetAudioHistory, isLoading } = useAudio();

  const connectWebSocket = (id: string, file: File): void => {
    const ws = new WebSocket(`ws://localhost:8000/analysis-report/${id}`);
    ws.onmessage = (event) => {
      console.log("socket connected");
      try {
        const response = JSON.parse(event.data);
        if (!file) {
          console.log("file not found");
          return;
        }
        onSetAudioHistory({
          analysis: response,
          audio: file,
          category: "voice-insights",
          id: id,
        });
        // Store the response as needed
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      try {
        const res = await speechAnalyser.uploadAudioFile(file);
        console.log("audio uploaded successfully");
        if (!res) {
          console.error("Failed to get a response from the server");
          return;
        }
        connectWebSocket(res.id, file);
      } catch (error) {
        console.error("Error uploading audio file:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
    </div>
  );
};

export default AudioUploader;
