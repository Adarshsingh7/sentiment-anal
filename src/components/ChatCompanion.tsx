/** @format */

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Form schema
const formSchema = z.object({
	tone: z.string().min(1, { message: 'Please select a tone' }),
	style: z.string().min(1, { message: 'Please select a style' }),
	topic: z.string().optional(),
	answers: z.record(z.string().optional()),
});

// Mock data for tone, style, and topics
const tones = [
	{ value: 'formal', label: 'Formal' },
	{ value: 'casual', label: 'Casual' },
	{ value: 'humorous', label: 'Humorous' },
	{ value: 'serious', label: 'Serious' },
];

const styles = [
	{ value: 'academic', label: 'Academic' },
	{ value: 'creative', label: 'Creative' },
	{ value: 'business', label: 'Business' },
	{ value: 'technical', label: 'Technical' },
];

// Mock topics based on tone and style combinations
const topicsByToneAndStyle = {
	'formal-academic': [
		{ value: 'research-methods', label: 'Research Methods' },
		{ value: 'literature-review', label: 'Literature Review' },
		{ value: 'data-analysis', label: 'Data Analysis' },
	],
	'formal-business': [
		{ value: 'market-analysis', label: 'Market Analysis' },
		{ value: 'strategic-planning', label: 'Strategic Planning' },
		{ value: 'financial-reporting', label: 'Financial Reporting' },
	],
	'casual-creative': [
		{ value: 'storytelling', label: 'Storytelling' },
		{ value: 'personal-blog', label: 'Personal Blog' },
		{ value: 'travel-writing', label: 'Travel Writing' },
	],
	'humorous-creative': [
		{ value: 'comedy-writing', label: 'Comedy Writing' },
		{ value: 'satire', label: 'Satire' },
		{ value: 'memes', label: 'Memes and Internet Humor' },
	],
	'serious-technical': [
		{ value: 'software-development', label: 'Software Development' },
		{ value: 'system-architecture', label: 'System Architecture' },
		{ value: 'data-science', label: 'Data Science' },
	],
	// Default topics for any combination not explicitly defined
	'default': [
		{ value: 'general-topic-1', label: 'General Topic 1' },
		{ value: 'general-topic-2', label: 'General Topic 2' },
		{ value: 'general-topic-3', label: 'General Topic 3' },
	],
};

// Mock questions based on topics
const questionsByTopic = {
	'research-methods': [
		{
			id: 'q1',
			type: 'text',
			question: 'What research methodology are you planning to use?',
		},
		{
			id: 'q2',
			type: 'radio',
			question: 'Is your research qualitative or quantitative?',
			options: ['Qualitative', 'Quantitative', 'Mixed Methods'],
		},
		{
			id: 'q3',
			type: 'checkbox',
			question: 'Which data collection methods will you employ?',
			options: ['Surveys', 'Interviews', 'Observations', 'Experiments'],
		},
	],
	'market-analysis': [
		{
			id: 'q1',
			type: 'text',
			question: 'What is the target market for your product or service?',
		},
		{
			id: 'q2',
			type: 'radio',
			question: 'What is the competitive landscape like?',
			options: [
				'Highly Competitive',
				'Moderately Competitive',
				'Low Competition',
			],
		},
		{
			id: 'q3',
			type: 'checkbox',
			question: 'Which market research methods have you used?',
			options: [
				'Surveys',
				'Focus Groups',
				'Competitor Analysis',
				'Industry Reports',
			],
		},
	],
	'storytelling': [
		{
			id: 'q1',
			type: 'text',
			question: "What's the main theme of your story?",
		},
		{
			id: 'q2',
			type: 'radio',
			question: 'What point of view will you use?',
			options: [
				'First Person',
				'Third Person Limited',
				'Third Person Omniscient',
			],
		},
		{
			id: 'q3',
			type: 'checkbox',
			question: 'Which narrative elements are important to your story?',
			options: [
				'Character Development',
				'Plot Twists',
				'Vivid Settings',
				'Dialogue',
			],
		},
	],
	'comedy-writing': [
		{
			id: 'q1',
			type: 'text',
			question: 'What type of humor are you aiming for?',
		},
		{
			id: 'q2',
			type: 'radio',
			question: 'Who is your target audience?',
			options: ['General Public', 'Niche Community', 'Specific Age Group'],
		},
		{
			id: 'q3',
			type: 'checkbox',
			question: 'Which comedy techniques will you use?',
			options: ['Irony', 'Sarcasm', 'Wordplay', 'Physical Comedy'],
		},
	],
	'software-development': [
		{
			id: 'q1',
			type: 'text',
			question: 'What problem is your software trying to solve?',
		},
		{
			id: 'q2',
			type: 'radio',
			question: 'What development methodology will you use?',
			options: ['Agile', 'Waterfall', 'DevOps'],
		},
		{
			id: 'q3',
			type: 'checkbox',
			question: 'Which technologies are you planning to use?',
			options: ['JavaScript', 'Python', 'Cloud Services', 'Databases'],
		},
	],
	// Default questions for any topic not explicitly defined
	'default': [
		{
			id: 'q1',
			type: 'text',
			question: 'Please describe your project in detail.',
		},
		{
			id: 'q2',
			type: 'radio',
			question: 'What is your timeline?',
			options: ['Short-term', 'Medium-term', 'Long-term'],
		},
		{
			id: 'q3',
			type: 'checkbox',
			question: 'What are your goals?',
			options: ['Learning', 'Professional', 'Personal', 'Other'],
		},
	],
};

