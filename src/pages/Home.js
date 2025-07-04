
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaVolumeUp } from "react-icons/fa";
import gameApi from "../api/gameAPI";
import user1 from "../Assets/Userimg/user1.png";
import user2 from "../Assets/Userimg/user2.png";
import user3 from "../Assets/Userimg/user3.png";
import user4 from "../Assets/Userimg/user4.png";
import user5 from "../Assets/Userimg/user5.png";
import user6 from "../Assets/Userimg/user6.png";
import user7 from "../Assets/Userimg/user7.png";
import user8 from "../Assets/Userimg/user8.png";
import user9 from "../Assets/Userimg/user9.png";
import user10 from "../Assets/Userimg/user10.png";
import evo from "../Assets/winning-evo.png";
import agreeborder from "../Assets/finalicons/agreeborder.png";
import agree from "../Assets/finalicons/agree.png";
import Footer from "../components/Footer";
import Homeheader from "../components/Homeheader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import speakar from "../Assets/Homeicon/speakar.png";
import hot from "../Assets/Homeicon/hot.svg";
import smallbg from "../Assets/Homeicon/smallbg.png";
import bg from "../Assets/Homeicon/bg.png";
import wingo from "../Assets/lotteryimage/1.jpg";
import wingo1 from "../Assets/lotteryimage/2.jpg";
import wingo3 from "../Assets/lotteryimage/3.jpg";
import wingo5 from "../Assets/lotteryimage/4.jpg";
import D from "../Assets/lotteryimage/5.jpg";
import D1 from "../Assets/lotteryimage/6.jpg";
import D3 from "../Assets/lotteryimage/7.jpg";
import D5 from "../Assets/lotteryimage/8.jpg";
import K from "../Assets/lotteryimage/13.jpg";
import K1 from "../Assets/lotteryimage/14.jpg";
import K3 from "../Assets/lotteryimage/15.jpg";
import K5 from "../Assets/lotteryimage/16.jpg";
import Tir from "../Assets/lotteryimage/9.jpg";
import Tir1 from "../Assets/lotteryimage/10.jpg";
import Tir3 from "../Assets/lotteryimage/11.jpg";
import Tir5 from "../Assets/lotteryimage/12.jpg";
import close from "../Assets/finalicons/close.png";
import lotteryIcon from "../Assets/Gamecategory/lottery1.png";
import originalIcon from "../Assets/Gamecategory/original.png";
import slotsIcon from "../Assets/Gamecategory/slot.png";
import sportsIcon from "../Assets/Gamecategory/sport.png";
import popularIcon from "../Assets/Gamecategory/hotgame1.png";
import casinoIcon from "../Assets/Gamecategory/live-casino.png";
import rank from "../Assets/rank.png";
import crown1 from "../Assets/additionalicons/crown1.png";
import crown2 from "../Assets/additionalicons/crown2.png";
import crown3 from "../Assets/additionalicons/crown3.png";
import place1 from "../Assets/additionalicons/place1.png";
import place2 from "../Assets/additionalicons/place2.png";
import place3 from "../Assets/additionalicons/place3.png";
import manicon from "../Assets/finalicons/manicon.png";
import reload from "../Assets/finalicons/reload.png";
import notify from "../Assets/finalicons/notifyicon.png";
import bannerone from "../Assets/finalicons/Banner1.png";
import bannerthree from "../Assets/finalicons/Banner3.png";
import whitetick from "../Assets/whitetick.png";

// Game categories
const gameCategories = [
  { id: 1, title: "Lottery", image: lotteryIcon },
  { id: 2, title: "Hot Games", image: popularIcon },
  { id: 3, title: "Original", image: originalIcon },
  { id: 4, title: "Slots", image: slotsIcon },
  { id: 5, title: "Sports", image: sportsIcon },
  { id: 6, title: "Casino", image: casinoIcon },
];

