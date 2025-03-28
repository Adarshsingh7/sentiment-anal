import SpeechAnalysis from "./features/analyse/type";

export type TabType =
  | "voice-insights"
  | "tone-trainer"
  | "chat-companion"
  | "rephrase-text";

export type resultType = {
  confidenceScore: number;
  paceScore: number;
  energyLevel: number;
  fillerWords: {
    um: number;
    uh: number;
    like: number;
  };
  vocabularyScore: number;
  feedback: string;
};

export type RecorderContextType = {
  analysisResults: resultType | null;
  audioBlob: Blob | null;
  isAnalyzing: boolean;
  isRecording: boolean;
  chatType: TabType;
  onChangeChatType: (val: TabType) => void;
  setIsRecording: (val: boolean) => void;
  handleRecordingComplete: (blob: Blob) => void;
  handleAnalyzeAudio: () => void;
  setAudioBlob: (val: Blob | null) => void;
  setAnalysisResults: (val: resultType | null) => void;
};

export type AudioHistoryType = {
  id: string;
  analysis: SpeechAnalysis;
  duration: number;
  audioBlob: Blob;
  dateTimestamp: number;
  category: TabType;
};

export type AudioContextProps = {
  audio: SpeechAnalysis | null;
  audioHistory: AudioHistoryType[];
  onUploadFile: (file: File | undefined | null) => void;
  isLoading: boolean;
  error: string | null;
  onSetAudioHistory: (params: {
    audio: Blob;
    id: string;
    category: TabType;
    analysis: SpeechAnalysis;
  }) => void;
};
