/** @format */

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import AudioRecorder from "./audio-recorder";
import { Progress } from "./ui/progress";
import AudioAnalysisResults from "./audio-analysis-results";
import { useRecorder } from "@/context/RecorderContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { AdvanceDialog } from "./AdvanceDialog";
import AudioUploader from "./AudioUploader";
import { useAudio } from "@/context/AudioContext";
import { VoiceHistory } from "./VoiceHistory";
import { getAudioDuration } from "@/utils/getAudioDuration";
import { AudioHistoryType, TabType } from "@/types";

const VoiceInsights = function ({ tab = "voice-insights" }: { tab?: TabType }) {
  const {
    analysisResults,
    handleAnalyzeAudio,
    handleRecordingComplete,
    isAnalyzing,
    isRecording,
    audioBlob,
    setIsRecording,
    setAudioBlob,
    setAnalysisResults,
  } = useRecorder();
  const { audioHistory, error } = useAudio();
  const [openResult, setOpenResult] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (analysisResults) {
      setOpenResult(true);
    }
  }, [analysisResults]);

  const handleDialogClose = () => {
    setOpenResult(false);
    setAnalysisResults(null);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Voice Insights</CardTitle>
          <CardDescription>
            Upload or record audio to receive detailed analysis of your speech
            patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!audioBlob && !isRecording ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setIsRecording(true)}
                className="flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Record Audio
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <AudioUploader />
              </Button>
            </div>
          ) : isRecording ? (
            <AudioRecorder onComplete={handleRecordingComplete} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {audioBlob && (
                  <>
                    <audio
                      ref={audioRef}
                      controls
                      src={URL.createObjectURL(audioBlob)}
                    />
                  </>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setAudioBlob(null)}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={handleAnalyzeAudio}
                  disabled={isAnalyzing}
                  className="ml-auto"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Speech"}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing your speech...</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {analysisResults && (
        <AdvanceDialog
          label="Dialog"
          open={openResult}
          setOpen={(val) => (val ? setOpenResult(true) : handleDialogClose())}
        >
          <AudioAnalysisResults results={analysisResults} />
        </AdvanceDialog>
      )}
      <div>
        {[...audioHistory]
          // .filter((el) => el.category === tab)
          .map((audio) => (
            <AudioHistoryBar
              analysis={audio.analysis}
              audioBlob={audio.audioBlob}
              category={tab}
              dateTimestamp={audio.dateTimestamp}
              duration={audio.duration}
              id={audio.id}
              key={audio.id}
            />
            // <VoiceHistory key={i} audioHistory={audio} />
          ))}
      </div>
    </div>
  );
};

function AudioHistoryBar({
  id,
  analysis,
  duration,
  audioBlob,
  dateTimestamp,
  category,
}: PropsWithChildren<AudioHistoryType>) {
  const [isViewing, setIsViewing] = useState(false);
  const [durationString, setDurationString] = useState("");
  getAudioDuration(audioBlob).then((res) => setDurationString(res));

  return (
    <Card className="w-full p-4 flex items-center justify-between shadow-md rounded-lg mt-10">
      <CardContent className="w-full flex items-center justify-between p-2">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {format(new Date(dateTimestamp), "PPP p")}
          </span>
          {/* <span className="text-lg font-semibold text-green-600">
            Score: {analysis.conversation_score.data.toFixed(3)}
          </span> */}
          {/* <span className="text-sm text-muted-foreground ">
            {analysis.transcription.data.slice(0, 100) + "..."}
          </span> */}
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium">
            {(+durationString / 60).toFixed(0)} min{" "}
            {(+durationString % 60).toFixed(0)} sec
          </span>
          <Badge
            className="capitalize"
            variant={
              category === "voice-insights"
                ? "default"
                : category === "tone-trainer"
                  ? "secondary"
                  : "outline"
            }
          >
            {category.replace("-", " ")}
          </Badge>
          <Button onClick={() => setIsViewing(!isViewing)}>
            {isViewing ? "Hide" : "View"}
          </Button>
          <AdvanceDialog
            label="Advanced Options"
            open={isViewing}
            setOpen={setIsViewing}
            width={1000}
          >
            <VoiceHistory
              key={id}
              audioHistory={{
                analysis,
                audioBlob,
                category,
                dateTimestamp,
                duration,
                id,
              }}
            />
          </AdvanceDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default VoiceInsights;
