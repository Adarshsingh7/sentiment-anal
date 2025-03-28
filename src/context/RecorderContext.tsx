import React, { createContext, useState } from "react";
import { useAudio } from "./AudioContext";
import {
  resultType,
  RecorderContextType as ContextType,
  TabType,
} from "@/types";

const RecorderContext = createContext<null | ContextType>(null);

function RecorderContextProvider({ children }: React.PropsWithChildren) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResults, setAnalysisResults] = useState<resultType | null>(
    null,
  );
  const { onUploadFile, audio } = useAudio();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [chatType, setChatType] = useState<TabType>("voice-insights");

  console.log(audio);

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setIsRecording(false);
  };

  const handleAnalyzeAudio = async () => {
    if (!audioBlob) return;
    const file = new File([audioBlob], "audio.wav", { type: "audio/wav" });
    console.log(file);
    onUploadFile(file);
  };

  const onChangeChatType = function (val: TabType) {
    setChatType(val);

    setIsAnalyzing(false);
    setIsRecording(false);
    setAudioBlob(null);
    setAnalysisResults(null);
  };

  return (
    <RecorderContext.Provider
      value={{
        audioBlob,
        analysisResults,
        isAnalyzing,
        isRecording,
        chatType,
        setIsRecording,
        handleAnalyzeAudio,
        handleRecordingComplete,
        setAudioBlob,
        setAnalysisResults,
        onChangeChatType,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
}

function useRecorder() {
  const context = React.useContext(RecorderContext);
  if (!context) {
    throw new Error(
      "useRecorder must be used within a RecorderContextProvider",
    );
  }
  return context;
}

export { RecorderContextProvider, useRecorder };
