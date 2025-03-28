import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Timer, Mic, MoveLeft, Pause, Play } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

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
  const [interviewCompleted, setInterviewCompleted] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHoveringRecord, setIsHoveringRecord] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start Interview
  const startInterview = useCallback(async (category: string) => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;

      // Create media recorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Reset state
      setSelectedCategory(category);
      setCurrentQuestionIndex(0);
      setRecordings(
        new Array(INTERVIEW_DATA[category].questions.length).fill(null),
      );

      // Setup recording handlers
      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        updateRecording(currentQuestionIndex, audioBlob);
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

  // Update recording for a specific question
  const updateRecording = useCallback(
    (questionIndex: number, audioBlob: Blob) => {
      setRecordings((prev) => {
        const newRecordings = [...prev];
        newRecordings[questionIndex] = audioBlob;
        return newRecordings;
      });
    },
    [],
  );

  // Pause/Resume Recording
  const togglePauseResume = useCallback(() => {
    if (mediaRecorder) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);

        // Resume timer
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              moveToNextQuestion();
              return 60;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        mediaRecorder.pause();
        setIsPaused(true);

        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  }, [mediaRecorder, isPaused]);

  // Move to Previous Question
  const moveToPreviousQuestion = useCallback(() => {
    // Stop current recording
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    // Move to previous question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);

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
            updateRecording(currentQuestionIndex - 1, audioBlob);
            audioChunksRef.current = [];
          };

          newRecorder.start();
          setMediaRecorder(newRecorder);
          setIsRecording(true);
          setTimeRemaining(60);
          setIsPaused(false);
        } catch (error) {
          console.error("Error restarting recording:", error);
        }
      }, 500);
    }
  }, [currentQuestionIndex, updateRecording]);

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
            updateRecording(currentQuestionIndex, audioBlob);
            audioChunksRef.current = [];
          };

          newRecorder.start();
          setMediaRecorder(newRecorder);
          setIsRecording(true);
          setTimeRemaining(60);
          setIsPaused(false);
        } catch (error) {
          console.error("Error restarting recording:", error);
        }
      }, 500);
    } else {
      // Interview completed
      if (timerRef.current) clearInterval(timerRef.current);
      setIsInterviewStarted(false);
    }
  }, [selectedCategory, currentQuestionIndex, updateRecording]);

  // Submit Interview
  const submitInterview = () => {
    // Ensure last question's recording is captured
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

    setInterviewCompleted(true);

    // Process recordings
    console.log("Recorded Responses:", recordings);
    alert("Interview Submitted! Check console for recordings.");

    // Reset interview state
    setIsInterviewStarted(false);
  };

  // Cancel Interview
  const cancelInterview = () => {
    // Stop recording
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    // Stop and close stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Reset all states
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setTimeRemaining(60);
    setIsInterviewStarted(false);
    setIsRecording(false);
    setRecordings([]);
  };

  if (interviewCompleted) {
    return (
      <div>
        <Button onClick={onBack}>
          <MoveLeft className="h-8 w-8" />
          Back
        </Button>
        Interview Completed!
        <div>
          {recordings
            .filter((rec) => rec)
            .map((recording, index) => (
              <div key={index}>
                <AudioPlayer audioBlob={recording} />
              </div>
            ))}
        </div>
      </div>
    );
  }

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
        {/* <Button onClick={onBack}>
          <MoveLeft className="h-8 w-8" />
          Back
        </Button> */}
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCancelDialog(true)}
            >
              <MoveLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>{INTERVIEW_DATA[selectedCategory!].name}</CardTitle>
              <p className="text-muted-foreground flex items-center">
                <Timer className="mr-2 h-4 w-4" />
                {timeRemaining} seconds remaining
              </p>
            </div>
          </div>
          <div
            className={`relative ${isRecording && !isPaused ? "animate-pulse" : ""}`}
            onMouseEnter={() => setIsHoveringRecord(true)}
            onMouseLeave={() => setIsHoveringRecord(false)}
          >
            <Mic
              className={`h-6 w-6 ${
                isRecording
                  ? isPaused
                    ? "text-yellow-500"
                    : "text-red-500"
                  : "text-gray-500"
              }`}
            />
            {isHoveringRecord && (
              <div
                className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2
                bg-black text-white text-xs px-2 py-1 rounded"
              >
                {isRecording
                  ? isPaused
                    ? "Paused"
                    : "Recording Active"
                  : "Start Recording"}
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
                onClick={moveToPreviousQuestion}
                disabled={currentQuestionIndex <= 0}
              >
                Previous Question
              </Button>

              {isRecording ? (
                <Button
                  variant={isPaused ? "default" : "destructive"}
                  onClick={togglePauseResume}
                >
                  {isPaused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  )}
                </Button>
              ) : null}

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

      {/* Cancel Interview Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the interview? All your current
              progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Continue</AlertDialogCancel>
            <AlertDialogAction onClick={cancelInterview}>
              Yes, Cancel Interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MockInterviewApp;
