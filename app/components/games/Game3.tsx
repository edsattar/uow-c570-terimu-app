import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

const cardImages = [
  "img/p1.png",
  "img/p2.png",
  "img/p3.png",
  "img/p4.png",
  "img/p5.png",
  "img/p6.png",
  "img/p7.png",
  "img/p8.png",
];

interface Game3Props {
  onGameComplete: () => void;
}

export default function Game3({ onGameComplete }: Game3Props) {
  const [cards, setCards] = useState<{ src: string; matched: boolean }[]>([]);
  const [firstChoice, setFirstChoice] = useState<any>(null);
  const [secondChoice, setSecondChoice] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((src) => ({ src, matched: false }));
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        setCards((prev) => {
          const newCards = prev.map((card) => 
            card.src === firstChoice.src ? { ...card, matched: true } : card
          );
          
          // Check if all cards are matched
          if (newCards.every(card => card.matched)) {
            setGameCompleted(true);
          }
          
          return newCards;
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  const handleChoice = (card: any) => {
    if (!disabled) {
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  const resetGame = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((src) => ({ src, matched: false }));
    setCards(shuffled);
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
    setGameCompleted(false);
  };

  const handleContinue = () => {
    onGameComplete();
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="flex flex-col items-center p-0">
        <h1 className="text-2xl font-bold mb-4">Matching Game</h1>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-4">
          {cards.map((card, index) => {
            const flipped = card === firstChoice || card === secondChoice || card.matched;
            return (
              <div
                key={index}
                className="relative w-24 aspect-[7/10] sm:w-28 cursor-pointer preserve-3d"
                onClick={() => handleChoice(card)}
              >
                {/* front */}
                <img
                  src={`/${card.src}`}
                  alt="card front"
                  style={{ backfaceVisibility: "hidden" }}
                  className={`absolute w-full h-full rounded-lg shadow-md transition-transform duration-500 ${
                    flipped ? "rotate-y-0" : "rotate-y-180"
                  }`}
                />
                {/* back */}
                <img
                  src="/img/card_back.png"
                  alt="card back"
                  style={{ backfaceVisibility: "hidden" }}
                  className={`absolute w-full h-full rounded-lg shadow-md transition-transform duration-500 ${
                    flipped ? "rotate-y-180" : "rotate-y-0"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {gameCompleted && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
            <p className="text-green-700 font-bold text-lg mb-2">🎉 Congratulations! You matched all the cards!</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Play again
          </Button>

          {gameCompleted && (
            <Button
              onClick={handleContinue}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              Continue Story
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}