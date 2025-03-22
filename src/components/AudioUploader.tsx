/** @format */

import { useRecorder } from '@/context/RecorderContext';
import React from 'react';

const AudioUploader: React.FC = () => {
	const { addHistory } = useRecorder();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			addHistory({
				audio: file,
				category: 'voice-insights',
				dateTime: new Date(),
				duration: 100,
				result: {
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
				},
			});
		}
	};

	return (
		<div style={{ padding: 20, maxWidth: 500 }}>
			<input
				type='file'
				accept='audio/*'
				onChange={handleFileUpload}
			/>
		</div>
	);
};

export default AudioUploader;
