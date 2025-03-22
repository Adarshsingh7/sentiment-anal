/** @format */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceInsights from './VoiceInsights';

const tones = ['Formal', 'Casual', 'Friendly', 'Serious'];
const styles = ['Narrative', 'Descriptive', 'Persuasive', 'Expository'];

const StreamingText = ({ content }: { content: string }) => {
	const [displayedText, setDisplayedText] = useState('');

	useEffect(() => {
		setDisplayedText('');
		let index = 0;
		const interval = setInterval(() => {
			if (index < content.length) {
				setDisplayedText((prev) => prev + content[index]);
				index++;
			} else {
				clearInterval(interval);
			}
		}, 30); // Adjust speed here

		return () => clearInterval(interval);
	}, [content]);

	return (
		<p className='whitespace-pre-wrap text-gray-700 dark:text-gray-300 w-full'>
			{displayedText}
		</p>
	);
};
const SpeechGenerator = () => {
	const [tone, setTone] = useState(tones[0]);
	const [style, setStyle] = useState(styles[0]);
	const [generatedText, setGeneratedText] = useState('');

	const generateContent = () => {
		const loremText =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pharetra sapien non massa volutpat, sed euismod magna facilisis.';
		setGeneratedText(`(${tone} / ${style}) - ${loremText}`);
	};

	return (
		<div className='flex flex-col items-center min-h-screen w-full p-4 bg-gray-100 dark:bg-gray-900'>
			<Card className='w-full shadow-lg'>
				<CardHeader>
					<CardTitle className='text-lg'>Speech Generator</CardTitle>
				</CardHeader>

				<CardContent>
					<div className='flex flex-col gap-4'>
						<div className='flex flex-col sm:flex-row gap-4'>
							<Select
								onValueChange={setTone}
								defaultValue={tone}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select Tone' />
								</SelectTrigger>
								<SelectContent>
									{tones.map((t) => (
										<SelectItem
											key={t}
											value={t}
										>
											{t}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								onValueChange={setStyle}
								defaultValue={style}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select Style' />
								</SelectTrigger>
								<SelectContent>
									{styles.map((s) => (
										<SelectItem
											key={s}
											value={s}
										>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={generateContent}
							className='w-full'
						>
							Start
						</Button>

						<Card className='p-4 min-h-[80px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full'>
							<StreamingText content={generatedText} />
						</Card>
					</div>
				</CardContent>
				<VoiceInsights tab='tone-trainer' />
			</Card>
		</div>
	);
};

export default SpeechGenerator;
