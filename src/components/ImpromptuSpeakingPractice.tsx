import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, LucideCross, Mic, StopCircle, Upload } from "lucide-react";

const ImpromptuSpeakingPractice: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [preparationTime, setPreparationTime] = useState(30);
  const [speakingTime, setSpeakingTime] = useState(60);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const topics = [
    "Climate Change Effects",
    "Artificial Intelligence Future",
    "Social Media Addiction",
    "Mental Health Matters",
    "Sustainable Energy Solutions",
  ];

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    // Reset states when a new topic is selected
    setPreparationTime(30);
    setSpeakingTime(60);
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    console.log("Recording canceled");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setAudioBlob(null);
    setPreparationTime(30);
    setIsRecording(false);
  };

  const submitRecording = () => {
    if (audioBlob) {
      console.log("Recorded Audio Blob:", audioBlob);
      // Here you can add further logic like uploading the blob
    } else {
      console.log("okay");
    }
  };

  const VoiceInsightComponent = () => (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Insight</span>
          <div className="flex space-x-2">
            {!isRecording && !audioBlob ? (
              <Button variant="default" size="sm" onClick={startRecording}>
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </Button>
            ) : isRecording ? (
              <Button variant="destructive" size="sm" onClick={stopRecording}>
                <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
            ) : (
              <div className="flex flex-row gap-5">
                <Button variant="default" size="sm" onClick={submitRecording}>
                  <Upload className="mr-2 h-4 w-4" /> Submit Recording
                </Button>

                <Button variant="default" size="sm" onClick={cancelRecording}>
                  <LucideCross className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold">Preparation Time</p>
            <div className="flex items-center space-x-2 mt-2">
              <span>{preparationTime} seconds</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Speaking Time</p>
            <div className="flex items-center space-x-2 mt-2">
              <span>{speakingTime} seconds</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Impromptu Speaking Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Button
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                className={`w-full justify-between ${
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => handleTopicSelect(topic)}
              >
                {topic}
                {selectedTopic === topic && <Check className="ml-2 h-4 w-4" />}
              </Button>
            ))}
          </div>

          {selectedTopic && <VoiceInsightComponent />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpromptuSpeakingPractice;