// Array of user images for random selection
const userImages = [
  user1,
  user2,
  user3,
  user4,
  user5,
  user6,
  user7,
  user8,
  user9,
  user10,
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("Lottery");
  const [hotGames, setHotGames] = useState([]);
  const [originalGames, setOriginalGames] = useState([]);
  const [sportsGames, setSportsGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [launchingGame, setLaunchingGame] = useState(null);
  const navigate = useNavigate();
  const gameSectionRef = React.useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  // State for winners carousel
  const [winners, setWinners] = useState([
    { id: 1, name: "Mem***WOK", amount: 352.0, image: user1 },
    { id: 2, name: "Mem***VLG", amount: 1520.0, image: user2 },
    { id: 3, name: "Mem***MBK", amount: 122.2, image: user3 },
    { id: 4, name: "Mem***DCV", amount: 116.0, image: user4 },
    { id: 5, name: "Mem***BFE", amount: 446.0, image: user5 },
  ]);

  // Function to generate random winner
  const generateRandomWinner = () => {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase();
    const randomAmount = (Math.random() * (2000 - 100) + 100).toFixed(2);
    const randomImage =
      userImages[Math.floor(Math.random() * userImages.length)];
    return {
      id: Date.now(),
      name: `Mem***${randomString}`,
      amount: parseFloat(randomAmount),
      image: randomImage,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWinners((prevWinners) => {
        const newWinners = [
          generateRandomWinner(),
          ...prevWinners.slice(0, -1),
        ];
        return newWinners;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Get token from localStorage or context
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  const slidesettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
    touchMove: true,
    swipe: true,
    touchThreshold: 5,
    responsive: [
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    ],
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
    touchMove: true,
    swipe: true,
    touchThreshold: 5,
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setTimeout(() => {
      if (gameSectionRef.current) {
        gameSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    if (category === "Slots" || category === "Casino") {
      const routes = { Slots: "/SlotGame", Casino: "/casino-games" };
      navigate(routes[category] || "/");
    }
  };

  const fetchGames = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      let games = [];

      if (category === "Hot Games") {
        const response = await fetch(
          "https://strike.atsproduct.in/api/seamless-wallet/games?category=popular&limit=20",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          const gamesArray = data.games || [];
          const seenNames = new Set();
          const processedGames = gamesArray.reduce((uniqueGames, game) => {
            const gameName = (game.name || "").toLowerCase().trim();
            if (!seenNames.has(gameName) && gameName) {
              seenNames.add(gameName);
              let imagePortrait = game.image_portrait || null;
              if (!imagePortrait && game.details) {
                try {
                  const parsedDetails = JSON.parse(game.details);
                  imagePortrait = parsedDetails.image_portrait || null;
                } catch (err) {
                  console.error(
                    `Error parsing details for game ${game.id}:`,
                    err
                  );
                }
              }
              uniqueGames.push({
                id: game.id,
                name: game.name || "Unnamed Game",
                imagePortrait,
                provider: game.provider || "unknown",
              });
            }
            return uniqueGames;
          }, []);
          return processedGames;
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } else if (category === "Original") {
        const response = await fetch(
          "https://strike.atsproduct.in/api/spribe/games",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const gamesArray = Array.isArray(data.games) ? data.games : Array.isArray(data) ? data : [];
        const seenNames = new Set();
        const processedGames = gamesArray.reduce((uniqueGames, game) => {
          const gameName = (game.name || "").toLowerCase().trim();
          if (!seenNames.has(gameName) && gameName && game.isActive) {
            seenNames.add(gameName);
            uniqueGames.push({
              id: game.id,
              name: game.name || "Unnamed Game",
              thumbnailUrl: game.thumbnailUrl || null,
              provider: game.provider || "spribe_crypto",
            });
          }
          return uniqueGames;
        }, []);
        return processedGames;
      } else if (category === "Sports") {
        const providers = ["digitain", "inplaynet"];
        let allGames = [];
        const seenNames = new Set();
        for (const provider of providers) {
          try {
            const res = await gameApi.fetchGames(provider);
            const gamesArray = Array.isArray(res?.games) ? res.games : [];
            const processedGames = gamesArray.reduce((uniqueGames, game) => {
              const gameName = (game.name || "").toLowerCase().trim();
              if (!seenNames.has(gameName) && gameName) {
                seenNames.add(gameName);
                let imagePortrait = game.image_portrait || null;
                if (!imagePortrait && game.details) {
                  try {
                    const parsedDetails = JSON.parse(game.details);
                    imagePortrait = parsedDetails.image_portrait || null;
                  } catch (err) {
                    console.error(
                      `Error parsing details for game ${game.id}:`,
                      err
                    );
                  }
                }
                uniqueGames.push({
                  id: game.id,
                  name: game.name || "Unnamed Game",
                  imagePortrait,
                  provider: provider,
                });
              }
              return uniqueGames;
            }, []);
            allGames = [...allGames, ...processedGames];
          } catch (providerError) {
            console.error(
              `Failed to fetch games from provider ${provider}:`,
              providerError
            );
          }
        }
        return allGames;
      }
    } catch (err) {
      setError(err.message);
      console.error(`Failed to fetch ${category} games:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGameLaunch = async (game, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!getAuthToken()) {
      setError("Please log in to play games.");
      navigate("/login");
      return;
    }

    setLaunchingGame(game.id);
    setError(null);

    try {
      console.log(
        "Launching game:",
        game.name,
        "ID:",
        game.id,
        "Provider:",
        game.provider
      );

      let launchResponse;
      if (game.provider.includes("spribe")) {
        const token = getAuthToken();
        const response = await fetch(
          `https://strike.atsproduct.in/api/spribe/launch/${game.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        launchResponse = await response.json();
      } else {
        launchResponse = await gameApi.launchGame(game.id);
      }

      const gameUrl =
        launchResponse?.url ||
        launchResponse?.gameUrl ||
        launchResponse?.game_url ||
        launchResponse?.launchUrl ||
        launchResponse?.redirect_url;

      if (gameUrl) {
        console.log("Game URL received:", gameUrl);
        const gameWindow = window.open(
          gameUrl,
          "_blank",
          "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no"
        );

        if (!gameWindow) {
          window.location.href = gameUrl;
        }
      } else {
        console.error(
          "No game URL received from API. Response:",
          launchResponse
        );
        setError("Unable to launch game. No URL received from server.");
      }
    } catch (error) {
      console.error("Error launching game:", error);
      if (error.response?.status === 401 || error.status === 401) {
        setError("Please log in to play games.");
        navigate("/login");
      } else if (error.response?.status === 403 || error.status === 403) {
        setError("Insufficient balance or access denied.");
      } else if (error.response?.status === 404 || error.status === 404) {
        setError("Game not found or launch endpoint unavailable.");
      } else {
        setError(error.message || "Failed to launch game. Please try again.");
      }
    } finally {
      setLaunchingGame(null);
    }
  };

  useEffect(() => {
    if (activeCategory === "Hot Games") {
      fetchGames("Hot Games").then(setHotGames);
    } else if (activeCategory === "Original") {
      fetchGames("Original").then(setOriginalGames);
    } else if (activeCategory === "Sports") {
      fetchGames("Sports").then(setSportsGames);
    }
  }, [activeCategory]);

  useEffect(() => {
    const preventHorizontalSwipe = (e) => {
      if (
        Math.abs(e.touches[0].clientX - e.touches[0].screenX) >
        Math.abs(e.touches[0].clientY - e.touches[0].screenY)
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventHorizontalSwipe, {
      passive: false,
    });
    return () =>
      document.removeEventListener("touchmove", preventHorizontalSwipe);
  }, []);

  const [checked, setChecked] = useState(false);

  const earnings = [
    { id: 1, name: "Mem***AXT", amount: 213289650, rank: "N01" },
    { id: 2, name: "Mem***Y1R", amount: 174203429, rank: "N02" },
    { id: 3, name: "Mem***BBM", amount: 114002435, rank: "N03" },
    { id: 4, name: "Mem***ZJ0", amount: 106615180.0 },
    { id: 5, name: "Mem***Q21", amount: 541543016.0 },
    { id: 6, name: "Sah***dhi", amount: 528783489.0 },
    { id: 7, name: "Mem***ZJ0", amount: 106615180.0 },
    { id: 8, name: "Mem***Q21", amount: 541543016.0 },
    { id: 9, name: "Sah***dhi", amount: 528783489.0 },
  ];

  const [lotterycardData] = useState([
    {
      id: 1,
      imgSrc: wingo,
      alt: "Wingo Image",
      title: "Win Go",
      link: "/lotterywingo",
    },
    {
      id: 2,
      imgSrc: wingo1,
      alt: "Wingo 1Min Image",
      title: "Win Go 1Min",
      link: "/lotterywingo",
    },
    {
      id: 3,
      imgSrc: wingo3,
      alt: "Wingo 3Min Image",
      title: "Win Go 3Min",
      link: "/lotterywingo",
    },
    {
      id: 4,
      imgSrc: wingo5,
      alt: "Wingo 5Min Image",
      title: "Win Go 5Min",
      link: "/lotterywingo",
    },
    { id: 5, imgSrc: K, alt: "K3 Image", title: "K3 1Min", link: "/lotteryK3" },
    {
      id: 6,
      imgSrc: K1,
      alt: "K3 3Min Image",
      title: "K3 3Min",
      link: "/lotteryK3",
    },
    {
      id: 7,
      imgSrc: K3,
      alt: "K3 5Min Image",
      title: "K3 5 Min",
      link: "/lotteryK3",
    },
    {
      id: 8,
      imgSrc: K5,
      alt: "K3 10Min Image",
      title: "K3 10 Min",
      link: "/lotteryK3",
    },
    {
      id: 9,
      imgSrc: D,
      alt: "5D Image",
      title: "5D 1 Min",
      link: "/lottery5d",
    },
    {
      id: 10,
      imgSrc: D1,
      alt: "5D 3Min Image",
      title: "5D 3 Min",
      link: "/lottery5d",
    },
    {
      id: 11,
      imgSrc: D3,
      alt: "5D 5Min Image",
      title: "5D 5 Min",
      link: "/lottery5d",
    },
    {
      id: 12,
      imgSrc: D5,
      alt: "5D 10Min Image",
      title: "5D 10 Min",
      link: "/lottery5d",
    },
    {
      id: "1",
      imgSrc: Tir,
      alt: "Trx Image",
      title: "Trx 1min",
      link: "/lotterytrxwing",
    },
    {
      id: 14,
      imgSrc: Tir1,
      alt: "Trx 3min Image",
      title: "Trx 3min",
      link: "/lotterytrxwing",
    },
    {
      id: 15,
      imgSrc: Tir3,
      alt: "Trx 5min Image",
      title: "Trx 5 min",
      link: "/lotterytrxwing",
    },
    {
      id: 16,
      imgSrc: Tir5,
      alt: "Trx 10min Image",
      title: "Trx 10 Min",
      link: "/lotterytrxwing",
    },
  ]);

  const [showFirstPopup, setShowFirstPopup] = useState(true);
  const [showSecondPopup, setShowSecondPopup] = useState(false);

  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [displayedWinners, setDisplayedWinners] = useState([]);

  // Create rotated winners array for carousel effect
  useEffect(() => {
    const rotatedWinners = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentWinnerIndex + i) % winners.length;
      rotatedWinners.push(winners[index]);
    }
    setDisplayedWinners(rotatedWinners);
  }, [currentWinnerIndex, winners]);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinnerIndex((prevIndex) => (prevIndex + 1) % winners.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [winners.length]);

  const groupedLotteryGames = {
    Wingo: lotterycardData
      .filter((game) => game.title.startsWith("Win Go"))
      .slice(0, 4),
    K3: lotterycardData
      .filter((game) => game.title.startsWith("K3"))
      .slice(0, 4),
    "5D": lotterycardData
      .filter((game) => game.title.startsWith("5D"))
      .slice(0, 4),
    Trx: lotterycardData
      .filter((game) => game.title.startsWith("Trx"))
      .slice(0, 4),
  };

  return (
    <div className="relative flex flex-col items-center bg-[#242424] min-h-screen w-full max-w-full md:max-w-[400px] mx-auto overflow-x-hidden">
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 bg-red-700 px-2 py-1 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}
      <div
        className={
          showFirstPopup || showSecondPopup
            ? "opacity-50 w-full"
            : "opacity-100 w-full"
        }
      >
        <Homeheader />
        <div className="w-full flex flex-col overflow-x-hidden p-3 mt-20">
          <div className="w-full py-2 overflow-hidden">
            <Slider {...settings}>
              {[bannerone, bannerthree].map((img, index) => (
                <div key={index} className="px-1">
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-44 object-cover rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="w-full py-2 -mt-4">
            <div className="p-2 rounded-xl shadow-md">
              <div className="flex justify-between items-center w-full">
                <img src={speakar} alt="Speaker Icon" className="w-6 h-6" />
                <Link to="/notificationsService">
                  <button className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-md px-4 py-1 flex items-center justify-center">
                    <img src={hot} alt="Hot Icon" className="w-3 h-3" />
                    <span className="ml-1 text-xs font-semibold">Detail</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full relative -mt-1">
            {showPopup && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-black bg-opacity-80 px-6 py-4 rounded-xl flex flex-col items-center text-white">
                  <img
                    src={whitetick}
                    alt="Success"
                    className="w-10 h-10 mb-2 object-contain"
                  />
                  <p className="text-sm">Refresh successfully</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-full py-2 mt-4">
            <div className="flex w-full gap-2 mb-4">
              {gameCategories.slice(0, 2).map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryChange(category.title)}
                  className={`flex-1 h-[120px] flex items-start justify-between cursor-pointer rounded-lg relative overflow-hidden transition-all duration-300 ${
                    activeCategory === category.title
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${
                      category.title === "Lottery" ? "#2A3E4C" : "#3E2A4C"
                    } 0%, #1A2529 100%)`,
                  }}
                >
                  <div className="w-full h-full flex flex-row items-center justify-between p-4 relative">
                    <span className="text-white text-sm font-bold self-start">
                      {category.title}
                    </span>
                    <img
                      src={category.image}
                      alt={category.title}
                      className={`w-[220px] object-contain -mt-4 -mr-4 ${
                        category.title === "Hot Games"
                          ? "h-[300px]"
                          : "h-[220px] -mt-9"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full gap-2">
              {gameCategories.slice(2, 6).map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryChange(category.title)}
                  className={`flex-1 h-[120px] flex items-center justify-center cursor-pointer rounded-lg relative overflow-hidden transition-all duration-300 ${
                    activeCategory === category.title
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${
                      category.title === "Original"
                        ? "#4C3E2A"
                        : category.title === "Slots"
                        ? "#3E4C2A"
                        : "#4C2A4C"
                    } 0%, #1A2529 100%)`,
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-[120px] object-contain"
                    />
                    <div className="w-full text-center -mt-1">
                      <span className="text-white text-xs font-bold">
                        {category.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={gameSectionRef} className="w-full py-2 overflow-hidden">
            {activeCategory === "Lottery" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Lottery
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    when you win a super jackpot, you will receive additional
                    rewards
                  </p>
                </div>
                <div className="w-full py-2">
                  {["Wingo", "K3", "5D", "Trx"].map((groupName) => (
                    <div key={groupName} className="w-full mb-4">
                      <h3 className="text-base font-semibold flex items-center gap-2 text-white mt-4 mb-2">
                        <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                        {groupName}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {groupedLotteryGames[groupName].map((slide) => (
                          <div key={slide.id} className="w-full">
                            <Link
                              to={slide.link}
                              className="block relative hover:scale-105 transition-transform duration-200"
                            >
                              <img
                                src={slide.imgSrc}
                                alt={slide.alt}
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 p-1 rounded-b-lg"></div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeCategory === "Hot Games" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Hot Games
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    Popular games trending now
                  </p>
                </div>
                <div className="w-full py-2">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {loading ? (
                    <p className="text-white text-center">Loading games...</p>
                  ) : Array.isArray(hotGames) && hotGames.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {hotGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-auto object-contain rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-center">No games found.</p>
                  )}
                </div>
              </div>
            )}
            {activeCategory === "Original" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Original Games
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    Exclusive in-house games
                  </p>
                </div>
                <div className="w-full py-2">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {loading ? (
                    <p className="text-white text-center">Loading games...</p>
                  ) : Array.isArray(originalGames) &&
                    originalGames.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {originalGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-40 object-cover rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-center">No games found.</p>
                  )}
                </div>
              </div>
            )}
            {activeCategory === "Sports" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Sports
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    Bet on your favorite sports events
                  </p>
                </div>
                <div className="w-full py-2">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {loading ? (
                    <p className="text-white text-center">Loading games...</p>
                  ) : Array.isArray(sportsGames) && sportsGames.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {sportsGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-40 object-cover rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-center">No games found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-full py-2 bg-[#242424] rounded-lg shadow-lg mt-2 mb-3">
            <h2 className="text-lg font-bold text-[#C4933F] mb-2 border-l-4 ml-1 border-[#C4933F] pl-2">
              Winning Information
            </h2>
            <div
              className="space-y-2 ml-1 relative"
              style={{ height: "320px", overflow: "hidden" }}
            >
              {winners.map((winner, index) => (
                <div
                  key={`${winner.id}-${currentWinnerIndex}`}
                  className="flex items-center justify-between bg-[#333332] p-2 rounded-lg transition-all duration-500 ease-in-out"
                  style={{
                    opacity:
                      index === 0
                        ? 1
                        : index === 1
                        ? 0.9
                        : index === 2
                        ? 0.8
                        : index === 3
                        ? 0.7
                        : 0.6,
                    transform: `scale(${index === 0 ? 1 : index === 1 ? 0.98 : index === 2 ? 0.96 : index === 3 ? 0.94 : 0.92})`,
                    zIndex: winners.length - index,
                    animation: index === 0 ? "none" : "none",
                  }}
                >
                  <div className="flex items-center gap-1">
                    <img
                      src={winner.image}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-[#a8a5a1] font-medium text-sm">
                      {winner.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img
                      src={evo}
                      alt="User"
                      className="w-20 h-14 rounded-sm object-cover"
                    />
                    <div className="text-right">
                      <p className="text-[#C4933F] font-semibold text-xs">
                        Receive ₹{winner.amount.toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-xs">Winning amount</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full py-1 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold text-[#C4933F] mb-4 border-l-4 border-[#C4933F] pl-2 mt-4">
                Today's Earnings Chart
              </h2>
              <div
                className="relative w-full h-32 bg-cover bg-center mb-6 mt-24"
                style={{ backgroundImage: `url(${rank})` }}
              >
                {earnings.slice(0, 3).map((earner, index) => (
                  <div
                    key={earner.id}
                    className="absolute text-center text-[#8f5206]"
                    style={{
                      top: index === 0 ? "10%" : "20%",
                      left: index === 0 ? "50%" : index === 1 ? "15%" : "85%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      <img
                        src={
                          index === 0 ? crown1 : index === 1 ? crown2 : crown3
                        }
                        alt={`Crown ${index + 1}`}
                        className="w-12 h-12 mx-auto absolute -top-8 left-1/2 transform -translate-x-1/2 z-10"
                      />
                      <img
                        src={userImages[index]}
                        alt="User"
                        className="w-16 h-16 rounded-full object-cover mx-auto relative z-0"
                      />
                    </div>
                    <img
                      src={index === 0 ? place1 : index === 1 ? place2 : place3}
                      alt={`Place ${index + 1}`}
                      className="w-12 h-4 mx-auto mt-0"
                    />
                    <p className="font-medium mt-4 text-sm">{earner.name}</p>
                    <p className="text-[#8f5206] font-medium rounded-full px-2 py-0.5 bg-gradient-to-r from-[#fae59f] to-[#c4933f] mt-2 text-sm">
                      ₹{earner.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pb-10">
                {earnings.slice(3).map((earner, index) => (
                  <div
                    key={earner.id}
                    className="flex items-center justify-between bg-[#333332] p-2 rounded-lg text-xl"
                  >
                    <div className="flex items-center gap-1">
                      <p className="text-[#a8a5a1] text-base font-semibold">
                        {index + 4}
                      </p>
                      <img
                        src={userImages[index % userImages.length]}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover ml-3"
                      />
                      <span className="text-[#a8a5a1] text-sm ml-3 font-medium">
                        {earner.name}
                      </span>
                    </div>
                    <p className="text-[#8f5206] text-base px-6 py-0.5 rounded-full font-semibold bg-gradient-to-r from-[#fae59f] to-[#c4933f]">
                      ₹{earner.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {(showFirstPopup || showSecondPopup) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-center pt-[10vh] px-2">
          {showFirstPopup && (
            <div className="w-full max-w-[350px] h-auto max-h-[90vh] bg-[#333] rounded-lg shadow-lg text-white p-0 relative overflow-hidden flex flex-col items-center">
              <h2
                className="text-lg font-bold text-white py-3 w-full text-center"
                style={{
                  background:
                    "linear-gradient(to bottom, #6F6F6F 0%, #404040 100%)",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  margin: "0",
                }}
              >
                Login Welcome
              </h2>
              <div className="flex-1 overflow-y-auto px-3 pb-3 w-full flex flex-col items-center text-center">
                <div
                  className="text-black text-xs font-semibold text-center mt-4 w-fit px-2 font-[Arial] py-1"
                  style={{ backgroundColor: "rgb(255, 255, 0)" }}
                >
                  ⭐ BDGGAME.COM ⭐
                </div>
                <p className="text-base font-medium text-white tracking-wide mt-3">
                  Please Remember To Use
                </p>
                <div className="flex flex-col gap-1 mt-2 text-base">
                  {[
                    {
                      title: "Official Website",
                      subtitle: "To check latest website list",
                    },
                    { title: "Official Telegram" },
                    { title: "Official Customer Service" },
                    { title: "Agent Gold Event" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center leading-tight"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="checkbox"
                          checked
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-[#0000EE] font-bold text-sm">
                          {item.title}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-white text-sm font-[Arial] tracking-wide font-medium mt-[2px]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm font-medium">
                  <p>⭐ BDGGame Operating 5 Years+</p>
                  <p>⭐ The Most Professional Game</p>
                  <p>⭐ High Quality Agent Benefits</p>
                  <p>⭐ No.1 Casino Game Platform</p>
                </div>
                <p className="flex items-center justify-center mt-4">
                  💎{" "}
                  <span className="text-white font-medium text-sm font-[Arial]">
                    Click Promote - Become Agent
                  </span>{" "}
                  💎
                </p>
                <p className="text-white text-sm font-[Arial]">
                  Get income every day
                </p>
              </div>
              <div className="mt-2 pb-3">
                <button
                  className="px-8 py-2 rounded-full font-bold text-white text-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",
                  }}
                  onClick={() => {
                    setShowFirstPopup(false);
                    setShowSecondPopup(true);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {showSecondPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
              <div className="relative flex flex-col items-center mb-12">
                <div className="w-[90vw] max-w-[350px] max-h-[90vh] bg-[#333332] rounded-lg shadow-lg text-white flex flex-col">
                  <div className="w-full bg-[#4d4d4c] text-center py-2 rounded-t-lg">
                    <h2 className="text-base font-bold">
                      Extra First Deposit Bonus
                    </h2>
                    <p className="text-xs text-gray-300 mt-1">
                      Each account can only receive rewards once
                    </p>
                  </div>
                  <div
                    className="overflow-y-auto px-2 pb-4"
                    style={{ maxHeight: "60vh", paddingTop: "20px" }}
                  >
                    {[
                      { deposit: 200000, bonus: 10000 },
                      { deposit: 100000, bonus: 5000 },
                      { deposit: 30000, bonus: 2000 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#4d4d4c] p-2 rounded-lg mb-2"
                      >
                        <p className="text-sm flex justify-between">
                          <span>
                            First Deposit{" "}
                            <span className="text-[#dd9138]">
                              {item.deposit}
                            </span>
                          </span>
                          <span className="text-[#dd9138]">
                            + ₹{item.bonus}
                          </span>
                        </p>
                        <p className="text-xs text-[#a8a5a1]">
                          Deposit {item.deposit} for the first time and receive
                          ₹{item.bonus} bonus.
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="relative w-[70%] h-4 bg-[#242424] rounded-full">
                            <div className="absolute top-0 left-0 h-full w-0 bg-yellow-400 rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-sm z-10">0/{item.deposit}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate("/deposit")}
                            className="ml-2 px-2 py-1 text-[#ed9138] border-2 text-xs rounded-md"
                          >
                            Deposit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center bg-[#4d4d4c] text-[#a8a5a1] py-4 px-4 rounded-b-lg">
                    <label
                      className="flex items-center text-xs cursor-pointer"
                      onClick={() => setChecked(!checked)}
                    >
                      <img
                        src={checked ? agree : agreeborder}
                        alt="agree"
                        className="w-6 h-6"
                      />
                      <span className="ml-1">No more reminders today</span>
                    </label>
                    <button
                      onClick={() => navigate("/activityPage")}
                      className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-[#8f5206] px-8 py-2 rounded-full font-bold text-xs"
                    >
                      Activity
                    </button>
                  </div>
                </div>
                <button
                  className="mt-3 bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all duration-200"
                  onClick={() => setShowSecondPopup(false)}
                >
                  <img src={close} alt="close" className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