export function ChatCompanion() {
	const [isLoadingTopics, setIsLoadingTopics] = useState(false);
	const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
	const [topics, setTopics] = useState<{ value: string; label: string }[]>([]);
	const [questions, setQuestions] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tone: '',
			style: '',
			topic: '',
			answers: {},
		},
	});

	const watchTone = form.watch('tone');
	const watchStyle = form.watch('style');
	const watchTopic = form.watch('topic');

	// Load topics when tone and style are selected
	const handleToneStyleChange = () => {
		if (watchTone && watchStyle) {
			setIsLoadingTopics(true);
			setQuestions([]);
			form.setValue('topic', '');
			form.setValue('answers', {});

			// Simulate API call delay
			setTimeout(() => {
				const key = `${watchTone}-${watchStyle}`;
				setTopics(
					topicsByToneAndStyle[key as keyof typeof topicsByToneAndStyle] ||
						topicsByToneAndStyle.default
				);
				setIsLoadingTopics(false);
			}, 1000);
		}
	};

	// Load questions when topic is selected
	const handleTopicChange = (value: string) => {
		if (value) {
			setIsLoadingQuestions(true);
			form.setValue('answers', {});

			// Simulate API call delay
			setTimeout(() => {
				setQuestions(
					questionsByTopic[value as keyof typeof questionsByTopic] ||
						questionsByTopic.default
				);
				setIsLoadingQuestions(false);
			}, 1500);
		} else {
			setQuestions([]);
		}
	};

	// Handle form submission
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);

		// Simulate API submission
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsSubmitting(false);

		// Reset form after submission
		form.reset({
			tone: '',
			style: '',
			topic: '',
			answers: {},
		});
		setTopics([]);
		setQuestions([]);
	};

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle>Content Generation Form</CardTitle>
				<CardDescription>
					Select your preferences to get AI-generated questions tailored to your
					needs.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<FormField
								control={form.control}
								name='tone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tone</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												handleToneStyleChange();
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a tone' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{tones.map((tone) => (
													<SelectItem
														key={tone.value}
														value={tone.value}
													>
														{tone.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											The overall tone of your content.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='style'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Style</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												handleToneStyleChange();
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a style' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{styles.map((style) => (
													<SelectItem
														key={style.value}
														value={style.value}
													>
														{style.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											The writing style for your content.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{watchTone && watchStyle && (
							<FormField
								control={form.control}
								name='topic'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												handleTopicChange(value);
											}}
											value={field.value}
											disabled={isLoadingTopics}
										>
											<FormControl>
												<SelectTrigger>
													{isLoadingTopics ? (
														<div className='flex items-center'>
															<Loader2 className='mr-2 h-4 w-4 animate-spin' />
															<span>Loading topics...</span>
														</div>
													) : (
														<SelectValue placeholder='Select a topic' />
													)}
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{topics.map((topic) => (
													<SelectItem
														key={topic.value}
														value={topic.value}
													>
														{topic.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											Choose a topic based on your selected tone and style.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{isLoadingQuestions && (
							<div className='flex justify-center py-8'>
								<Loader2 className='h-8 w-8 animate-spin text-primary' />
								<span className='ml-2 text-muted-foreground'>
									Generating questions...
								</span>
							</div>
						)}

						{!isLoadingQuestions && questions.length > 0 && (
							<div className='space-y-6 border rounded-lg p-6 bg-muted/20'>
								<h3 className='text-lg font-medium'>
									Please answer the following questions:
								</h3>

								{questions.map((q) => {
									if (q.type === 'text') {
										return (
											<FormField
												key={q.id}
												control={form.control}
												name={`answers.${q.id}`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>{q.question}</FormLabel>
														<FormControl>
															<Textarea
																placeholder='Type your answer here...'
																className='resize-none'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										);
									}

									if (q.type === 'radio') {
										return (
											<FormField
												key={q.id}
												control={form.control}
												name={`answers.${q.id}`}
												render={({ field }) => (
													<FormItem className='space-y-3'>
														<FormLabel>{q.question}</FormLabel>
														<FormControl>
															<RadioGroup
																onValueChange={field.onChange}
																value={field.value}
																className='flex flex-col space-y-1'
															>
																{q.options.map((option: string, i: number) => (
																	<div
																		key={i}
																		className='flex items-center space-x-2'
																	>
																		<RadioGroupItem
																			value={option}
																			id={`${q.id}-option-${i}`}
																		/>
																		<Label htmlFor={`${q.id}-option-${i}`}>
																			{option}
																		</Label>
																	</div>
																))}
															</RadioGroup>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										);
									}

									if (q.type === 'checkbox') {
										return (
											<FormItem
												key={q.id}
												className='space-y-3'
											>
												<FormLabel>{q.question}</FormLabel>
												<div className='space-y-2'>
													{q.options.map((option: string, i: number) => (
														<div
															key={i}
															className='flex items-center space-x-2'
														>
															<Checkbox
																id={`${q.id}-option-${i}`}
																checked={
																	form.watch(`answers.${q.id}-${i}`) === 'true'
																}
																onCheckedChange={(checked) => {
																	form.setValue(
																		`answers.${q.id}-${i}`,
																		checked ? 'true' : 'false'
																	);
																}}
															/>
															<Label htmlFor={`${q.id}-option-${i}`}>
																{option}
															</Label>
														</div>
													))}
												</div>
												<FormMessage />
											</FormItem>
										);
									}

									return null;
								})}
							</div>
						)}

						{questions.length > 0 && (
							<Button
								type='submit'
								disabled={isSubmitting}
								className='w-full'
							>
								{isSubmitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Processing...
									</>
								) : (
									'Submit'
								)}
							</Button>
						)}
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex flex-col space-y-4 border-t pt-6'>
				<p className='text-sm text-muted-foreground'>
					This form uses simulated AI responses. In a production environment, it
					would connect to an AI API to generate topics and questions based on
					your selections.
				</p>
			</CardFooter>
		</Card>
	);
}
