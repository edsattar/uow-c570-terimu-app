import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type SceneItem = {
  id: "log" | "eel" | "stone" | "leaf";
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  correct: boolean;
  kind: "pill" | "triangle" | "circle" | "diamond";
};

const scene = {
  background: "/img/g1.png",
  passage:
    "His home once sparkling crystal clean. Now a junkyard jungle. Creaky, leaky, stinky old furniture and cans and packets all tossed aside. Once lush now bare, scarring landslides, deforestation.",
  interpretation:
    "Te Rimu tells us the river and he are one. In this scene, the river suffers from pollution and neglect. Te Rimu remains present and watchful, often blending into the river as a piece of driftwood. That's why the driftwood log is the correct choice here.",
  items: [
    { id: "log", label: "Driftwood log", x: 22, y: 68, correct: true, kind: "pill" },
    { id: "eel", label: "Eel", x: 70, y: 40, correct: false, kind: "triangle" },
    { id: "stone", label: "River stone", x: 48, y: 75, correct: false, kind: "circle" },
    { id: "leaf", label: "Leaf", x: 82, y: 28, correct: false, kind: "diamond" },
  ] as SceneItem[],
};

interface Game1Props {
  onGameComplete: () => void;
}

export default function Game1({ onGameComplete }: Game1Props) {
  const [selected, setSelected] = useState<SceneItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleItemSelect = (item: SceneItem) => {
    setSelected(item);
    if (item.correct) {
      setGameCompleted(true);
    }
  };

  const handleContinue = () => {
    onGameComplete();
  };

  return (
    <div className="min-h-dvh h-dvh p-4 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Find Te Rimu</h1>
          <Button
            aria-label="How to play"
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => setShowHelp(true)}
          >
            ?
          </Button>
        </div>
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
          <img src={scene.background} alt="River scene" className="object-cover object-bottom w-full h-full" />
          {scene.items.map((it) => (
            <button
              key={it.id}
              aria-label={it.label}
              onClick={() => handleItemSelect(it)}
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              {it.kind === "pill" ? (
                <div className="w-14 h-8 rounded-full bg-amber-700/70 border-2 border-white shadow-sm hover:scale-105 active:scale-95 transition" />
              ) : it.kind === "triangle" ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  className="drop-shadow-sm hover:scale-105 active:scale-95 transition"
                >
                  <polygon points="16,2 30,30 2,30" fill="rgb(59 130 246 / 0.7)" stroke="white" strokeWidth="2" />
                </svg>
              ) : it.kind === "circle" ? (
                <div className="w-12 h-12 rounded-full bg-gray-500/70 border-2 border-white shadow-sm hover:scale-105 active:scale-95 transition" />
              ) : (
                <div className="w-10 h-10 bg-green-600/70 border-2 border-white shadow-sm rotate-45 hover:scale-105 active:scale-95 transition" />
              )}
            </button>
          ))}
        </div>
        
        {selected && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" role="dialog" aria-modal="true">
            <Card className="w-[min(92vw,480px)] p-5">
              <h3 className="text-lg font-semibold">
                {selected.correct ? "Correct!" : "Try again"}
              </h3>
              <p className={`mt-1 ${selected.correct ? "text-green-600" : "text-red-600"}`}>
                {selected.correct ? "Congratulations! You found Te Rimu." : "Not quite. Try again."}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => setShowDetails((v) => !v)}>
                  {showDetails ? "Hide explanation" : "Read explanation"}
                </Button>
              </div>
              {showDetails && (
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-medium">Passage</p>
                  <p className="mt-1">{scene.passage}</p>
                  <p className="mt-3 font-medium">Interpretation</p>
                  <p className="mt-1">{scene.interpretation}</p>
                </div>
              )}
              <div className="mt-5 flex justify-end gap-2">
                {selected.correct && gameCompleted ? (
                  <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700">
                    Continue Story
                  </Button>
                ) : (
                  <Button onClick={() => { setShowDetails(false); setSelected(null); }} variant="outline">
                    Close
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {showHelp && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" role="dialog" aria-modal="true">
            <Card className="w-[min(92vw,520px)] p-5">
              <h3 className="text-lg font-semibold">How to Play</h3>
              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <p>Te Rimu can take many forms. In this scene, tap on one of the visible shapes placed on the image to guess what Te Rimu disguises as.</p>
                <p>If you're correct, you'll be congratulated. You can also choose to read an explanation. If you guess wrong, try again or open the explanation for clues.</p>
              </div>
              <div className="mt-5 flex justify-end">
                <Button variant="outline" onClick={() => setShowHelp(false)}>Close</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}