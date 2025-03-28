type SpeechSegment = {
  speech_rate: number;
  type: string;
  start: number;
  end: number;
};

type VocabMeaning = {
  word: string;
  meaning: string;
};

type RepeatedWord = {
  word: string;
  count: number;
};

type GrammarError = {
  sentence: string;
  correct: string;
  explanation: string;
};

type LongSentence = {
  sentence: string;
  suggestion: string;
};

type SpeechAnalysisData<T> = {
  status: string;
  data: T;
};

type SpeechRateData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
  slowest_segment: SpeechSegment;
  fastest_segment: SpeechSegment;
};

type IntonationData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
};

type EnergyData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
};

type ConfidenceData = {
  avg: number;
  percent: number;
  category: string;
  remark: string;
};

type VocabAnalysisData = {
  repeated_words: RepeatedWord[];
  meanings: VocabMeaning[];
  grammatical_errors: GrammarError[];
  long_sentences: LongSentence[];
  modified_text: string;
  fancy_text: string;
};

type SpeechAnalysis = {
  transcription: SpeechAnalysisData<string>;
  speech_rate: SpeechAnalysisData<SpeechRateData>;
  intonation: SpeechAnalysisData<IntonationData>;
  energy: SpeechAnalysisData<EnergyData>;
  confidence: SpeechAnalysisData<ConfidenceData>;
  conversation_score: SpeechAnalysisData<number>;
  vocab_analysis: SpeechAnalysisData<VocabAnalysisData>;
  speech_rate_fig: SpeechAnalysisData<string>;
  intonation_fig: SpeechAnalysisData<string>;
};

export default SpeechAnalysis;
