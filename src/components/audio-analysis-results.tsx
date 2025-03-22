/** @format */

'use client';

import {
	BarChart2,
	Volume2,
	Clock,
	Zap,
	MessageSquare,
	BookOpen,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AnalysisResultsProps {
	results: {
		confidenceScore: number;
		paceScore: number;
		energyLevel: number;
		fillerWords: {
			[key: string]: number;
		};
		vocabularyScore: number;
		feedback: string;
	};
}

export default function AudioAnalysisResults({
	results,
}: AnalysisResultsProps) {
	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-500';
		if (score >= 60) return 'text-amber-500';
		return 'text-red-500';
	};

	const getScoreLabel = (score: number) => {
		if (score >= 80) return 'Excellent';
		if (score >= 60) return 'Good';
		if (score >= 40) return 'Fair';
		return 'Needs Improvement';
	};

	const totalFillerWords = Object.values(results.fillerWords).reduce(
		(a, b) => a + b,
		0
	);

	return (
		<div className='space-y-4'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<BarChart2 className='h-5 w-5' />
						Speech Analysis Results
					</CardTitle>
					<CardDescription>
						Detailed breakdown of your speech patterns and areas for improvement
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{/* Confidence Score */}
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Volume2 className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>Confidence</span>
								</div>
								<span
									className={`text-sm font-bold ${getScoreColor(
										results.confidenceScore
									)}`}
								>
									{results.confidenceScore}%
								</span>
							</div>
							<Progress
								value={results.confidenceScore}
								className='h-2'
							/>
							<div className='text-xs text-muted-foreground'>
								{getScoreLabel(results.confidenceScore)}
							</div>
						</div>

						{/* Pace Score */}
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Clock className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>Pace</span>
								</div>
								<span
									className={`text-sm font-bold ${getScoreColor(
										results.paceScore
									)}`}
								>
									{results.paceScore}%
								</span>
							</div>
							<Progress
								value={results.paceScore}
								className='h-2'
							/>
							<div className='text-xs text-muted-foreground'>
								{getScoreLabel(results.paceScore)}
							</div>
						</div>

						{/* Energy Level */}
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Zap className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>Energy</span>
								</div>
								<span
									className={`text-sm font-bold ${getScoreColor(
										results.energyLevel
									)}`}
								>
									{results.energyLevel}%
								</span>
							</div>
							<Progress
								value={results.energyLevel}
								className='h-2'
							/>
							<div className='text-xs text-muted-foreground'>
								{getScoreLabel(results.energyLevel)}
							</div>
						</div>
					</div>

					<Separator />

					{/* Filler Words */}
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<MessageSquare className='h-4 w-4 text-muted-foreground' />
							<span className='text-sm font-medium'>Filler Words</span>
							<Badge
								variant='outline'
								className='ml-auto'
							>
								{totalFillerWords} total
							</Badge>
						</div>

						<div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
							{Object.entries(results.fillerWords).map(([word, count]) => (
								<div
									key={word}
									className='flex items-center justify-between bg-muted/50 p-2 rounded-md'
								>
									<span className='text-sm'>"{word}"</span>
									<Badge variant='secondary'>{count}×</Badge>
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Vocabulary Score */}
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<BookOpen className='h-4 w-4 text-muted-foreground' />
								<span className='text-sm font-medium'>Vocabulary</span>
							</div>
							<span
								className={`text-sm font-bold ${getScoreColor(
									results.vocabularyScore
								)}`}
							>
								{results.vocabularyScore}%
							</span>
						</div>
						<Progress
							value={results.vocabularyScore}
							className='h-2'
						/>
						<div className='text-xs text-muted-foreground'>
							{getScoreLabel(results.vocabularyScore)}
						</div>
					</div>

					<Separator />

					{/* Feedback */}
					<div className='space-y-2'>
						<h4 className='text-sm font-medium'>AI Feedback</h4>
						<div className='p-3 bg-muted/50 rounded-md text-sm'>
							{results.feedback}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
