/** @format */

import { useState, useEffect, useRef } from 'react';
import { Mic, Square, AudioWaveformIcon as Waveform } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
	onComplete: (blob: Blob) => void;
	maxDuration?: number;
}

export default function AudioRecorder({
	onComplete,
	maxDuration = 60,
}: AudioRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			if (audioStream) {
				audioStream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [audioStream]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			setAudioStream(stream);

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
				onComplete(audioBlob);
			};

			mediaRecorder.start();
			setIsRecording(true);

			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => {
					if (prev >= maxDuration) {
						stopRecording();
						return maxDuration;
					}
					return prev + 1;
				});
			}, 1000);
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			if (audioStream) {
				audioStream.getTracks().forEach((track) => track.stop());
			}
			setIsRecording(false);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	return (
		<div className='flex flex-col items-center gap-4 p-4 border rounded-lg'>
			<div className='w-full flex items-center justify-between'>
				<div className='text-sm font-medium'>
					{isRecording ? 'Recording in progress...' : 'Ready to record'}
				</div>
				<div className='text-sm font-mono'>
					{formatTime(recordingTime)} / {formatTime(maxDuration)}
				</div>
			</div>

			<Progress
				value={(recordingTime / maxDuration) * 100}
				className='h-2 w-full'
			/>

			<div className='flex items-center justify-center gap-4 w-full'>
				{!isRecording ? (
					<Button
						onClick={startRecording}
						className='flex items-center gap-2'
					>
						<Mic className='h-4 w-4' />
						Start Recording
					</Button>
				) : (
					<>
						<div className='flex items-center gap-2 text-red-500'>
							<Waveform className={cn('h-5 w-5 animate-pulse')} />
							Recording
						</div>
						<Button
							variant='destructive'
							onClick={stopRecording}
							className='flex items-center gap-2'
						>
							<Square className='h-4 w-4' />
							Stop
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
