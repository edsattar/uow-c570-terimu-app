import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const cardImages = [
  "images/img1.png",
  "images/img2.png",
  "images/img3.png",
  "images/img4.png",
  "images/img5.png",
  "images/img6.png",
  "images/img7.png",
  "images/img8.png",
];

function MatchingGame() {
  const [cards, setCards] = useState<{ src: string; matched: boolean }[]>([]);
  const [firstChoice, setFirstChoice] = useState<any>(null);
  const [secondChoice, setSecondChoice] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);

  // <<< ВАЖНО: читаем state ДО return >>>
  const location = useLocation();
  const navigate = useNavigate();
  const fromChapter: number = location.state?.fromChapter ?? 1;

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
        setCards((prev) =>
          prev.map((card) =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );
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

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Matching Game</h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const flipped =
            card === firstChoice || card === secondChoice || card.matched;
          return (
            <div
              key={index}
              className="relative w-24 h-32 sm:w-28 sm:h-36 cursor-pointer"
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
                src="/blank.png"
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

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Play again
        </button>

        {/* Возвращаемся на Home и передаём стартовую главу */}
        <Link
          to="/"
          state={{ startPage: fromChapter }}
          className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg shadow hover:bg-orange-600 transition"
        >
          Back to story
        </Link>
        {/* Альтернатива без state: <button onClick={() => navigate(-1)}>Back</button> */}
      </div>
    </div>
  );
}

export default MatchingGame;
