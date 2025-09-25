import type { Route } from "./+types/game2";
import { Button } from "~/components/ui/button";
import { useSearchParams, Link } from "react-router";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Te Rimu Story Sequencing Game" },
    { name: "description", content: "Arrange the Te Rimu story in the correct order" },
  ];
}

interface StoryEvent {
  text: string;
  img: string;
  id: number;
}

const SortableStoryCard = ({ event }: { event: StoryEvent }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: event.id });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white rounded-lg shadow-lg border-2 border-gray-300 p-3 cursor-grab active:cursor-grabbing
        flex flex-col items-center transition-all duration-200
        hover:shadow-xl hover:scale-105 select-none
        ${isMounted && isDragging ? "opacity-50 scale-95" : ""}
      `}
      {...(isMounted ? attributes : {})}
      {...(isMounted ? listeners : {})}
    >
      <img
        src={event.img}
        alt={event.text}
        className="w-full h-32 object-cover rounded-md mb-3"
        draggable={false}
      />
      <div className="bg-orange-500 bg-opacity-80 text-white px-3 py-2 rounded-md text-center text-sm font-medium w-full">
        {event.text}
      </div>
    </div>
  );
};

export default function Game2() {
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get("returnPage");
  const start = searchParams.get("start");
  // Correct order of events
  const correctOrder: StoryEvent[] = [
    { id: 1, text: "Tamatea, paddled up the river in his waka Tuwhenua", img: "/img/p8.png" },
    { id: 2, text: "The forest is pollluted and damaged, ", img: "/img/p16.png" },
    { id: 3, text: "Aroha sees a log floating upstream", img: "/img/p11.png" },
    { id: 4, text: "The log turns toward Aroha and she screams", img: "/img/p13.png" },
    { id: 5, text: "Te Rimu pleads for help with the polluted river", img: "/img/p15.png" },
    { id: 6, text: "Tawa is called to help clean the river", img: "/img/p17.png" },
    { id: 7, text: "The people work to restore the river", img: "/img/p19.png" },
    { id: 8, text: "Te Rimu continues to watch over the clean river", img: "/img/p20.png" },
  ];

  // Initialize with scrambled order
  const [events, setEvents] = useState<StoryEvent[]>(() =>
    [...correctOrder].sort(() => Math.random() - 0.5)
  );

  const [result, setResult] = useState<string>("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback during drag over
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setEvents((events) => {
        const oldIndex = events.findIndex((event) => event.id === active.id);
        const newIndex = events.findIndex((event) => event.id === over.id);
        return arrayMove(events, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const checkOrder = () => {
    const currentOrder = events.map((event) => event.text);
    const correctTexts = correctOrder.map((event) => event.text);

    if (JSON.stringify(currentOrder) === JSON.stringify(correctTexts)) {
      setResult("✅ Ka pai! You got the story right!");
    } else {
      setResult("❌ Try again, Te Rimu's story is still jumbled.");
    }
  };

  const resetGame = () => {
    setEvents([...correctOrder].sort(() => Math.random() - 0.5));
    setResult("");
  };

  // Render static version during SSR and hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Arrange the Te Rimu Story in the Correct Order
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-3 cursor-grab
                          flex flex-col items-center transition-all duration-200
                          hover:shadow-xl hover:scale-105 select-none"
              >
                <img
                  src={event.img}
                  alt={event.text}
                  className="w-full h-32 object-cover rounded-md mb-3"
                  draggable={false}
                />
                <div className="bg-orange-500 bg-opacity-80 text-white px-3 py-2 rounded-md text-center text-sm font-medium w-full">
                  {event.text}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="space-x-4">
              <Button
                onClick={checkOrder}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Check Order
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="font-semibold py-2 px-6 rounded-full"
              >
                Reset Game
              </Button>
            </div>

            {result && (
              <p
                className={`text-lg font-bold ${
                  result.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {result}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Arrange the Te Rimu Story in the Correct Order
        </h2>

        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            <SortableContext items={events.map((event) => event.id)}>
              {events.map((event) => (
                <SortableStoryCard key={event.id} event={event} />
              ))}
            </SortableContext>
          </div>

          {isMounted && activeId && (
            <DragOverlay>
              {(() => {
                const activeEvent = events.find((event) => event.id === activeId);
                return activeEvent ? (
                  <div
                    className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-3 cursor-grab
                                flex flex-col items-center transition-all duration-200 select-none opacity-90"
                  >
                    <img
                      src={activeEvent.img}
                      alt={activeEvent.text}
                      className="w-full h-32 object-cover rounded-md mb-3"
                      draggable={false}
                    />
                    <div className="bg-orange-500 bg-opacity-80 text-white px-3 py-2 rounded-md text-center text-sm font-medium w-full">
                      {activeEvent.text}
                    </div>
                  </div>
                ) : null;
              })()}
            </DragOverlay>
          )}
        </DndContext>

        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Button
              onClick={checkOrder}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-full"
            >
              Check Order
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="font-semibold py-2 px-6 rounded-full"
            >
              Reset Game
            </Button>
            <Button asChild variant="outline" 
             className="font-semibold py-2 px-6 rounded-full">
              <Link to={`/?page=${returnPage}&start=${start}`}>Return to Story</Link>
            </Button>
          </div>

          {result && (
            <p
              className={`text-lg font-bold ${
                result.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {result}
            </p>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-white bg-opacity-70 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Instructions:</strong> Drag and drop the cards to arrange them in the correct
              story order.
              <br />
              <span className="text-xs">Touch devices: Touch and hold to drag items.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
