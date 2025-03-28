/** @format */

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatHistory from "@/components/chat-history";
import ToneTrainer from "./components/ToneTrainer";
import VoiceInsights from "./components/VoiceInsights";
import { ChatCompanion } from "./components/ChatCompanion";
import { useRecorder } from "./context/RecorderContext";
import RephraseText from "./components/RephraseText";
import { TabType } from "./types";
import PracticeSession from "./components/PracticeSession";

export default function App() {
  // const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [activeMode, setActiveMode] = useState<TabType>("voice-insights");
  const { onChangeChatType } = useRecorder();

  const handleModeChange = (mode: TabType) => {
    setActiveMode(mode);
    onChangeChatType(mode);
  };

  return (
    <div className="flex h-screen bg-background w-full">
      <ChatHistory activeMode={activeMode} onModeChange={handleModeChange} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <Tabs
            value={activeMode}
            onValueChange={handleModeChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="voice-insights">Voice Insights</TabsTrigger>
              <TabsTrigger value="rephrase-text">Rephrase Text</TabsTrigger>
              <TabsTrigger value="practice-session">
                Practice Session
              </TabsTrigger>
              <TabsTrigger value="tone-trainer">Tone Trainer</TabsTrigger>
              <TabsTrigger value="chat-companion">Chat Companion</TabsTrigger>
            </TabsList>

            <TabsContent value="voice-insights" className="space-y-4">
              <VoiceInsights />
            </TabsContent>

            <TabsContent value="rephrase-text">
              <RephraseText />
            </TabsContent>

            <TabsContent value="tone-trainer">
              <ToneTrainer />
            </TabsContent>

            <TabsContent value="chat-companion">
              <ChatCompanion />
            </TabsContent>
            <TabsContent value="practice-session">
              <PracticeSession />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
