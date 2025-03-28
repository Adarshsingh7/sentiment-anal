import React, { ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mic, Timer, Zap } from "lucide-react";
import ImpromptuSpeakingPractice from "./ImpromptuSpeakingPractice";
import MockInterviewPractice from "./MockInterview";

interface PracticeCard {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

const PracticeSession: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  function onBack() {
    setSelectedCard(null);
  }

  const practiceCards: PracticeCard[] = [
    {
      title: "Mock Interviews",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc eget ultricies tincidunt.",
      icon: <Mic className="w-12 h-12 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Impromptu Speaking",
      description:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      icon: <Timer className="w-12 h-12 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Fast & Slow Drill",
      description:
        "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      icon: <Zap className="w-12 h-12 text-purple-600" />,
      color: "bg-purple-50",
    },
  ];
  if (selectedCard === null)
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceCards.map((card, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                className={`relative overflow-hidden transition-all duration-300 transform group-hover:scale-105 ${card.color}
                ${hoveredCard === index ? "shadow-2xl" : "shadow-lg"}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    {card.icon}
                    <CardTitle className="text-xl font-bold">
                      {card.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Hover Overlay */}
              {hoveredCard === index && (
                <div className="absolute inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setSelectedCard(index)}
                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-400 transition-colors"
                  >
                    Start Practice
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  if (selectedCard === 0) {
    return <MockInterviewPractice onBack={onBack} />;
  }
  if (selectedCard === 1) {
    return <ImpromptuSpeakingPractice onBack={onBack} />;
  }
  if (selectedCard === 2) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-4">Practice Session</h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to the practice session!
          </p>
          <button
            onClick={() => setSelectedCard(null)}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-400 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
};

export default PracticeSession;
