import { format } from "date-fns";
import { Diamond } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SpeechAnalysis from "@/features/analyse/type";
import AudioPlayer from "./AudioPlayer";
import { TabType } from "@/types";

type AudioHistoryType = {
  id: string;
  analysis: SpeechAnalysis;
  duration: number;
  audioBlob: Blob;
  dateTimestamp: number;
  category: TabType;
};

interface VoiceHistoryProps {
  audioHistory: AudioHistoryType;
}

export function VoiceHistory({ audioHistory }: VoiceHistoryProps) {
  const getScoreColor = (percent: number) => {
    if (percent >= 70) return "text-green-500";
    if (percent >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 70) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "voice-insights":
        return "bg-blue-500 hover:bg-blue-600";
      case "tone-trainer":
        return "bg-purple-500 hover:bg-purple-600";
      case "chat-companion":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const { analysis } = audioHistory;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Voice Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(
                new Date(audioHistory.dateTimestamp),
                "MMMM d, yyyy 'at' h:mm a",
              )}
            </p>
          </div>
          <Badge className={getCategoryBadgeColor(audioHistory.category)}>
            {audioHistory.category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <AudioPlayer audioBlob={audioHistory.audioBlob} />

        {/* Overall Score */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-medium mb-2">
            Overall Conversation Score
          </h3>
          <div className="flex justify-center items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className={`${getProgressColor(analysis.conversation_score.data)} stroke-current`}
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.conversation_score.data / 100)}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-3xl font-bold ${getScoreColor(analysis.conversation_score.data)}`}
                >
                  {analysis.conversation_score.data.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <MetricCard
            title="Speech Rate"
            value={Math.floor(analysis.speech_rate.data.avg)}
            percent={Math.floor(analysis.speech_rate.data.percent)}
            category={analysis.speech_rate.data.category}
            remark={analysis.speech_rate.data.remark}
            unit="wpm"
          />
          <MetricCard
            title="Intonation"
            value={Math.floor(analysis.intonation.data.avg)}
            percent={Math.floor(analysis.intonation.data.percent)}
            category={analysis.intonation.data.category}
            remark={analysis.intonation.data.remark}
            unit="Hz"
          />
          <MetricCard
            title="Energy"
            value={Math.floor(analysis.energy.data.percent)}
            percent={Math.floor(analysis.energy.data.percent)}
            category={analysis.energy.data.category}
            remark={analysis.energy.data.remark}
            unit="%"
          />
          <MetricCard
            title="Confidence"
            value={Math.floor(analysis.confidence.data.percent)}
            percent={Math.floor(analysis.confidence.data.percent)}
            category={analysis.confidence.data.category}
            remark={analysis.confidence.data.remark}
            unit="%"
          />
        </div>

        <Tabs defaultValue="transcription" className="w-full">
          <TabsList className="grid grid-cols-5 mb-5">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="speech-patterns">Speech Rate</TabsTrigger>
            <TabsTrigger value="intonation">Intonation</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
          </TabsList>

          <TabsContent
            value="transcription"
            className="p-4 bg-muted/50 rounded-lg"
          >
            <h3 className="font-medium mb-2">Original Transcription</h3>
            <p className="text-sm whitespace-pre-line">
              {analysis.transcription.data}
            </p>

            {analysis.vocab_analysis.data.fancy_text && (
              <>
                <h3 className="font-medium mt-4 mb-2">Enhanced Version</h3>
                <p className="text-sm whitespace-pre-line">
                  {analysis.vocab_analysis.data.fancy_text}
                </p>
              </>
            )}
          </TabsContent>

          <TabsContent value="speech-patterns">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-bold mb-2">AI Feedback</h3>
                <p className="text-sm mb-4">
                  {analysis.speech_rate.data.remark}
                </p>
                <div>
                  <h1 className="font-bold mb-2">Average Speech Rate</h1>
                  <p>{analysis.speech_rate.data.avg.toFixed(0)} wpm</p>
                </div>
                <img
                  src={`data:image/png;base64,${analysis.speech_rate_fig.data}`}
                  alt="Speech Rate Chart"
                  className="w-[400px] m-auto h-auto mb-4"
                />

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fastest Segment</span>
                      <span className="font-medium">
                        {Math.floor(
                          analysis.speech_rate.data.fastest_segment.speech_rate,
                        )}{" "}
                        wpm
                      </span>
                    </div>
                    {/* <Progress value={100} className="h-2 bg-blue-200">
                      <div className="h-full bg-blue-500 rounded-full"></div>
                    </Progress> */}
                    <AudioPlayer
                      audioBlob={audioHistory.audioBlob}
                      startTimestamp={
                        analysis.speech_rate.data.fastest_segment.start
                      }
                      endTimestamp={
                        analysis.speech_rate.data.fastest_segment.end
                      }
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Slowest Segment</span>
                      <span className="font-medium">
                        {Math.floor(
                          analysis.speech_rate.data.slowest_segment.speech_rate,
                        )}
                        wpm
                      </span>
                    </div>
                    {/* <Progress value={100} className="h-2 bg-purple-200">
                      <div className="h-full bg-purple-500 rounded-full"></div>
                    </Progress> */}
                    <AudioPlayer
                      audioBlob={audioHistory.audioBlob}
                      startTimestamp={
                        analysis.speech_rate.data.slowest_segment.start
                      }
                      endTimestamp={
                        analysis.speech_rate.data.slowest_segment.end
                      }
                    />
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Intonation</h3>
                  <p className="text-sm">{analysis.intonation.data.remark}</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Energy & Confidence</h3>
                  <p className="text-sm mb-2">{analysis.energy.data.remark}</p>
                  <p className="text-sm">{analysis.confidence.data.remark}</p>
                </div>
              </div> */}
            </div>
          </TabsContent>

          <TabsContent value="intonation">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-bold mb-2">AI Feedback</h3>
                <p className="text-sm mb-4">
                  {analysis.intonation.data.remark}
                </p>
                <div>
                  <h1 className="font-bold mb-2">Average Pitch</h1>
                  <p>{analysis.intonation.data.avg.toFixed(0)} Hz</p>
                </div>
                <img
                  src={`data:image/png;base64,${analysis.intonation_fig.data}`}
                  alt="Speech Rate Chart"
                  className="w-[400px] m-auto h-auto mb-4"
                />
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Intonation</h3>
                  <p className="text-sm">{analysis.intonation.data.remark}</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Energy & Confidence</h3>
                  <p className="text-sm mb-2">{analysis.energy.data.remark}</p>
                  <p className="text-sm">{analysis.confidence.data.remark}</p>
                </div>
              </div> */}
            </div>
          </TabsContent>

          <TabsContent value="vocabulary">
            <div className="space-y-4">
              {analysis.vocab_analysis.data.repeated_words.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Repeated Words</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {analysis.vocab_analysis.data.repeated_words.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-background rounded border"
                        >
                          <span className="font-medium">{item.word}</span>
                          <Badge variant="outline">{item.count}x</Badge>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {analysis.vocab_analysis.data.meanings.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Vocabulary Insights</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {analysis.vocab_analysis.data.meanings.map(
                      (item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-sm font-medium">
                            {item.word}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm">
                            {item.meaning}
                          </AccordionContent>
                        </AccordionItem>
                      ),
                    )}
                  </Accordion>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="grammar">
            <div className="space-y-4">
              {analysis.vocab_analysis.data.grammatical_errors.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Grammar Corrections</h3>
                  <div className="space-y-3">
                    {analysis.vocab_analysis.data.grammatical_errors.map(
                      (error, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="p-3 bg-red-50 border-b">
                            <p className="text-sm text-red-600">
                              {error.sentence}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 border-b">
                            <p className="text-sm text-green-600">
                              {error.correct}
                            </p>
                          </div>
                          <div className="p-3 bg-background">
                            <p className="text-xs text-muted-foreground">
                              {error.explanation}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {analysis.vocab_analysis.data.long_sentences.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Long Sentences</h3>
                  <div className="space-y-3">
                    {analysis.vocab_analysis.data.long_sentences.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="p-3 bg-yellow-50 border-b">
                            <p className="text-sm text-yellow-700">
                              {item.sentence}
                            </p>
                          </div>
                          <div className="p-3 bg-background">
                            <p className="text-sm">
                              <span className="font-medium">Suggestion: </span>
                              {item.suggestion}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  percent: number;
  category: string;
  remark: string;
  unit: string;
}

function MetricCard({
  title,
  value,
  percent,
  category,
  remark,
  unit,
}: MetricCardProps) {
  const getScoreColor = (percent: number) => {
    if (percent >= 70) return "text-green-500";
    if (percent >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-end gap-2 mb-1">
          <span className={`text-2xl font-bold ${getScoreColor(percent)}`}>
            {Math.floor(value * 1000) / 1000}
          </span>
          <span className="text-xs text-muted-foreground mb-1">{unit}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Progress
            value={percent}
            className="h-2"
            // indicatorClassName={getProgressColor(percent)}
          />
          <span className={`text-xs font-medium ${getScoreColor(percent)}`}>
            {Math.floor(percent * 1000) / 1000}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs capitalize">
            {category}
          </Badge>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                >
                  <span className="sr-only">Info</span>
                  <Diamond className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{remark}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
