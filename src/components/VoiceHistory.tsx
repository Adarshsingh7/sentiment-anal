/** @format */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvanceDialog } from './AdvanceDialog';
import AudioAnalysisResults from './audio-analysis-results';
import { format } from 'date-fns';

type ResultType = {
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

type HistoryType = {
	result: ResultType;
	dateTime: Date;
	category: 'voice-insights' | 'tone-trainer' | 'chat-companion';
	audio: Blob;
	duration: number;
};

const AudioHistory: React.FC<{ history: HistoryType; tabName?: string }> = ({
	history,
	tabName,
}) => {
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [openResult, setOpenResult] = useState(false);
	useEffect(() => {
		if (history.audio) {
			const url = URL.createObjectURL(history.audio);
			setAudioURL(url);
			return () => URL.revokeObjectURL(url);
		}
	}, [history.audio]);

	if (tabName && tabName !== history.category) return null;

	return (
		<Card className='w-full flex items-center bg-white shadow-md rounded-lg p-4 mt-8'>
			<CardContent className='flex w-full items-center justify-between gap-4'>
				{/* Category & Date */}
				<div className='flex flex-col gap-1 min-w-[150px]'>
					<Badge
						variant='outline'
						className='capitalize'
					>
						{history.category.replace('-', ' ')}
					</Badge>
					<p className='text-xs text-gray-500'>
						{format(new Date(history.dateTime), 'PPpp')}
					</p>
				</div>

				{/* Audio Player */}
				{audioURL ? (
					<audio
						controls
						className='w-full max-w-[250px]'
					>
						<source
							src={audioURL}
							type={history.audio.type || 'audio/mpeg'}
						/>
						Your browser does not support the audio element.
					</audio>
				) : (
					<p className='text-gray-500 text-sm'>No recording available.</p>
				)}

				{/* Duration */}
				<p className='text-sm text-gray-700 min-w-[80px]'>
					⏱ {Math.floor(history.duration / 60)}m {history.duration % 60}s
				</p>

				{/* Scores Overview */}
				<div className='flex flex-col gap-1 min-w-[120px] text-sm text-gray-600'>
					<p>Confidence: {history.result.confidenceScore}%</p>
					<p>Energy: {history.result.energyLevel}%</p>
					<p>Vocabulary: {history.result.vocabularyScore}%</p>
				</div>

				{/* Open Analysis Button */}
				<Button onClick={() => setOpenResult(true)}>Show Result</Button>
			</CardContent>

			{/* Result Dialog */}
			<AdvanceDialog
				label='Analysis Results'
				open={openResult}
				setOpen={setOpenResult}
			>
				<AudioAnalysisResults results={history.result} />
			</AdvanceDialog>
		</Card>
	);
};

export default AudioHistory;
