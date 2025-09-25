import React, { useState, useEffect } from "react";
import type { Route } from "./+types/quizz1";
import { Link } from "react-router";
import { useSearchParams} from "react-router";

import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    question: "Why did Te Rimu look sad and weak?",
    options: [
      "Because the river and forest were polluted",
      "Because he had no friends",
      "Because he was very old",
      "Because he lost a battle",
    ],
    answer: "Because the river and forest were polluted",
  },
  {
    question: "What problems did the river face?",
    options: [
      "Furniture and rubbish thrown in",
      "Too many fish",
      "No more sunlight",
      "Too many taniwha",
    ],
    answer: "Furniture and rubbish thrown in",
  },
  {
    question: "What else hurt the land besides rubbish?",
    options: [
      "Landslides and deforestation",
      "Heavy rain",
      "Too many waka",
      "Loud birds",
    ],
    answer: "Landslides and deforestation",
  },
  {
    question: "What did Te Rimu’s warning really mean?",
    options: [
      "People must take care of the river and forest",
      "People should move away",
      "The taniwha will punish everyone",
      "The river will dry forever",
    ],
    answer: "People must take care of the river and forest",
  },
];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Quiz" }];
}

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get("returnPage");
  const start = searchParams.get("start");

  useEffect(() => {
    if (timeLeft === 0) handleNextQuestion();
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (option: string) => {
    if (option === questions[currentQuestion].answer) {
      setScore((s) => s + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(10);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(10);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-2xl">
        {showResult ? (
          <div>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Quiz Completed!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Your Score: {score} / {questions.length}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={restartQuiz} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                Restart Quiz
              </Button>
              <Link to={`/?page=${returnPage}&start=${start}`} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Back to Story
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-purple-700 mb-4">{questions[currentQuestion].question}</h2>
            <p className="text-red-500 font-semibold mb-4">Time Left: {timeLeft}s</p>
            <div className="flex flex-col gap-3">
              {questions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

