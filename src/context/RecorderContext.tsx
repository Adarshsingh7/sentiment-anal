/** @format */

import React, { createContext, useEffect, useState } from 'react';

type ContextType = {
	analysisResults: resultType | null;
	audioBlob: Blob | null;
	isAnalyzing: boolean;
	isRecording: boolean;
	history: historyType[];
	chatType: 'voice-insights' | 'tone-trainer' | 'chat-companion';
	onChangeChatType: (
		val: 'voice-insights' | 'tone-trainer' | 'chat-companion'
	) => void;
	addHistory: (his: historyType) => void;
	setIsRecording: (val: boolean) => void;
	handleRecordingComplete: (blob: Blob) => void;
	handleAnalyzeAudio: () => void;
	setAudioBlob: (val: Blob | null) => void;
	setAnalysisResults: (val: resultType | null) => void;
};

type resultType = {
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

type historyType = {
	result: resultType;
	dateTime: Date;
	category: 'voice-insights' | 'tone-trainer' | 'chat-companion';
	audio: Blob;
	duration: number;
};

const RecorderContext = createContext<null | ContextType>(null);

function RecorderContextProvider({ children }: React.PropsWithChildren) {
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [analysisResults, setAnalysisResults] = useState<resultType | null>(
		null
	);
	const [history, setHistory] = useState<historyType[]>([]);

	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const [chatType, setChatType] = useState<
		'voice-insights' | 'tone-trainer' | 'chat-companion'
	>('voice-insights');

	const handleRecordingComplete = (blob: Blob) => {
		setAudioBlob(blob);
		setIsRecording(false);
	};

	const handleAnalyzeAudio = async () => {
		if (!audioBlob) return;

		setIsAnalyzing(true);

		// Simulate analysis with timeout
		setTimeout(() => {
			// Mock analysis results
			setAnalysisResults({
				confidenceScore: 78,
				paceScore: 85,
				energyLevel: 72,
				fillerWords: {
					um: 5,
					uh: 3,
					like: 8,
				},
				vocabularyScore: 82,
				feedback:
					"Good energy overall. Try to reduce filler words like 'like' and speak with more confidence.",
			});
			setIsAnalyzing(false);
		}, 2000);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const addHistory = function (newHistory: historyType) {
		// if (!analysisResults) {
		// 	return;
		// }
		console.log(newHistory);
		setHistory((currHistory) => [...currHistory, newHistory]);

		setAudioBlob(null);
		setAnalysisResults(null);
	};

	useEffect(() => {
		if (analysisResults) {
			if (!audioBlob) return;
			addHistory({
				audio: audioBlob,
				category: chatType,
				dateTime: new Date(),
				result: analysisResults,
				duration: 100,
			});
			setAnalysisResults(null);
		}
	}, [addHistory, analysisResults, audioBlob, chatType]);

	const onChangeChatType = function (
		val: 'voice-insights' | 'tone-trainer' | 'chat-companion'
	) {
		setChatType(val);

		setIsAnalyzing(false);
		setIsRecording(false);
		setAudioBlob(null);
		setAnalysisResults(null);
	};

	return (
		<RecorderContext.Provider
			value={{
				audioBlob,
				analysisResults,
				isAnalyzing,
				isRecording,
				history,
				chatType,
				setIsRecording,
				handleAnalyzeAudio,
				handleRecordingComplete,
				setAudioBlob,
				setAnalysisResults,
				addHistory,
				onChangeChatType,
			}}
		>
			{children}
		</RecorderContext.Provider>
	);
}

function useRecorder() {
	const context = React.useContext(RecorderContext);
	if (!context) {
		throw new Error(
			'useRecorder must be used within a RecorderContextProvider'
		);
	}
	return context;
}

export { RecorderContextProvider, useRecorder };
