import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Timecolor from "../../../Assets/timecolor.png";
import Timeblack from "../../../Assets/timeblack.png";
import refresh from "../../../Assets/refresh.png";
import empty from "../../../Assets/empty.png";
import wallet from "../../../Assets/wallets.png";
import fire from "../../../Assets/fire.png";
import HowToPlay from "../../../Assets/finalicons/howtoplayicon.png";
import speaker from "./../../../Assets/speaker.png";
import invitation from "../../../Assets/invitation.png";
import LotteryWingoheader from "../../../components/LotteryWingoheader";
import walletbggame from "../../../Assets/walletbggame.png";
import agree from "./../../../Assets/agree-a.png";
import notAgree from "./../../../Assets/agree-b.png";
import { getWalletBalance } from "../../../api/apiServices";
import useSocket from "../../../hooks/useSocket";

const buttonData = [
  { id: 0, title: <><span className="block text-center">5D</span><span className="block text-center">1Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 60 },
  { id: 1, title: <><span className="block text-center">5D</span><span className="block text-center">3Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 180 },
  { id: 2, title: <><span className="block text-center">5D</span><span className="block text-center">5Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 300 },
  { id: 3, title: <><span className="block text-center">5D</span><span className="block text-center">10Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 600 },
];

const tailwindColorMap = {
  Big: "bg-orange-600 hover:bg-orange-500",
  Small: "bg-blue-600 hover:bg-blue-500",
  Odd: "bg-green-600 hover:bg-green-500",
  Even: "bg-red-600 hover:bg-red-500",
  Number: "bg-gray-600 hover:bg-gray-500",
};

