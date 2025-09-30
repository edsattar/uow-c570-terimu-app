import { useState, useEffect, forwardRef } from "react";
import {
  DndContext,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
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
import { Button } from "~/components/ui/button";

interface StoryEvent {
  text: string;
  img: string;
  id: number;
}
type StoryCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
  imgAlt: string;
  eventText: string;
  className?: string;
};

const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  ({ imgSrc, imgAlt, eventText, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-lg shadow-lg border-2 border-gray-300 p-2 cursor-grab active:cursor-grabbing
          flex flex-col items-center transition-transform hover:shadow-xl hover:scale-105 select-none ${className}`}
        {...props}
      >
        <img
          src={imgSrc}
          alt={imgAlt}
          className="w-full h-24 object-cover rounded-sm mb-2"
          draggable={false}
        />
        <div className="bg-orange-500 bg-opacity-80 text-white px-2 py-1 rounded-md text-center text-xs font-medium w-full">
          {eventText}
        </div>
      </div>
    );
  }
);

// StoryCard.displayName = "StoryCard";

// Draggable card component for the pool of cards below
const DraggableStoryCard = ({ event }: { event: StoryEvent }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: event.id });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <StoryCard
      ref={setNodeRef}
      imgSrc={event.img}
      imgAlt={event.text}
      eventText={event.text}
      className={isMounted && isDragging ? "opacity-0 " : ""}
      {...(isMounted ? attributes : {})}
      {...(isMounted ? listeners : {})}
    />
  );
};

// Draggable card that's placed in a slot
const SlotStoryCard = ({ event, isCorrect }: { event: StoryEvent; isCorrect: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: event.id });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <StoryCard
      ref={setNodeRef}
      imgSrc={event.img}
      imgAlt={event.text}
      eventText={event.text}
      // className={`
      //   rounded-lg shadow-lg border-2 p-3 w-full cursor-grab active:cursor-grabbing
      //   transition-all duration-200 hover:shadow-xl hover:scale-105 select-none
      //   ${isMounted && isDragging ? "opacity-50 scale-95" : ""}
      //   ${isCorrect ? "bg-white border-green-300" : "bg-red-100 border-red-300"}
      // `}
      className={
        isMounted && isDragging ? "opacity-0 " : isCorrect ? "border-green-400" : "border-red-400"
      }
      {...(isMounted ? attributes : {})}
      {...(isMounted ? listeners : {})}
    />
  );
};

// Droppable slot component for the top slots
const DroppableSlot = ({
  slotIndex,
  event,
  correctOrder,
}: {
  slotIndex: number;
  event: StoryEvent | null;
  correctOrder: StoryEvent[];
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slotIndex}`,
  });

  // Check if the card in this slot is in the correct position
  const isCorrect = event ? correctOrder[slotIndex]?.id === event.id : true;

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[200px] w-full rounded-lg border-2 p-4 transition-all duration-200
        flex flex-col items-center justify-center
        ${isOver ? "border-blue-500 border-solid bg-blue-50" : "border-dashed"}
        ${
          event
            ? isCorrect
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
            : "border-gray-400 bg-gray-100"
        }
      `}
    >
      {event ? (
        <SlotStoryCard event={event} isCorrect={isCorrect} />
      ) : (
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">{slotIndex + 1}</div>
          <div className="text-sm">Drop card here</div>
        </div>
      )}
    </div>
  );
};

// Droppable card pool component
const CardPool = ({ cardPool }: { cardPool: StoryEvent[] }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "card-pool",
  });

  return (
    <div
      ref={setNodeRef}
      className={`grid grid-cols-2 sm:grid-cols-4 gap-4 min-h-[150px] p-4 rounded-lg border-2 transition-all duration-200 ${
        isOver ? "border-blue-500 border-solid bg-blue-50" : "border-gray-300 border-dashed"
      }`}
    >
      {cardPool.length === 0 ? (
        <div className="col-span-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-lg mb-2">📚</div>
            <div className="text-sm">All cards have been placed!</div>
          </div>
        </div>
      ) : (
        cardPool.map((event) => <DraggableStoryCard key={event.id} event={event} />)
      )}
    </div>
  );
};

interface Game2Props {
  onGameComplete: () => void;
}

