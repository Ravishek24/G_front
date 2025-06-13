import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SlotHeader from "../components/SlotHeader";
import gameApi from "../api/gameAPI";
import { isAuthenticated } from "../api/auth";

import leap from "../Assets/CompanyLogo/leap.png";
import jili from "../Assets/CompanyLogo/jili.png";
import betsoft from "../Assets/CompanyLogo/bs-dark.png";
import evoplay from "../Assets/CompanyLogo/ep-dark.png";
import onetouch from "../Assets/CompanyLogo/o2-dark.png";
import habanero from "../Assets/CompanyLogo/ha-dark.png";
import galaxsys from "../Assets/CompanyLogo/df-dark.png";
import blueprint from "../Assets/CompanyLogo/b2-dark.png";
import pgsoft from "../Assets/CompanyLogo/p0-dark.png";
import isoftbet from "../Assets/CompanyLogo/isoftbet.png";

// Map provider keys to their respective images
const providerImages = {
  leap,
  jili,
  betsoft,
  evoplay,
  onetouch,
  habanero,
  galaxsys,
  blueprint,
  pgsoft,
  playtech: "https://via.placeholder.com/50?text=Playtech",
  goldenrace: "https://via.placeholder.com/50?text=Goldenrace",
  smartsoft: "https://via.placeholder.com/50?text=SmartSoft",
  isoftbet,
};

const providers = [
  
 
  { key: "smartsoft", name: "SmartSoft" },
  { key: "habanero", name: "Habanero" },
  { key: "betsoft", name: "Betsoft" },
  { key: "isoftbet", name: "iSoftBet" },
  { key: "pgsoft", name: "PG Soft" },
  { key: "onetouch", name: "One Touch" },
  { key: "evoplay", name: "Evoplay" },
  { key: "blueprint", name: "Blueprint" },
  { key: "galaxsys", name: "Galaxsys" },


  { key: "fastgames", name: "Fast Games" },
  { key: "crashgames", name: "Crash Games" },
  { key: "ggames", name: "G Games" },
  { key: "betsolutions", name: "Betsolutions" },
  { key: "gamzix", name: "Gamzix" },
  { key: "upgaming", name: "Upgaming" },
  { key: "pragmaticplay", name: "Pragmatic Play" },
  { key: "hacksaw", name: "Hacksaw" },
  { key: "playpearls", name: "PlayPearls" },
  { key: "asiagaming", name: "Asia Gaming (AG)" },
  { key: "fachai", name: "Fachai" }
];


function SlotGame() {
  const [activeProvider, setActiveProvider] = useState("SmartSoft");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [launchingGame, setLaunchingGame] = useState(null);
  const navigate = useNavigate();

  const fetchGamesForProvider = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameApi.fetchGames(provider);
      const gamesArray = Array.isArray(response?.games) ? response.games : [];

      // Create a Set to track unique game names
      const seenNames = new Set();
      const processedGames = gamesArray.reduce((uniqueGames, game) => {
        // Normalize game name to avoid case-sensitive duplicates
        const gameName = (game.name || "").toLowerCase().trim();

        // Only include the game if its name hasn't been seen
        if (!seenNames.has(gameName) && gameName) {
          seenNames.add(gameName);
          let imagePortrait = game.image_portrait || null;

          if (!imagePortrait && game.details) {
            try {
              const parsedDetails = JSON.parse(game.details);
              imagePortrait = parsedDetails.image_portrait || null;
            } catch (err) {
              console.error(`Error parsing details for game ${game.id}:`, err);
            }
          }

          uniqueGames.push({
            id: game.id,
            name: game.name,
            imagePortrait,
            provider: activeProvider, // Add provider info for launch
          });
        }
        return uniqueGames;
      }, []);

      setGames(processedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      if (error.response?.status === 401) {
        setError("Please log in to access games.");
        navigate("/login");
      } else {
        setError(error.message || "Failed to fetch games. Please try again.");
      }
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGameLaunch = async (game, event) => {
    // Prevent default behavior and stop event propagation
    event?.preventDefault();
    event?.stopPropagation();

    if (!isAuthenticated()) {
      setError("Please log in to play games.");
      navigate("/login");
      return;
    }

    setLaunchingGame(game.id);
    setError(null);

    try {
      console.log('Launching game:', game.name, 'ID:', game.id, 'Provider:', game.provider);
      
      // Use the launchGame method from gameApi
      const launchResponse = await gameApi.launchGame(game.id);
      
      // Extract the game URL from the response
      const gameUrl = launchResponse?.url || 
                    launchResponse?.gameUrl || 
                    launchResponse?.game_url || 
                    launchResponse?.launchUrl ||
                    launchResponse?.redirect_url;

      if (gameUrl) {
        console.log('Game URL received:', gameUrl);
        
        // Open game in new window/tab
        const gameWindow = window.open(
          gameUrl, 
          '_blank', 
          'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no'
        );
        
        if (!gameWindow) {
          // If popup was blocked, try redirecting in same tab
          window.location.href = gameUrl;
        }
      } else {
        console.error('No game URL received from API. Response:', launchResponse);
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
    if (!isAuthenticated()) {
      setError("Please log in to access games.");
      navigate("/login");
      return;
    }
    fetchGamesForProvider(activeProvider);
  }, [activeProvider, navigate]);

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <SlotHeader />

      <div className="bg-[#242424] p-3 w-full max-w-md mx-auto flex flex-col mt-12">
        {/* Horizontal scrollable buttons */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
          {providers.map((provider) => (
            <button
              key={provider.key}
              onClick={() => setActiveProvider(provider.key)}
              className={`flex-shrink-0 px-2 py-2 rounded-md text-white flex flex-col items-center justify-center w-20 h-20 ${
                activeProvider === provider.key
                  ? "bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-black"
                  : "bg-[#3a3a3a] hover:bg-[#4a4a4a]"
              }`}
            >
              <img
                src={providerImages[provider.key] || "https://via.placeholder.com/50?text=No+Image"}
                alt={`${provider.name} logo`}
                className={`w-8 h-8 object-contain mb-1 ${
                  activeProvider === provider.key
                    ? "filter brightness-75 sepia-[100%] hue-rotate-[15deg] saturate-[300%]"
                    : ""
                }`}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50?text=Image+Not+Found";
                }}
              />
              <span className="text-[10px] text-center font-medium">{provider.name}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-white text-center">Loading games...</p>
        ) : Array.isArray(games) && games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {games.map((game) => (
              <div 
                key={game.id} 
                className="flex flex-col items-center cursor-pointer relative"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleGameLaunch(game, e);
                }}
              >
                {/* Loading overlay */}
                {launchingGame === game.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                    <div className="text-white text-sm">Launching...</div>
                  </div>
                )}

                {game.imagePortrait ? (
                  <img
                    src={game.imagePortrait}
                    alt={game.name || "Game Image"}
                    className="w-full h-auto object-contain rounded-md mb-2"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=Image+Not+Found";
                    }}
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
  );
}

export default SlotGame;