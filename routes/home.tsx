import type { Route } from "./+types/home";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import MatchingGame from "../components/ui/MatchingGame";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [{ title: "TeRimu" }, { name: "description", content: "Story of TeRimu" }];
}

export default function Home() {
  const [lang, setLang] = useState<"mi" | "en">("mi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Touch event handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
  };

  const toggleLanguage = () => {
    setLang(lang === "mi" ? "en" : "mi");
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setIsPlaying(false);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setIsPlaying(false);
    }
  };

  const restartStory = () => {
    setCurrentPage(0);
    setIsPlaying(false);
    setHasStarted(true);
  };

  const startReading = () => {
    setHasStarted(true);
    setIsPlaying(true);
  };
  const location = useLocation();

  useEffect(() => {
  // если пришли из игры
    const startPage = (location.state as any)?.startPage as number | undefined;
    if (startPage != null) {
      setHasStarted(true);
      const idx = story.pages.findIndex(p => p.id === startPage);
      setCurrentPage(idx >= 0 ? idx : 0);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-2xl gap-2">
          <div className="mb-6">
            <img src={story.coverImage} alt={story.title.mi} className="mx-auto rounded-lg" />
          </div>
          <h1 className="text-3xl font-bold">{story.title.mi}</h1>
          <h1 className="text-xl mb-4 text-muted-foreground">{story.title.en}</h1>
          <p className="text-gray-600 mb-6"></p>
          <Button
            onClick={startReading}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
          >
            Start Reading
          </Button>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-dvh h-dvh bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4 flex">
      <div className="max-w-4xl mx-auto grow flex flex-col">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{story.title.en}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            {/* <span>
              Page {currentPage + 1} of {story.pages.length}
            </span> */}
            <div className="flex gap-1">
              {story.pages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPage ? "bg-purple-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Main Story Card */}
        <div 
          className="shadow-2xl rounded-2xl overflow-hidden p-0 grow flex flex-col"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Story Image */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <img
              src={story.pages[currentPage].img || "/img/placeholder.png"}
              alt={story.title.en}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex">
              <button className="grow" onClick={prevPage}></button>
              <button className="grow" onClick={nextPage}></button>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-6 flex flex-col justify-between grow sm:min-h-72">
            <div className="">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">{story.title[lang]}</h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleLanguage}
                    size="lg"
                    className="w-32 ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full"
                  >
                    {lang === "mi" ? "English" : "Te Reo Māori"}
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
	      {story.pages[currentPage].game === "memory" ? (
              	<div>
		      <Link
			to="game"
			className="inline-block px-4 py-2 mt-4 bg-orange-500 text-white font-bold rounded-lg shadow hover:bg-orange-600 transition"
			state={{ fromChapter: story.pages[currentPage].id }}
		      > Play
		      </Link>
		    </div>
	      		): (
			    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
			      {story.pages[currentPage].text[lang]}
			    </p>
			  )
	      	}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={restartStory}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>

              <Button
                onClick={nextPage}
                disabled={currentPage === story.pages.length - 1}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const story = {
  title: {
    en: "Te Rimu the taniwha",
    mi: "Te Rimu te taniwha",
  },
  author: "Unknown",
  description: "A story about Te Rimu, a taniwha who watches over the Waioweka river.",
  coverImage: "/img/cover.png",
  pages: [
    {
      id: 1,
      img: "/img/p1.png",
      text: {
        en: "In the small settlement of Waioweka, an area surrounded by beautiful lush forests, with trees as old as Papatūānuku herself, stories of a local taniwha are told.",
        mi: "I te rohe paku o Waioweka, he wāhi kua karapotihia e tētahi ngahere ātaahua, matomato te tipu o te rākau tawhito, he pērā te tawhito ki a Papatūānuku tonu, ā, kua pūrākautia tētahi taniwha.",
      },
      imgGenPrompt:
        "A lush forest with ancient trees, a serene river flowing through, and a mystical Maori creature taniwha lurking in the shadows. Water colors, greens, and hints of Maori art style.",
    },
    {
      id: 2,
      img: "/img/p2.png",
      text: {
        en: "A taniwha who lives in the rohe of Ngāti Ira. A wise and wary, watchful taniwha. My people call him Te Rimu.",
        mi: "He taniwha noho i te rohe o Ngāti Ira. He ruānuku, he ruha, he matapopore te taniwha nei. Ka karangahia ia e tōku iwi, ko Te Rimu.",
      },
      imgGenPrompt:
        "A mystical taniwha named Te Rimu, with a wise and watchful expression, blending into the lush forest background. Water colors, greens, and hints of Maori art style.",
    },
    {
      id: 3,
      img: "/img/p3.png",
      text: {
        en: "Te Rimu likes to swim up and down the Waioweka river amidst the dark mysterious depths of Hinerae. Creeping in and out of the shallow waters, that whirl and twirl through the gushing rapids. Feeding in the dark, damp swamps of Oamokura.",
        mi: "Ka rawe ki a Te Rimu te kau i te awa o Waioweka ki ngā wāhi pōuri, porehu, hohonu o Hinerae. He konohi haere i ngā wai pākihikihi, e kōriporipo ana, e koromiomio ani ngā tāheke hīrere. E kai ana ki ngā whenua reporepo o Oāmokura.",
      },
      imgGenPrompt:
        "Te Rimu swimming in the Waioweka river, surrounded by dark, mysterious waters and lush greenery. Water colors, greens, and hints of Maori art style.",
    },
    {
      id: 4,
      img: "/img/p4.png",
      text: {
        en: "Occasionally basking in the warmth of the sun beaming down from high above.",
        mi: "Putuputu ai tana pāinaina i te mahanatanga o te rā e whiti mai ana i runga ake.",
      },
      imgGenPrompt:
        "Te Rimu basking in the sunlight, with rays shining through the trees, creating a serene atmosphere. Water colors, greens, and hints of Maori art style.",
    },
    {
      id: 5,
      img: "/img/p5.png",
      text: {
        en: "Sometimes he looks like a log… A gigantic, grey, knotty, knobbly old log.",
        mi: "I ētahi wā he poro rākau tōna rite… He kaitā, he kiwikiwi, he pūpeka, he poro rākau tawhito pakoki.",
      },
      imgGenPrompt:
        "A gigantic, grey, knotty log lying in a serene river, surrounded by lush greenery. Water colors, greens, and hints of Maori art style.",
    },
    {
      id: 6,
      img: "/img/p6.png",
      text: {
        en: "And sometimes he looks like an eel… A GINORMOUS bigger than enormous, slippery, slithery, grandpa eel.",
        mi: "Ā, i ētahi wā he tuna tōna rite…. He tuna matarahi nui ake i te rahi, he pākehokeho, he pāhekeheke te koroua rā.",
      },
      imgGenPrompt:
        "A ginormous, slippery eel swimming in a river, blending with the water and surrounded by lush vegetation. Water colors, greens, and hints of Maori art style.",
    },
    {
      id: 7,
      game: "memory", // пометка, что это не текст, а игра
      text: {
        en: "Mini-game: Match the cards to help the hero continue!",
        mi: "Kēmu iti: Kimihia ngā kāri kia haere tonu te toa!",
      }
    },
    {
      id: 8,
      text: {
        en: "He has been around since days of old.",
        mi: "Mai anō, mai anō tana noho ki konei.",
      },
    },
    {
      id: 9,
      text: {
        en: "He was here when our tipuna Tamatea, paddled up the river in his waka Tuwhenua.",
        mi: "I konei ia i te taetanga mai o tō mātou tipuna a Tamatea, i a ia e hoe ana i tōna waka a Tūwhenua.",
      },
    },
    {
      id: 10,
      text: {
        en: "He was here when the beautiful wāhine bathed in the river.",
        mi: "I konei ia i te wā e kaukau ana ngā wāhine i te awa.",
      },
    },
    {
      id: 11,
      text: {
        en: "He was here when the soldiers rode into battle of Te Tarata.",
        mi: "I konei ia i te urutomokanga a ngā hoia ki te pakanga o Te Tarata.",
      },
    },
    {
      id: 12,
      text: {
        en: "He was here when a young Aroha sat on the rivers’ edge watching as a log floated upstream of the Waioweka river.",
        mi: "I konei ia i te wā e noho ana a Aroha ki ngā tahataha o te awa e tiro ana ki te poro rākau e pōtere ana i te awa o Waioweka.",
      },
    },
    {
      id: 13,
      text: {
        en: "Bewildered she sat, confused as can be. “Are my eyes deceiving me?” “How is that possible?” “How can that be?” Did that knobbly old log just wink at me?",
        mi: "He pōkīkī tana noho, he pōkaikaha tonu. “E hika, kei te tika taku titiro?” “E tareka ana?” “E pēhea nei?” “I kemo mai taua poro rākau tawhito, pakoki ki ahau?”",
      },
    },
    {
      id: 14,
      text: {
        en: "The knobbly old log slowly turned towards her. Inching closer and closer. A terrified Aroha screams out with fright, Aiiiii! Stunned, astounded, eyes ablaze. The memories awoken of stories very seldom told.",
        mi: "I āta huri te poro rākau tawhito, pakoki ki a ia.  Ka whakatata ake, ka whakatata ake. Kōtore whererei te Aroha rā. “Aiiiii!!” tana tīwaharoa. Ka pūkanakana, ka whākanakana ngā whatu. Ka maumaharatia ngā pūrākau kāore i tino kōrerotia.",
      },
    },
    {
      id: 15,
      text: {
        en: "Te Rimu the taniwha, who transforms at will, from a gigantic old log to a slippery, slithery grandpa eel. Looking ill of health and oh so frail.",
        mi: "Te Rimu te taniwha, ka huri hei poro rākau kaitā tawhito ki tētahi tuna pākehokeho, pāhekeheke, koroua te āhua.  He kōpīpī, he hōngoingoi, auē taukuri e.",
      },
    },
    {
      id: 16,
      text: {
        en: "“It’s a sign! It’s a warning!”, hushed whispers all around. Filled with wonder and astonishment, some with knees knocking in fear. With a voice as deep as the mysterious depths of Hinerae itself, And as warm as the basking waters of Oamokura The old taniwha whispers, “The river and I are one and the same”. “Please help” he pleads, all sad and forlorn.",
        mi: "“He tohu! He whakatūpato!”, te karanga a ngā pakeke. Ka tere mai te iwi, ētahi ka wewehi, ētahi ka wiwini. Nō te tatanga a Te Rimu ki te pari ka mārama te karere. He āta tūtei i te iwi ka tomokia tōna rohe.",
      },
    },
    {
      id: 17,
      text: {
        en: "His home once sparkling crystal clean. Now a junkyard jungle. Creaky, leaky, stinky old furniture and cans and packets all tossed aside. Once lush now bare, scarring landslides, deforestation. This can’t be right or is it just me?",
        mi: "Mārakerake te kite i te pūtake o te raru. He rawa whare, he para kei ngā tahataha rori. He horo whenua nā te whakarakenga o ngā rākau paina. Kāore tēnei i te pai, kua hē rānei ahau?",
      },
    },
    {
      id: 18,
      text: {
        en: "One call to Tawa, our local heroine. The love for the land flowing strong from within. Ensuring the teachings of her elders remain.",
        mi: "Kotahi te karanga atu ki a Tawa, te kaitiaki, te tuawahine o Ngāti Ira tonu. Ko te aroha nui ki te whenua kei ōna iaia tonu. E mau tonu ana ki ngā kōrero tuku iho a rātou mā.",
      },
    },
    {
      id: 19,
      text: {
        en: "With a plan of attack, neon jackets and protective blessings to start things right. One bag, two bags, three bags, four. This mammoth task, so huge and colossal.",
        mi: "Kua whakarite rautaki, kuhuna ngā koti haumaru me te whakarite karakia kia tika rawa ngā mahi. Ka timata te iwi i te waitara nui. He takitoru, he takiwhā ngā ohu, he kohi para ki te tōnga rānō o te rā.",
      },
    },
    {
      id: 20,
      text: {
        en: "Throughout the year they work with care, planting, protecting, and restoring what was lost. The forests begin to breathe again. The waters, whirling and twirling once again clear.",
        mi: "Ngākau tapatahi ana te iwi ki te kaupapa, kia matomato anō te tipu o te ngahere, kia toitū te whenua. Ko ngā wai whakaata e kōriporipo ana, e koromiomio ana i te awa o Waioweka.",
      },
    },
    {
      id: 21,
      text: {
        en: "And as the centuries pass by old Te Rimu still remains. Still watching – quiet and wise.",
        mi: "Rautau atu, rautau mai e nonoho tonu ana te koroua a Te Rimu ki tōna awa. He āta tūtei i te iwi ka tomokia tōna rohe.",
      },
    },
    {
      id: 22,
      text: {
        en: "Te Rimu the taniwha, the shape changing tipua. Sometimes he looks like a log… A gigantic, grey, knotty, knobbly old log. And sometimes he looks like an eel… A GINORMOUS bigger than enormous, slippery, slithery, grandpa eel.",
        mi: "He taniwha, he tipua I ētahi wā he poro rākau tōna rite… He kaitā, he kiwikiwi, he pūpeka, he pakoki te poro rākau tawhito. Ā, i ētahi wā he tuna tōna rite…. He tuna matarahi nui ake i te rahi, he pākehokeho, he pāhekeheke te koroua rā.",
      },
    },
    {
      id: 23,
      text: {
        en: "Maybe you have seen him, you just don’t know it.",
        mi: "Tērā pea kua kite kē koe i a ia, engari tē mōhio i a koe.",
      },
    },
  ],
};
