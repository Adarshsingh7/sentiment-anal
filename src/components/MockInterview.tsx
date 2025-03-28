import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Mic, RefreshCw, MoveLeft } from "lucide-react";

// Types for Interview Data
interface InterviewQuestion {
  question: string;
}

interface InterviewCategory {
  name: string;
  questions: InterviewQuestion[];
}

// Interview Data
const INTERVIEW_DATA: Record<string, InterviewCategory> = {
  HR: {
    name: "HR Interview",
    questions: [
      { question: "Tell me about yourself." },
      { question: "What are your greatest strengths?" },
      { question: "Why do you want to work here?" },
      {
        question:
          "Describe a challenging work situation and how you overcame it.",
      },
    ],
  },
  DSA: {
    name: "DSA Interview",
    questions: [
      { question: "Explain the two-pointer technique in array problems." },
      { question: "How would you optimize an O(n²) algorithm?" },
      { question: "Describe the difference between stack and queue." },
      { question: "Implement a binary search algorithm conceptually." },
    ],
  },
  INTRO: {
    name: "Intro Interview",
    questions: [
      { question: "What are your career goals?" },
      { question: "How did you get interested in your field?" },
      { question: "Describe a project you're proud of." },
      { question: "What motivates you professionally?" },
    ],
  },
};

const MockInterviewApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isHoveringRecord, setIsHoveringRecord] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start Interview
  const startInterview = useCallback(async (category: string) => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create media recorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Reset state
      setSelectedCategory(category);
      setCurrentQuestionIndex(0);
      setRecordings([]);

      // Setup recording handlers
      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setRecordings((prev) => [...prev, audioBlob]);
        audioChunksRef.current = [];
      };

      // Start recording
      recorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            moveToNextQuestion();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      setIsInterviewStarted(true);
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Please allow microphone access to start the interview.");
    }
  }, []);

  // Rerecord Current Question
  const rerecordQuestion = useCallback(async () => {
    // Stop current recording
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    try {
      // Stop and close existing stream if any
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Get new stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create new recorder
      const newRecorder = new MediaRecorder(stream);

      newRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      newRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        // Replace the recording for the current question
        const newRecordings = [...recordings];
        newRecordings[currentQuestionIndex] = audioBlob;
        setRecordings(newRecordings);
        audioChunksRef.current = [];
      };

      newRecorder.start();
      setMediaRecorder(newRecorder);
      setIsRecording(true);
      setTimeRemaining(60);
    } catch (error) {
      console.error("Error restarting recording:", error);
    }
  }, [currentQuestionIndex, recordings]);

  // Move to Next Question
  const moveToNextQuestion = useCallback(() => {
    // Stop current recording
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    // Move to next question
    if (
      selectedCategory &&
      currentQuestionIndex <
        INTERVIEW_DATA[selectedCategory].questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);

      // Restart recording after a short delay
      setTimeout(async () => {
        try {
          // Stop and close existing stream if any
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaStreamRef.current = stream;

          const newRecorder = new MediaRecorder(stream);

          newRecorder.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
          };

          newRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            setRecordings((prev) => [...prev, audioBlob]);
            audioChunksRef.current = [];
          };

          newRecorder.start();
          setMediaRecorder(newRecorder);
          setIsRecording(true);
          setTimeRemaining(60);
        } catch (error) {
          console.error("Error restarting recording:", error);
        }
      }, 500);
    } else {
      // Interview completed
      if (timerRef.current) clearInterval(timerRef.current);
      setIsInterviewStarted(false);
    }
  }, [selectedCategory, currentQuestionIndex]);

  // Submit Interview
  const submitInterview = () => {
    // Stop recording
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    // Stop and close stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Process recordings
    console.log("Recorded Responses:", recordings);
    alert("Interview Submitted! Check console for recordings.");
  };

  // Render Categories or Interview
  if (!isInterviewStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button onClick={onBack}>
          <MoveLeft className="h-8 w-8" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-center mb-6">
          Mock Interview Simulator
        </h1>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.keys(INTERVIEW_DATA).map((category) => (
            <Card
              key={category}
              className="cursor-pointer hover:bg-accent"
              onClick={() => startInterview(category)}
            >
              <CardHeader>
                <CardTitle>{INTERVIEW_DATA[category].name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {INTERVIEW_DATA[category].questions.length} Questions
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Interview in Progress
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{INTERVIEW_DATA[selectedCategory!].name}</CardTitle>
            <p className="text-muted-foreground flex items-center">
              <Timer className="mr-2 h-4 w-4" />
              {timeRemaining} seconds remaining
            </p>
          </div>
          <div
            className={`relative ${isRecording ? "animate-pulse" : ""}`}
            onMouseEnter={() => setIsHoveringRecord(true)}
            onMouseLeave={() => setIsHoveringRecord(false)}
          >
            <Mic
              className={`h-6 w-6 ${isRecording ? "text-red-500" : "text-gray-500"}`}
            />
            {isHoveringRecord && (
              <div
                className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2
                bg-black text-white text-xs px-2 py-1 rounded"
              >
                {isRecording ? "Recording Active" : "Start Recording"}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">
              {
                INTERVIEW_DATA[selectedCategory!].questions[
                  currentQuestionIndex
                ].question
              }
            </h2>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={moveToNextQuestion}
                disabled={
                  currentQuestionIndex >=
                  INTERVIEW_DATA[selectedCategory!].questions.length - 1
                }
              >
                Next Question
              </Button>

              <Button
                variant="secondary"
                onClick={rerecordQuestion}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-record
              </Button>

              {currentQuestionIndex ===
                INTERVIEW_DATA[selectedCategory!].questions.length - 1 && (
                <Button variant="default" onClick={submitInterview}>
                  Submit Interview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MockInterviewApp;
