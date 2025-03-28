import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

type AudioPlayerProps = {
  audioBlob: Blob;
  startTimestamp?: number;
  endTimestamp?: number;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBlob,
  startTimestamp = 0,
  endTimestamp,
}) => {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.currentTime = startTimestamp;
    audio.onloadedmetadata = () => setDuration(audio.duration);
  }, [startTimestamp]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (endTimestamp && audioRef.current.currentTime >= endTimestamp) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="mb-6 bg-muted p-4 rounded-lg">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="flex-1">
          <div className="relative w-full bg-gray-300 h-2 rounded overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>
              {new Date(currentTime * 1000).toISOString().substr(14, 5)}
            </span>
            <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
          </div>
        </div>
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      </div>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