export default function Game2({ onGameComplete }: Game2Props) {
  // Correct order of events
  const correctOrder: StoryEvent[] = [
    { id: 1, text: "Tamatea, paddled up the river in his waka Tuwhenua", img: "/img/p7.png" },
    { id: 2, text: "The forest is pollluted and damaged, ", img: "/img/p15.png" },
    { id: 3, text: "Aroha sees a log floating upstream", img: "/img/p10.png" },
    { id: 4, text: "The log turns toward Aroha and she screams", img: "/img/p12.png" },
    { id: 5, text: "Te Rimu pleads for help with the polluted river", img: "/img/p14.png" },
    { id: 6, text: "Tawa is called to help clean the river", img: "/img/p16.png" },
    { id: 7, text: "The people work to restore the river", img: "/img/p18.png" },
    { id: 8, text: "Te Rimu continues to watch over the clean river", img: "/img/p19.png" },
  ];

  // State for the 8 slots at the top (initially all empty)
  const [slots, setSlots] = useState<(StoryEvent | null)[]>(new Array(8).fill(null));

  // State for the cards in the pool below (initially all cards, scrambled)
  const [cardPool, setCardPool] = useState<StoryEvent[]>(() =>
    [...correctOrder].sort(() => Math.random() - 0.5)
  );

  const [result, setResult] = useState<string>("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

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
    setActiveId(null);

    if (!over) return;

    const activeCardId = active.id as number;
    const overId = over.id as string;

    // Find where the dragged card currently is
    const cardInPool = cardPool.find((card) => card.id === activeCardId);
    const sourceSlotIndex = slots.findIndex((slot) => slot?.id === activeCardId);

    // Handle sortable reordering within slots (when dragging card to card)
    const overCardId = typeof overId === "string" ? parseInt(overId) : overId;
    if (
      sourceSlotIndex !== -1 &&
      !isNaN(overCardId) &&
      !overId.toString().startsWith("slot-") &&
      overId !== "card-pool"
    ) {
      const targetSlotIndex = slots.findIndex((slot) => slot?.id === overCardId);

      if (targetSlotIndex !== -1 && targetSlotIndex !== sourceSlotIndex) {
        // Reorder: swap the positions of the two cards
        setSlots((prev) => {
          const newSlots = [...prev];
          const temp = newSlots[sourceSlotIndex];
          newSlots[sourceSlotIndex] = newSlots[targetSlotIndex];
          newSlots[targetSlotIndex] = temp;
          return newSlots;
        });
        return;
      }
    }

    // Handle sortable reordering within pool (if needed)
    if (cardInPool && !isNaN(overCardId) && cardPool.find((c) => c.id === overCardId)) {
      const oldIndex = cardPool.findIndex((card) => card.id === activeCardId);
      const newIndex = cardPool.findIndex((card) => card.id === overCardId);

      if (oldIndex !== newIndex) {
        setCardPool((prev) => arrayMove(prev, oldIndex, newIndex));
        return;
      }
    }

    // Handle drop operations (dropping on slots or pool areas)
    if (overId.startsWith("slot-")) {
      const targetSlotIndex = parseInt(overId.replace("slot-", ""));

      if (cardInPool) {
        // Card is coming from pool
        if (slots[targetSlotIndex] === null) {
          // Move card from pool to empty slot
          setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[targetSlotIndex] = cardInPool;
            return newSlots;
          });
          setCardPool((prev) => prev.filter((card) => card.id !== activeCardId));
        } else {
          // Swap: card from pool to slot, slot card to pool
          const existingCard = slots[targetSlotIndex];
          setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[targetSlotIndex] = cardInPool;
            return newSlots;
          });
          setCardPool((prev) => [
            ...prev.filter((card) => card.id !== activeCardId),
            existingCard!,
          ]);
        }
      } else if (sourceSlotIndex !== -1) {
        // Card is coming from another slot
        if (slots[targetSlotIndex] === null) {
          // Move card from slot to empty slot
          setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[sourceSlotIndex] = null;
            newSlots[targetSlotIndex] = slots[sourceSlotIndex];
            return newSlots;
          });
        } else {
          // Swap cards between two slots
          const sourceCard = slots[sourceSlotIndex];
          const targetCard = slots[targetSlotIndex];
          setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[sourceSlotIndex] = targetCard;
            newSlots[targetSlotIndex] = sourceCard;
            return newSlots;
          });
        }
      }
    }
    // Check if dropped back to pool
    else if (overId === "card-pool") {
      if (sourceSlotIndex !== -1) {
        // Move card from slot back to pool
        const card = slots[sourceSlotIndex];
        setSlots((prev) => {
          const newSlots = [...prev];
          newSlots[sourceSlotIndex] = null;
          return newSlots;
        });
        if (card) {
          setCardPool((prev) => [...prev, card]);
        }
      }
    }
  };

  const checkOrder = () => {
    // Check if all slots are filled and in correct order
    const filledSlots = slots.filter((slot) => slot !== null);
    if (filledSlots.length !== 8) {
      setResult("❌ Please fill all 8 slots first.");
      setGameCompleted(false);
      return;
    }

    const currentOrder = slots.map((slot) => slot!.text);
    const correctTexts = correctOrder.map((event) => event.text);

    if (JSON.stringify(currentOrder) === JSON.stringify(correctTexts)) {
      setResult("✅ Ka pai! You got the story right!");
      setGameCompleted(true);
    } else {
      setResult("❌ Try again, Te Rimu's story is still jumbled.");
      setGameCompleted(false);
    }
  };

  const resetGame = () => {
    setSlots(new Array(8).fill(null));
    setCardPool([...correctOrder].sort(() => Math.random() - 0.5));
    setResult("");
    setGameCompleted(false);
  };

  const handleContinue = () => {
    onGameComplete();
  };

  // Render static version during SSR and hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Arrange the Te Rimu Story in the Correct Order
          </h2>

          {/* Empty slots at top */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Story Timeline (1-8)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="min-h-[200px] w-full rounded-lg border-2 border-dashed border-gray-400 bg-gray-100
                            flex flex-col items-center justify-center p-4 transition-all duration-200"
                >
                  <div className="text-gray-500 text-center">
                    <div className="text-2xl mb-2">{i + 1}</div>
                    <div className="text-sm">Drop card here</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards pool at bottom */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Story Cards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cardPool.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-3 cursor-grab
                            flex flex-col items-center transition-all duration-200
                            hover:shadow-xl hover:scale-105 select-none"
                >
                  <img
                    src={event.img}
                    alt={event.text}
                    className="w-full h-24 object-cover rounded-md mb-2"
                    draggable={false}
                  />
                  <div className="bg-orange-500 bg-opacity-80 text-white px-2 py-1 rounded-md text-center text-xs font-medium w-full">
                    {event.text}
                  </div>
                </div>
              ))}
            </div>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
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
          {/* Empty slots at top */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Story Timeline (1-8)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SortableContext items={slots.filter((s) => s !== null).map((s) => s!.id)}>
                {slots.map((slot, index) => (
                  <DroppableSlot
                    key={index}
                    slotIndex={index}
                    event={slot}
                    correctOrder={correctOrder}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          {/* Cards pool at bottom */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Story Cards</h3>
            <SortableContext items={cardPool.map((c) => c.id)}>
              <CardPool cardPool={cardPool} />
            </SortableContext>
          </div>

          {isMounted && activeId && (
            <DragOverlay>
              {(() => {
                const activeEvent = [...cardPool, ...slots.filter((s) => s !== null)].find(
                  (event) => event?.id === activeId
                );
                return activeEvent ? (
                  <div
                    className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-3 cursor-grab
                                flex flex-col items-center transition-all duration-200 select-none opacity-90"
                  >
                    <img
                      src={activeEvent.img}
                      alt={activeEvent.text}
                      className="w-full h-24 object-cover rounded-md mb-2"
                      draggable={false}
                    />
                    <div className="bg-orange-500 bg-opacity-80 text-white px-2 py-1 rounded-md text-center text-xs font-medium w-full">
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
            {gameCompleted && (
              <Button
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full"
              >
                Continue Story
              </Button>
            )}
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
              <strong>Instructions:</strong> Drag the story cards from the bottom pool and drop them
              into the numbered slots above in the correct order.
              <br />
              <span className="text-xs">
                Touch devices: Touch and hold to drag items. You can also drag cards back to the
                pool or swap between slots.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
