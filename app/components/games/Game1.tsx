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
  size: number; // px
  scale?: number; // extra scale to compensate transparent padding
};

const scene = {
  background: "/img/game1/background.png",
  passage:
    "His home once sparkling crystal clean. Now a junkyard jungle. Creaky, leaky, stinky old furniture and cans and packets all tossed aside. Once lush now bare, scarring landslides, deforestation.",
  interpretation:
    "Te Rimu tells us the river and he are one. In this polluted river scene, Te Rimu can take natural forms such as an eel. Based on the story’s sequence and clues, the eel fits best here, so it is the correct choice.",
  items: [
    { id: "log", label: "Driftwood log", x: 75, y: 48, correct: false, kind: "pill", size: 140 },
    { id: "eel", label: "Eel", x: 75, y: 64, correct: true, kind: "triangle", size: 92 },
    { id: "stone", label: "River stone", x: 85, y: 80, correct: false, kind: "circle", size: 118 },
    { id: "leaf", label: "Leaf", x: 42, y: 58, correct: false, kind: "diamond", size: 72 },
  ] as SceneItem[],
};

const ICONS: Record<SceneItem["id"], string> = {
  log: "/img/game1/log.png",
  eel: "/img/game1/eel.png",
  stone: "/img/game1/stone.png",
  leaf: "/img/game1/leaf.png",
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
              <img
                src={ICONS[it.id]}
                alt={it.label}
                style={{ width: `${it.size}px`, height: `${it.size}px}`, ...(it.scale ? { transform: `scale(${it.scale})` } : {}) }}
                className="object-contain drop-shadow-sm transition-transform hover:scale-105 active:scale-95"
                draggable={false}
              />
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
                <p>After reading the story, find how Te Rimu is disguised in this scene. Tap a shape directly on the image to make your choice.</p>
                <p>You'll get immediate feedback. At any time, use “Read explanation” to view the relevant passage and a short interpretation.</p>
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