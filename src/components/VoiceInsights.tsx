/** @format */

import { useEffect, useRef, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Mic } from 'lucide-react';
import AudioRecorder from './audio-recorder';
import { Progress } from './ui/progress';
import AudioAnalysisResults from './audio-analysis-results';
import { useRecorder } from '@/context/RecorderContext';

import { AdvanceDialog } from './AdvanceDialog';
import VoiceHistory from './VoiceHistory';
import AudioUploader from './AudioUploader';

const VoiceInsights = function ({
	tab = 'voice-insights',
}: {
	tab?: 'voice-insights' | 'tone-trainer' | 'chat-companion';
}) {
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
		history,
	} = useRecorder();
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
				<CardContent className='space-y-4'>
					{!audioBlob && !isRecording ? (
						<div className='grid grid-cols-2 gap-4'>
							<Button
								onClick={() => setIsRecording(true)}
								className='flex items-center gap-2'
							>
								<Mic className='h-4 w-4' />
								Record Audio
							</Button>
							<Button
								variant='outline'
								className='flex items-center gap-2'
							>
								<AudioUploader />
							</Button>
						</div>
					) : isRecording ? (
						<AudioRecorder onComplete={handleRecordingComplete} />
					) : (
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
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
									size='sm'
									variant='destructive'
									onClick={() => setAudioBlob(null)}
								>
									Discard
								</Button>
								<Button
									size='sm'
									onClick={handleAnalyzeAudio}
									disabled={isAnalyzing}
									className='ml-auto'
								>
									{isAnalyzing ? 'Analyzing...' : 'Analyze Speech'}
								</Button>
							</div>

							{isAnalyzing && (
								<div className='space-y-2'>
									<div className='flex justify-between text-sm'>
										<span>Analyzing your speech...</span>
										<span>Please wait</span>
									</div>
									<Progress
										value={45}
										className='h-2'
									/>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
			{analysisResults && (
				<AdvanceDialog
					label='Dialog'
					open={openResult}
					setOpen={(val) => (val ? setOpenResult(true) : handleDialogClose())}
				>
					<AudioAnalysisResults results={analysisResults} />
				</AdvanceDialog>
			)}
			<div>
				{[...history].map((audio, i) => (
					<VoiceHistory
						key={i}
						history={audio}
						tabName={tab}
					/>
				))}
			</div>
		</div>
	);
};

export default VoiceInsights;
