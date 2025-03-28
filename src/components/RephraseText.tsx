import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Sparkles, Loader, ArrowLeft } from "lucide-react";
import VoiceInsights from "./VoiceInsights";

interface RephraseResults {
  [key: string]: string;
}

const RephraseText = () => {
  const [inputText, setInputText] = useState<string>("");
  const [rephraseResults, setRephraseResults] =
    useState<RephraseResults | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);

  const handleRephrase = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/generate-rephrasals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/text",
          },
          body: inputText,
        },
      );

      const data: RephraseResults = await response.json();
      console.log(data);
      setRephraseResults(data);
      setSelectedVariant(null);
      setIsPracticeMode(false);
    } catch (error) {
      console.error("Rephrasing error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (variant: string) => {
    navigator.clipboard.writeText(variant);
    setCopiedVariant(variant);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  const handlePractice = () => {
    if (selectedVariant) {
      setIsPracticeMode(true);
      console.log("Practicing variant:", selectedVariant);
    }
  };

  const handleBackToVariants = () => {
    setIsPracticeMode(false);
    setSelectedVariant(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 text-purple-600" />
          Text Rephrasing Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isPracticeMode ? (
            <>
              {/* Text Input Area */}
              <Textarea
                placeholder="Enter the text you want to rephrase..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px]"
              />

              {/* Rephrase Button */}
              <Button
                onClick={handleRephrase}
                disabled={!inputText.trim() || loading}
                className="w-full"
              >
                {loading ? (
                  <Loader className="mr-2 animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Rephrase Text
              </Button>

              {/* Rephrased Variants */}
              {rephraseResults && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Rephrased Variants
                  </h3>
                  {Object.entries(rephraseResults).map(([key, variant]) => (
                    <div
                      key={key}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedVariant === variant
                          ? "border-purple-500 bg-purple-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </h4>
                          <p className="text-gray-600">{variant}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(variant);
                            }}
                          >
                            {copiedVariant === variant ? (
                              <Check className="text-green-500" />
                            ) : (
                              <Copy className="text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Practice Button */}
                  <Button
                    onClick={handlePractice}
                    disabled={!selectedVariant}
                    className="w-full mt-4"
                  >
                    Practice Selected Variant
                  </Button>
                </div>
              )}

              {/* Only show VoiceInsights when no variant is selected and not in practice mode */}
              {rephraseResults && !selectedVariant && (
                <VoiceInsights tab="rephrase-text" />
              )}
            </>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleBackToVariants}
                className="mb-4"
              >
                <ArrowLeft className="mr-2" /> Back to Variants
              </Button>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Selected Variant
                </h3>
                <p className="text-gray-600">{selectedVariant}</p>
              </div>

              <VoiceInsights tab="chat-companion" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RephraseText;