function Lottery5d() {
  const isMounted = useRef(true);
  const gameType = "fiveD";
  const lastFetchedPeriodRef = useRef(null);
  const [activeTab, setActiveTab] = useState("gameHistory");
  const [activeImgTab, setActiveImgTab] = useState("A");
  const [historyData, setHistoryData] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [activeButton, setActiveButton] = useState(buttonData[0].id);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [betType, setBetType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [popupMultiplier, setPopupMultiplier] = useState("X1");
  const [totalPages, setTotalPages] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0 });
  const [currentPeriod, setCurrentPeriod] = useState({ periodId: "Loading..." });
  const [isPeriodTransitioning, setIsPeriodTransitioning] = useState(false);
  const [checked, setChecked] = useState(false);
  const multiplierOptions = ["X1", "X5", "X10", "X20", "X50", "X100"];
  const API_BASE_URL = "https://strike.atsproduct.in";

  const {
    isConnected,
    connectionError,
    currentPeriod: socketPeriod,
    timeRemaining: socketTime,
    lastResult,
    placeBet,
  } = useSocket(gameType, buttonData[activeButton].duration);

  const handleRefreshBalance = useCallback(async () => {
    if (isRefreshingBalance) return;
    setIsRefreshingBalance(true);
    try {
      const response = await getWalletBalance();
      if (response?.success && response?.mainWallet) {
        const balance = Number(response.mainWallet.balance) || 0;
        setWalletBalance(balance);
      } else {
        setError("Failed to refresh balance");
      }
    } catch (error) {
      setError("Failed to refresh balance. Please try again.");
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [isRefreshingBalance]);

  const fetchGameHistory = useCallback(async (page = 1, duration, retryCount = 0) => {
    if (!isMounted.current) return { results: [], pagination: { total_pages: 1 } };

    console.log("🔄 Fetching game history...", { page, duration, retryCount });
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/games/5D/${duration}/history?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Game history API response:", data);

      let results = [];
      if (data.success && data.data) {
        const dataArray = data.data.results || (Array.isArray(data.data) ? data.data : []);
        results = dataArray.map((item) => ({
          periodId: item.periodId || "N/A",
          result: item.result || { A: 0, B: 0, C: 0, D: 0, E: 0, sum: 0 },
          timestamp: item.timestamp || new Date().toISOString(),
        }));
      }

      if (isMounted.current) {
        setHistoryData((prev) => {
          // Merge new results, avoiding duplicates
          const newResults = results.filter(
            (newItem) => !prev.some((oldItem) => oldItem.periodId === newItem.periodId)
          );
          return [...newResults, ...prev].slice(0, 10); // Keep latest 10
        });
        setTotalPages(data.data?.pagination?.total_pages || 1);
        lastFetchedPeriodRef.current = results[0]?.periodId || null;
        console.log("✅ Game history updated:", results);
      }

      return {
        results,
        pagination: data.data?.pagination || { total_pages: 1 },
      };
    } catch (err) {
      console.error(`❌ Error fetching game history (attempt ${retryCount + 1}/3):`, err);
      if (retryCount < 2) {
        console.log(`🔄 Retrying game history fetch (attempt ${retryCount + 2}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchGameHistory(page, duration, retryCount + 1);
      } else {
        if (isMounted.current) {
          setError(err.message || "Error fetching game history.");
        }
        return { results: [], pagination: { total_pages: 1 } };
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const fetchUserBets = useCallback(async (page = 1, retryCount = 0) => {
    if (!isMounted.current) return;

    console.log("🔄 Fetching user bets...", { page, retryCount });
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const duration = buttonData[activeButton].duration;
      const response = await fetch(
        `${API_BASE_URL}/api/games/5D/${duration}/user-bets?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 User bets API response:", data);

      if (data.success && data.data?.results) {
        const formattedBets = data.data.results.map((bet, index) => ({
          betId: bet.betId || `bet-${index}`,
          period: bet.periodId || "N/A",
          orderTime: bet.createdAt ? new Date(bet.createdAt).toLocaleString() : new Date().toLocaleString(),
          orderNumber: bet.betId || `ORD-${Date.now()}-${index}`,
          amount: `₹${bet.betAmount || 0}`,
          quantity: bet.quantity || 1,
          afterTax: `₹${((bet.betAmount || 0) * 0.98).toFixed(2)}`,
          tax: `₹${((bet.betAmount || 0) * 0.02).toFixed(2)}`,
          result: bet.result ? `${bet.result.A || 0}, ${bet.result.B || 0}, ${bet.result.C || 0}, ${bet.result.D || 0}, ${bet.result.E || 0}` : "Pending",
          select: bet.betType && bet.betValue ? `${bet.betType}: ${bet.betValue}` : "N/A",
          status: bet.status || (bet.profitLoss > 0 ? "Won" : bet.profitLoss < 0 ? "Lost" : "Pending"),
          winLose: bet.profitLoss !== undefined ? (bet.profitLoss >= 0 ? `+₹${bet.profitLoss}` : `-₹${Math.abs(bet.profitLoss)}`) : "₹0",
          date: bet.createdAt ? new Date(bet.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          time: bet.createdAt ? new Date(bet.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
        }));

        if (isMounted.current) {
          setUserBets(formattedBets);
          setTotalPages(data.data.pagination?.total_pages || 1);
          console.log("✅ User bets fetched successfully:", formattedBets);
        }
      } else {
        if (isMounted.current) {
          setUserBets([]);
          setTotalPages(1);
          setError("No valid user bet data received");
        }
      }
    } catch (err) {
      console.error("❌ Error fetching user bets:", err);
      if (retryCount < 2) {
        console.log(`🔄 Retrying user bets fetch (attempt ${retryCount + 2}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchUserBets(page, retryCount + 1);
      } else {
        if (isMounted.current) {
          setError(err.message || "Error fetching user bets.");
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [activeButton]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await getWalletBalance();
        if (response?.success && response?.mainWallet) {
          const balance = Number(response.mainWallet.balance) || 0;
          setWalletBalance(balance);
        } else {
          setWalletBalance(0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      }
    };

    fetchWalletBalance();
    const interval = setInterval(fetchWalletBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnected && socketPeriod) {
      console.log("📡 WebSocket period update:", socketPeriod);
      if (socketPeriod.periodId && socketPeriod.periodId !== "Loading...") {
        setIsPeriodTransitioning(true);
        setCurrentPeriod(socketPeriod);
        setTimeout(() => setIsPeriodTransitioning(false), 100);
      } else {
        setCurrentPeriod({ periodId: "Loading..." });
        setIsPeriodTransitioning(true);
      }
    }
  }, [isConnected, socketPeriod]);

  useEffect(() => {
    if (isConnected && socketTime) {
      console.log("⏰ WebSocket time update:", socketTime);
      setTimeRemaining(socketTime);
    }
  }, [isConnected, socketTime]);

  useEffect(() => {
    if (isConnected && lastResult) {
      console.log("📊 WebSocket last result:", lastResult);
      setHistoryData((prev) => {
        if (prev[0]?.periodId === lastResult.periodId) {
          return prev;
        }
        return [lastResult, ...prev.slice(0, 9)];
      });
    }
  }, [isConnected, lastResult]);

  useEffect(() => {
    if (activeTab === "gameHistory" || activeTab === "chart") {
      const duration = buttonData[activeButton].duration;
      fetchGameHistory(currentPage, duration);
    } else if (activeTab === "myHistory") {
      fetchUserBets(currentPage);
    }
  }, [activeTab, currentPage, activeButton, fetchGameHistory, fetchUserBets]);

  useEffect(() => {
    if (activeTab === "gameHistory" || activeTab === "chart") {
      const duration = buttonData[activeButton].duration;
      fetchGameHistory(1, duration);

      const interval = setInterval(() => {
        console.log("⏰ Periodic game history fetch triggered (every 30 seconds)");
        fetchGameHistory(1, duration);
        setCurrentPage(1);
      }, 30000);

      return () => {
        console.log("🛑 Cleaning up periodic game history fetch interval");
        clearInterval(interval);
      };
    }
  }, [activeTab, activeButton, fetchGameHistory]);

  useEffect(() => {
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
      console.log("⏰ Period ended, initiating immediate update");
      setIsPeriodTransitioning(true);
      setCurrentPeriod({ periodId: "Loading..." });

      const duration = buttonData[activeButton].duration;
      const updateTimer = setTimeout(async () => {
        console.log("🔄 Fetching new data after period end", { duration });

        if (activeTab === "gameHistory" || activeTab === "chart") {
          const { results } = await fetchGameHistory(1, duration);
          setCurrentPage(1);
          if (!results || results.length === 0) {
            console.log("⚠️ No new results, retrying in 1s");
            let retryCount = 0;
            const maxRetries = 3;
            while (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              const retryResults = await fetchGameHistory(1, duration);
              if (retryResults.results && retryResults.results.length > 0) {
                break;
              }
              retryCount++;
              console.log(`🔄 Retry ${retryCount}/${maxRetries} failed, retrying...`);
            }
          }
        }

        if (activeTab === "myHistory") {
          await fetchUserBets(1);
        }

        if (!isConnected) {
          setTimeRemaining({
            minutes: Math.floor(duration / 60),
            seconds: duration % 60,
          });
        }
        setIsPeriodTransitioning(false);
      }, 1000); // Reduced delay to 1s for faster updates

      return () => clearTimeout(updateTimer);
    }
  }, [timeRemaining.minutes, timeRemaining.seconds, activeButton, activeTab, isConnected, fetchGameHistory, fetchUserBets]);

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setCurrentPage(1);
    setTimeRemaining({
      minutes: Math.floor(buttonData[buttonId].duration / 60),
      seconds: buttonData[buttonId].duration % 60,
    });
    setCurrentPeriod({ periodId: "Loading..." });
    setIsPeriodTransitioning(true);
    setTimeout(() => setIsPeriodTransitioning(false), 500);
  };

  const handleOptionClick = (option, type) => {
    setSelectedOption(option);
    setBetType(type);
    setIsModalOpen(true);
    setBetAmount(1);
    setQuantity(1);
    setPopupMultiplier("X1");
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleMultiplierClick = (multiplier) => {
    setPopupMultiplier(multiplier);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
    setBetType(null);
    setQuantity(1);
    setBetAmount(1);
    setPopupMultiplier("X1");
  };

  const handlePlaceBet = () => {
    if (!checked) {
      alert("Please agree to the pre-sale rules");
      return;
    }
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    const totalAmount = betAmount * quantity * multiplierValue;
    const betData = {
      amount: totalAmount,
      selection: selectedOption,
      type: betType,
      periodId: currentPeriod.periodId,
      gameType: gameType,
      duration: buttonData[activeButton].duration,
      position: activeImgTab,
    };

    console.log("🎯 Placing Bet:", betData);

    const betPlaced = placeBet(betData);

    if (betPlaced) {
      console.log("✅ Bet sent to WebSocket successfully");
      setIsModalOpen(false);
      setSelectedOption(null);
      setBetType(null);
      setQuantity(1);
      setBetAmount(1);
      setPopupMultiplier("X1");
      setShowSuccessPopup(true);
      handleRefreshBalance();
    } else {
      console.log("❌ Failed to send bet to WebSocket");
      setError("Failed to place bet. Please try again.");
    }
  };

  const calculateTotalAmount = () => {
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    return (betAmount * quantity * multiplierValue).toFixed(2);
  };

  const formatTime = (num) => num.toString().padStart(2, "0");

  const getDisplayPeriodId = () => {
    if (isPeriodTransitioning || (timeRemaining.minutes === 0 && timeRemaining.seconds === 0)) {
      return "Loading...";
    }
    return currentPeriod.periodId || "Loading...";
  };

  if (error) {
    return (
      <div className="bg-[#242424] min-h-screen w-full mx-auto flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#242424] min-h-screen w-full max-w-full md:max-w-[400px] mx-auto flex flex-col items-center justify-center overflow-x-hidden pt-4 pb-24">
      <LotteryWingoheader />

      <div className="text-center w-full px-2 mt-16">
        <div className="rounded-3xl shadow-2xl p-4 relative overflow-hidden min-h-[150px]">
          <div className="absolute inset-0 z-0">
            <img src={walletbggame} alt="wallet background" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[#4d4d4c] opacity-70 z-10"></div>
          <div className="relative z-20">
            <div className="relative flex items-center justify-center mb-2">
              <div className="text-2xl font-bold text-white">₹{walletBalance.toFixed(2)}</div>
              <img
                src={refresh}
                alt="Refresh balance"
                className={`w-6 h-6 absolute right-12 cursor-pointer transition-transform duration-200 ${isRefreshingBalance ? "animate-spin opacity-50" : "hover:scale-110"}`}
                onClick={handleRefreshBalance}
                style={{ pointerEvents: isRefreshingBalance ? "none" : "auto" }}
              />
            </div>
            <div className="flex items-center justify-center text-center mb-6">
              <img src={wallet} alt="icon" className="w-6 h-6 ml-2" />
              <span className="text-[#f5f3f0] text-base font-medium ml-1">Wallet Balance</span>
            </div>
            <div className="flex mt-4 justify-between space-x-2 px-2">
              <Link to="/withdraw" className="flex-1">
                <button className="bg-[#d23838] w-full text-white text-lg font-bold py-2 rounded-full hover:bg-red-600">
                  Withdraw
                </button>
              </Link>
              <Link to="/deposit" className="flex-1">
                <button className="bg-[#17b15e] w-full text-white text-lg font-bold py-2 rounded-full hover:bg-green-600">
                  Deposit
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#242424] px-2 p-2 shadow-md w-full h-full mt-2 flex flex-col justify-center">
        <div className="p-2 rounded-full bg-[#333332] shadow-md mt-0">
          <div className="flex justify-between items-center w-full">
            <img src={speaker} alt="icon" className="w-6 h-6 ml-1" />
            <p className="text-xs text-white ml-2 flex-1">Thanks to all our members — past and present — for being part of our journey.</p>
            <button className="text-[#333] text-sm px-5 py-1 rounded-lg flex items-center justify-center gap-0" style={{ backgroundImage: `url(${invitation})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
              <img src={fire} alt="icon" className="w-4 h-4" /> Detail
            </button>
          </div>
        </div>

        <div className="bg-[#4d4d4c] rounded-lg mt-4 shadow-md">
          <div className="button-container flex justify-between space-x-1">
            {buttonData.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className={`flex flex-col items-center px-1 py-0.5 rounded-lg flex-1 transition-all duration-300 ${activeButton === button.id ? "bg-gradient-to-b from-[#fae59f] to-[#c4933f] text-[#8f5206]" : "bg-[#4d4d4c] text-[#a8a5a1]"}`}
                style={{ textAlign: "center", flexDirection: "column", alignItems: "center" }}
              >
                <div className="icon" style={{ fontSize: "20px", marginBottom: "4px" }}>{activeButton === button.id ? button.activeIcon : button.icon}</div>
                <span className="text-base leading-tight">{button.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#2e2e2d] flex items-center justify-between rounded-lg mt-4 shadow-md mb-4 p-3 w-full">
          <div className="text-[#a8a5a1] text-sm leading-tight flex flex-col items-center justify-center mr-2">
            <span className="-mt-6">Lottery</span>
            <span className="mt-4">results</span>
          </div>
          <div className="flex">
            {isPeriodTransitioning || !historyData[0]?.result ? (
              ["-", "-", "-", "-", "-"].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-10 h-10 ml-2 flex items-center justify-center rounded-full bg-[#444] text-white text-sm animate-pulse">?</div>
                  <div className="text-[#a8a5a1] text-xs mt-1">{["A", "B", "C", "D", "E"][idx]}</div>
                </div>
              ))
            ) : (
              ["A", "B", "C", "D", "E"].map((pos, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-10 h-10 ml-2 flex items-center justify-center rounded-full bg-[#444] text-white text-sm">{historyData[0].result[pos]}</div>
                  <div className="text-[#a8a5a1] text-xs mt-1">{pos}</div>
                </div>
              ))
            )}
          </div>
          <div className="text-[#a8a5a1] text-lg mx-2">=</div>
          <div className="w-10 h-10 flex items-center justify-center relative -top-1 rounded-full bg-[#d9ac4f] text-[#8f5206] text-sm">
            {isPeriodTransitioning || !historyData[0]?.result
              ? "?"
              : Object.values(historyData[0].result).reduce((acc, n) => acc + (Number(n) || 0), 0)}
          </div>
        </div>

        <div className="bg-[#333332] rounded-lg mt-2 shadow-md mb-2 p-2">
          <div className="flex justify-between mb-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-[#a8a5a1] text-sm">Period</p>
                <button onClick={() => setShowHowToPlay(true)} className="border border-[#d9ac4f] rounded-full px-5 py-1 flex items-center justify-center gap-1 text-[#8f5206] text-center shrink-0">
                  <img src={HowToPlay} alt="How to Play" className="w-4 h-4" />
                  <p className="text-[#d9ac4f] text-xs font-medium">How to Play</p>
                </button>
              </div>
              <p className="text-lg mt-2 font-bold text-[#f5f3f0] truncate">{getDisplayPeriodId()}</p>
            </div>
            <div className="text-right min-w-0 mt-2 sm:mt-0">
              <p className="text-[#a8a5a1] mb-2 text-sm">Time Remaining</p>
              <div className="flex space-x-0.5 justify-end items-center">
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">{formatTime(timeRemaining.minutes)[0]}</span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">{formatTime(timeRemaining.minutes)[1]}</span>
                <span className="text-[#8f5206] font-bold text-lg px-0.5 w-4 text-center">:</span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">{formatTime(timeRemaining.seconds)[0]}</span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">{formatTime(timeRemaining.seconds)[1]}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#00b977] rounded-lg w-full p-2 relative">
            <div className="absolute top-0 left-0 h-full w-6 z-10">
              <div className="absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[24px] border-l-[#00b971]"></div>
            </div>
            <div className="absolute top-0 right-0 h-full w-6 z-10">
              <div className="absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-r-[24px] border-r-[#00b971]"></div>
            </div>
            <div className="bg-[#003c26] rounded-lg w-full h-full p-1 flex space-x-1">
              {isPeriodTransitioning || !historyData[0]?.result ? (
                ["-", "-", "-", "-", "-"].map((_, index) => (
                  <div key={index} className="flex-1 bg-[#727272] rounded flex flex-col items-center py-1">
                    <div className="w-10 h-3 bg-[#e1e1ec] rounded-t-none rounded-b-full"></div>
                    <div className={`flex items-center justify-center ${index === 0 ? "bg-emerald-500 text-white" : "bg-[#e1e1ec] text-[#a8a5a1]"} rounded-full w-14 h-14 text-4xl font-bold my-1 animate-pulse`}>?</div>
                    <div className="w-10 h-3 bg-[#e1e1ec] rounded-b-none rounded-t-full"></div>
                  </div>
                ))
              ) : (
                ["A", "B", "C", "D", "E"].map((pos, index) => (
                  <div key={index} className="flex-1 bg-[#727272] rounded flex flex-col items-center py-1">
                    <div className="w-10 h-3 bg-[#e1e1ec] rounded-t-none rounded-b-full"></div>
                    <div className={`flex items-center justify-center ${index === 0 ? "bg-emerald-500 text-white" : "bg-[#e1e1ec] text-[#a8a5a1]"} rounded-full w-14 h-14 text-4xl font-bold my-1`}>
                      {historyData[0].result[pos]}
                    </div>
                    <div className="w-10 h-3 bg-[#e1e1ec] rounded-b-none rounded-t-full"></div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex mt-4 justify-start space-x-2 mb-4 overflow-x-auto">
            {["A", "B", "C", "D", "E", "SUM"].map((tab) => (
              <button 
                key={tab} 
                className={`px-3 py-1 rounded-tl-lg text-xl font-bold rounded-tr-lg shrink-0 ${activeImgTab === tab ? "bg-[#d9ac4f] text-[#8f5206]" : "bg-[#6f7381] text-white"}`} 
                onClick={() => setActiveImgTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {["A", "B", "C", "D", "E", "SUM"].map((tab) => (
            activeImgTab === tab && (
              <div key={tab} className="grid grid-cols-4 gap-2">
                <div className="col-span-4 flex justify-between mt-2 space-x-1">
                  {["Big 2", "Small 2", "Odd 2", "Even 2"].map((label) => (
                    <button
                      key={label}
                      className={`bg-[#6f7381] text-white px-1 py-2 rounded-md hover:bg-[#d9ac4f] flex-1 text-lg`}
                      onClick={() => handleOptionClick(label.split(" ")[0], "size")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col px-1 col-span-4 mt-2">
                  {activeImgTab !== "SUM" ? (
                    <>
                      <div className="flex justify-between px-1 mb-2 space-x-1">
                        {["0", "1", "2", "3", "4"].map((number) => (
                          <div
                            key={number}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => handleOptionClick(number, "number")}
                          >
                            <div className="w-10 h-10 flex border border-[#666462] items-center justify-center text-[#666462] rounded-full text-lg font-bold">
                              {number}
                            </div>
                            <p className="text-sm text-[#a8a5a1]">9x</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between px-1 mb-2 space-x-1">
                        {["5", "6", "7", "8", "9"].map((number) => (
                          <div
                            key={number}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => handleOptionClick(number, "number")}
                          >
                            <div className="w-10 h-10 flex border border-[#666462] items-center justify-center text-[#666462] rounded-full text-sm font-bold">
                              {number}
                            </div>
                            <p className="text-sm text-[#a8a5a1]">9x</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[120px] mb-2"></div>
                  )}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="flex justify-between space-x-1 mb-6 mt-2">
          <button 
            className={`w-full px-3 py-2 text-base rounded-lg shadow text-center ${activeTab === "gameHistory" ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold" : "bg-[#333332] text-[#a8a5a1] font-normal"}`} 
            onClick={() => setActiveTab("gameHistory")}
          >
            Game history
          </button>
          <button 
            className={`w-full px-3 py-2 text-base rounded-lg shadow text-center ${activeTab === "chart" ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold" : "bg-[#333332] text-[#a8a5a1] font-normal"}`} 
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
         <button 
  className={`w-full px-3 py-2 text-base rounded-lg shadow text-center ${
    activeTab === "myHistory"
      ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
      : "bg-[#333332] text-[#a8a5a1] font-normal"
  }`}
  onClick={() => setActiveTab("myHistory")}
>
  My History
</button>

        </div>

        <div className="mb-2 rounded-lg shadow">
          {activeTab === "gameHistory" && (
            <div className="overflow-x-auto">
              {error && (
                <div className="w-full bg-red-500 text-white p-2 text-center rounded-lg mb-2">
                  {error}
                </div>
              )}
              {loading ? (
                <p className="text-white text-center py-4">Loading game history...</p>
              ) : historyData.length > 0 ? (
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr className="bg-[#3a3947] text-white">
                      <th className="px-2 py-2 text-center text-sm">Period</th>
                      <th className="px-2 py-2 text-center text-sm">Result</th>
                      <th className="px-2 py-2 text-center text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((record, index) => {
                      const totalSum = record.result?.sum ??
                        (record.result?.A + record.result?.B + record.result?.C + record.result?.D + record.result?.E) ??
                        "N/A";
                      return (
                        <tr key={index} className="bg-[#3f3f3e] relative">
                          <td className="px-2 text-sm text-[#f5f3f0] py-2">{record.periodId}</td>
                          <td className="px-2 py-2 text-sm text-center">
                            <div className="flex justify-center items-center space-x-1">
                              {[record.result.A, record.result.B, record.result.C, record.result.D, record.result.E].map((number, idx) => (
                                <div key={idx} className="w-6 h-6 flex items-center justify-center text-[#f5f3f0] bg-[#3f3f3e] rounded-full border border-gray-400">{number}</div>
                              ))}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-sm text-center">
                            <div className="w-6 h-6 flex items-center justify-center bg-[#d9ac4f] rounded-full border border-gray-400">{totalSum}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center bg-[#4d4d4c] py-4">
                  <div className="flex flex-col items-center justify-center">
                    <img src={empty} alt="No Data" className="w-28 h-40 object-contain" />
                    <p className="text-[#a8a5a1] text-sm mt-2">No game history available</p>
                    <button
                      onClick={() => fetchGameHistory(currentPage, buttonData[activeButton].duration)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Load History"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "chart" && (
            <div>
              <table className="table-auto w-full text-left">
                <thead>
                  <tr className="bg-[#3a3947] text-white">
                    <th className="px-1 py-2 text-center text-xs">Period</th>
                    <th className="px-1 py-2 text-center text-xs">Number</th>
                    <th className="px-1 py-2 text-center text-xs">O/E</th>
                  </tr>
                </thead>
                <tbody className="px-2 py-2">
                  {historyData.length > 0 ? (
                    historyData.map((row, index) => (
                      <tr key={index} className="bg-[#4d4d4c] px-2 py-2">
                        <td className="px-1 py-1 text-[#f5f3f0] text-xs text-center">{row.periodId}</td>
                        <td className="px-4 py-4 text-sm text-center">
                          <div className="flex items-center justify-center gap-[2px] h-5">
                            <span className="w-4 h-4 text-[10px] leading-[14px] flex items-center justify-center border border-[#666462] rounded-full bg-[#d9ac4f] text-[#8f5206]">{row.result[activeImgTab]}</span>
                          </div>
                        </td>
                        <td className="px-1 py-1 text-xs text-center text-white align-middle">
                          {row.result[activeImgTab] % 2 === 0 ? "E" : "O"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-2 py-4 text-center text-gray-200">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "myHistory" && (
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-white text-center py-4">Loading user bets...</p>
              ) : userBets.length > 0 ? (
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr className="bg-[#3a3947] text-white">
                      <th className="px-2 py-2 text-center text-sm">Period</th>
                      <th className="px-2 py-2 text-center text-sm">Select</th>
                      <th className="px-2 py-2 text-center text-sm">Amount</th>
                      <th className="px-2 py-2 text-center text-sm">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBets.map((bet, index) => (
                      <tr key={index} className="bg-[#3f3f3e]">
                        <td className="px-2 py-2 text-sm text-[#f5f3f0]">{bet.period}</td>
                        <td className="px-2 py-2 text-sm text-[#f5f3f0] text-center">{bet.select}</td>
                        <td className="px-2 py-2 text-sm text-[#f5f3f0] text-center">{bet.amount}</td>
                        <td className="px-2 py-2 text-sm text-[#f5f3f0] text-center">{bet.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center bg-[#4d4d4c] py-4">
                  <div className="flex flex-col items-center justify-center">
                    <img src={empty} alt="No Data" className="w-28 h-40 object-contain" />
                    <p className="text-[#a8a5a1] text-sm mt-2">No user bets available</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="text-center mb-0 w-full mt-2">
            <div className="bg-[#333332] rounded-xl shadow-lg p-4 flex items-center justify-center space-x-4">
              <button 
                className="p-3 text-[#666462] bg-[#4d4d4c] rounded-lg disabled:opacity-50" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                <IoIosArrowBack className="w-5 h-5" />
              </button>
              <span className="px-6 text-sm text-[#a8a5a1] font-semibold">{currentPage} / {totalPages}</span>
              <button 
                className="p-3 text-[#8f5206] bg-[#d9ac4f] rounded-lg disabled:opacity-50" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] bg-neutral-900 text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
          <div className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]} rounded-t-lg flex flex-col items-center text-center`}>
            <h2 className="text-lg font-bold mt-2">{buttonData[activeButton].title}</h2>
            <div className="flex w-full max-w-xs items-center justify-center bg-white text-black gap-2 mt-2 p-2 rounded-lg">
              <span>Select</span>
              <span className="font-bold">{selectedOption} ({activeImgTab})</span>
            </div>
            <div className={`relative ${tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]} rounded-t px-0 flex flex-col items-center text-center p-[14px]`}>
              <div className="absolute top-0 mr-0 right-0 w-0 h-0 border-t-[30px] border-l-[200px] border-r-0 border-b-0 border-solid border-transparent border-l-neutral-900"></div>
              <div className="absolute top-0 ml-0 left-0 w-0 h-0 border-t-[30px] border-r-[200px] border-l-0 border-b-0 border-solid border-transparent border-r-neutral-900"></div>
            </div>
          </div>
          <div className="mt-6 space-y-4 px-2">
            <div className="flex justify-between">
              <p className="mb-2 text-sm">Balance</p>
              <div className="flex gap-1">
                {["1", "10", "100", "1000"].map((label) => (
                  <button
                    key={label}
                    className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]} px-2 py-1 rounded text-sm ${betAmount === parseInt(label) ? "ring-2 ring-white" : ""}`}
                    onClick={() => setBetAmount(parseInt(label))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <p className="mb-2 text-sm">Quantity</p>
              <div className="flex items-center gap-1">
                <button
                  className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]} px-2 rounded text-sm`}
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 bg-neutral-800 text-center py-1 rounded text-sm"
                />
                <button
                  className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]} px-2 rounded text-sm`}
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-1 mt-2 justify-end">
              {multiplierOptions.map((label) => (
                <button
                  key={label}
                  className={`bg-neutral-700 px-3 py-1 rounded-lg text-sm ${
                    popupMultiplier === label
                      ? tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]
                      : tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"].replace(" ", " hover:bg-gray-500")
                  } transition ${popupMultiplier === label ? "ring-2 ring-white" : ""}`}
                  onClick={() => handleMultiplierClick(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div onClick={() => setChecked(!checked)}>
                {checked ? (
                  <img src={agree} alt="icon" className="w-5 h-5 ml-2" />
                ) : (
                  <img src={notAgree} alt="icon" className="w-5 h-5 ml-2" />
                )}
              </div>
              <span className="text-sm">I agree</span>
              <button className="text-red-500 hover:underline text-sm">
                Pre-sale rules
              </button>
            </div>
            <div className="flex w-[calc(100%+16px)] -mx-2">
              <button
                onClick={handleCloseModal}
                className="bg-neutral-600 flex-1 hover:bg-neutral-500 transition py-3 text-sm"
              >
                Cancel
              </button>
              <button
                className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption || "Number"]} flex-1 py-3 transition text-sm`}
                onClick={handlePlaceBet}
              >
                Total amount ₹{calculateTotalAmount()}
              </button>
            </div>
          </div>
        </div>
      )}

{showSuccessPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
    <div className="bg-[#222] rounded-lg shadow-md w-[90%] max-w-sm p-6 text-center">
      <div className="text-white text-lg font-bold mb-4">Success</div>
      <p className="text-gray-300 text-sm mb-6">Your bet has been placed successfully!</p>
      <button
        onClick={() => setShowSuccessPopup(false)}
        className="bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] px-6 py-2 rounded-full font-semibold"
      >
        Close
      </button>
    </div>
  </div>
)}

      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500]">
          <div className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="text-center text-lg text-[#333] font-bold py-3 bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-t-lg">
              How to Play
            </div>
            <div className="bg-[#222] p-4 text-gray-300 text-sm max-h-[60vh] overflow-y-auto rounded-b-lg">
              <p className="font-semibold">5D Lottery Game Rules</p>
              <p className="mt-2 font-semibold">Draw Instructions</p>
              <p className="mt-2">A 5-digit number (00000-99999) is drawn each period. Example:</p>
              <p className="mt-2">Draw number: 12345</p>
              <p>A=1, B=2, C=3, D=4, E=5</p>
            </div>
            <div className="flex justify-center py-4 bg-[#222] rounded-b-lg">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] px-6 py-2 rounded-full font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lottery5d;
