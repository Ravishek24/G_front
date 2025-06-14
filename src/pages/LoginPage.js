import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../api/auth";
import { resetError } from "../redux/Slice/loginSlice";
import Header from "../components/Header";
import phone from "../Assets/loginicons/phone.png";
import email from "../Assets/loginicons/email.png";
import newemail from "../Assets/loginicons/newemail.png";
import phoneicon from "../Assets/loginicons/phoneicon.png";
import emailicon from "../Assets/loginicons/emailicon.png";
import forgoticon from "../Assets/loginicons/forgoticon.png";
import service from "../Assets/loginicons/service.png";
import lockicon from "../Assets/loginicons/lockicon.png";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import agree from "../Assets/finalicons/agree.png";
import agreeborder from "../Assets/finalicons/agreeborder.png";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "United Arab Emirates" },
];

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.login);
  
  // Consolidated state to reduce re-renders
  const [uiState, setUiState] = useState({
    isPhoneLogin: true,
    showPassword: false,
    rememberMe: false,
    showDropdown: false,
    formError: null,
    retryCount: 0,
    isRetrying: false,
    hasNavigated: false // Prevent multiple navigations
  });

  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    countryCode: "+91",
  });

  // Memoized validation to prevent unnecessary recalculations
  const isButtonActive = useMemo(() => {
    if (uiState.isPhoneLogin) {
      const fullPhoneNumber = `${credentials.countryCode}${credentials.phoneNumber}`;
      const digitsOnly = fullPhoneNumber.replace(/\D/g, "");
      const isValidPhone = /^\d{10,15}$/.test(digitsOnly);
      return isValidPhone && credentials.password.length >= 6 && credentials.phoneNumber !== "";
    } else {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email);
      return isValidEmail && credentials.password.length >= 6;
    }
  }, [credentials, uiState.isPhoneLogin]);

  // Memoized button class to prevent recalculation
  const buttonClass = useMemo(() => {
    const baseClass = "w-full text-xl font-medium py-2 rounded-full hover:opacity-90 focus:ring-2 focus:ring-indigo-300 tracking-wide transition-opacity";
    
    if (loading || uiState.isRetrying || !isButtonActive) {
      if (uiState.isPhoneLogin && credentials.phoneNumber === "") {
        return `${baseClass} bg-[#6f7381] text-[#a8a5a1] opacity-50 cursor-not-allowed`;
      }
      return `${baseClass} bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] opacity-50 cursor-not-allowed`;
    }
    return `${baseClass} bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206]`;
  }, [loading, uiState.isRetrying, uiState.isPhoneLogin, isButtonActive, credentials.phoneNumber]);

  // Consolidated state update function
  const updateUiState = useCallback((updates) => {
    setUiState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle navigation with check to prevent multiple navigations
  useEffect(() => {
    if (token && !uiState.hasNavigated) {
      updateUiState({ hasNavigated: true });
      navigate("/");
    }
  }, [token, navigate, uiState.hasNavigated, updateUiState]);

  // Reset form errors when switching login type
  useEffect(() => {
    dispatch(resetError());
    updateUiState({ 
      formError: null, 
      retryCount: 0 
    });
  }, [dispatch, uiState.isPhoneLogin, updateUiState]);

  // Handle click outside dropdown
  useEffect(() => {
    if (!uiState.showDropdown) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest(".country-dropdown-container")) {
        updateUiState({ showDropdown: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [uiState.showDropdown, updateUiState]);

  // Add CSS styles once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      @media (max-width: 767px) {
        .login-container {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Optimized input change handler
  const handleInputChange = useCallback((event) => {
    const { id, value } = event.target;
    
    if (id === "phoneNumber") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 15);
      setCredentials(prev => ({ ...prev, [id]: sanitizedValue }));
    } else {
      setCredentials(prev => ({ ...prev, [id]: value }));
    }
    
    updateUiState({ formError: null });
  }, [updateUiState]);

  // API connectivity test
  const testApiConnectivity = async () => {
    try {
      const response = await fetch("https://strike.atsproduct.in/api/health", {
        method: "GET",
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.log("API connectivity test failed:", error);
      return false;
    }
  };

  // Retry login function
  const retryLogin = async (loginData) => {
    updateUiState({ isRetrying: true, retryCount: uiState.retryCount + 1 });

    try {
      const isConnected = await testApiConnectivity();
      if (!isConnected) {
        throw new Error("Unable to connect to server. Please check your internet connection.");
      }

      await dispatch(loginUser(loginData)).unwrap();
      updateUiState({ retryCount: 0 });
    } catch (err) {
      console.error(`Login retry ${uiState.retryCount + 1} failed:`, err);
      throw err;
    } finally {
      updateUiState({ isRetrying: false });
    }
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    updateUiState({ formError: null });

    let loginData;
    if (uiState.isPhoneLogin) {
      const fullPhoneNumber = `${credentials.countryCode}${credentials.phoneNumber}`;
      const digitsOnly = fullPhoneNumber.replace(/\D/g, "");

      if (!credentials.phoneNumber) {
        updateUiState({ formError: "Please enter your phone number" });
        return;
      }
      if (!/^\d{10,15}$/.test(digitsOnly)) {
        updateUiState({ formError: "Phone number must be 10 to 15 digits (including country code)" });
        return;
      }

      loginData = {
        phone_no: credentials.phoneNumber,
        password: credentials.password,
        ...(uiState.rememberMe && { rememberMe: true }),
      };
    } else {
      if (!credentials.email) {
        updateUiState({ formError: "Please enter your email address" });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        updateUiState({ formError: "Please enter a valid email address" });
        return;
      }
      loginData = {
        email: credentials.email,
        password: credentials.password,
        ...(uiState.rememberMe && { rememberMe: true }),
      };
    }

    if (!credentials.password) {
      updateUiState({ formError: "Please enter your password" });
      return;
    }
    if (credentials.password.length < 6) {
      updateUiState({ formError: "Password must be at least 6 characters long" });
      return;
    }

    console.log("Attempting login with:", loginData);

    try {
      await dispatch(loginUser(loginData)).unwrap();
      localStorage.setItem("authToken", token);
      updateUiState({ retryCount: 0 });
    } catch (err) {
      console.error("Login failed:", err);

      if (err && err.includes && err.includes("timeout")) {
        if (uiState.retryCount < 2) {
          updateUiState({ formError: `Connection timeout. Retrying... (Attempt ${uiState.retryCount + 2}/3)` });
          try {
            await retryLogin(loginData);
            localStorage.setItem("authToken", token);
          } catch (retryErr) {
            updateUiState({
              formError: `Login failed after ${uiState.retryCount + 2} attempts. Please check your internet connection and try again. If the problem persists, the server might be temporarily unavailable.`
            });
          }
        } else {
          updateUiState({
            formError: "Connection timeout after multiple attempts. Please check your internet connection or try again later."
          });
        }
      } else if (err && err.includes && err.includes("Network Error")) {
        updateUiState({ formError: "Network error. Please check your internet connection and try again." });
      } else if (err && err.includes && (err.includes("401") || err.includes("Invalid"))) {
        if (uiState.isPhoneLogin && !loginData.phone_no.startsWith("+")) {
          const fullPhoneNumber = `${credentials.countryCode}${credentials.phoneNumber}`;
          const digitsOnly = fullPhoneNumber.replace(/\D/g, "");

          const alternativeLoginData = {
            phone_no: digitsOnly,
            password: credentials.password,
            ...(uiState.rememberMe && { rememberMe: true }),
          };

          console.log("Retrying with full phone number:", alternativeLoginData);

          try {
            await dispatch(loginUser(alternativeLoginData)).unwrap();
            localStorage.setItem("authToken", token);
            return;
          } catch (altErr) {
            console.error("Alternative login also failed:", altErr);
          }
        }

        updateUiState({
          formError: "Invalid credentials. Please check your phone number/email and password, or register if you haven't already."
        });
      } else {
        updateUiState({
          formError: typeof err === "string"
            ? `${err}. Please try again or contact support if the problem persists.`
            : "Login failed. Please try again or contact support if the problem persists."
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center  bg-[#333332] w-full">
      <div className="w-full md:max-w-[700px] mx-auto login-container">
        <Header />
        <div className="text-left mb-2 h-auto w-full px-2 sm:px-4 mt-8">
          <h1 className="text-lg font-bold text-white mb-2">Log in</h1>
          <p className="text-white text-xs mb-0 font-sans">
            Please log in with your phone number or email
            <br />
            If you forget your password, please contact customer service
          </p>
        </div>

        <div className="bg-[#242424] px-6 sm:px-6 py-4 sm:py-6 w-full flex flex-col justify-center">
          {(loading || uiState.isRetrying) && (
            <div className="text-white text-sm mb-4 text-center">
              {uiState.isRetrying ? `Retrying connection... (Attempt ${uiState.retryCount + 1}/3)` : "Please wait, connecting to server..."}
            </div>
          )}
          {(error || uiState.formError) && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {uiState.formError || (typeof error === "string" ? error : "Login failed. Please try again.")}
            </div>
          )}

          <div className="flex justify-center mb-4 -mt-4">
            <button
              className={`flex flex-col items-center w-1/2 py-2 font-medium text-xl ${
                uiState.isPhoneLogin ? "text-[#d9ac4f] border-b-2 border-[#d9ac4f]" : "text-gray-400"
              }`}
              onClick={() => updateUiState({ isPhoneLogin: true })}
            >
              <div className="h-8 flex items-center justify-center">
                <img src={uiState.isPhoneLogin ? phoneicon : phone} alt="Phone" className="w-4 h-[29px] sm:w-[22px] sm:h-[29px]" />
              </div>
              <span>phone number</span>
            </button>
            <button
              className={`flex flex-col items-center w-1/2 py-2 font-medium text-xl ${
                !uiState.isPhoneLogin ? "text-[#d9ac4f] border-b-2 border-[#d9ac4f]" : "text-gray-400"
              }`}
              onClick={() => updateUiState({ isPhoneLogin: false })}
            >
              <div className="h-8 flex items-center justify-center">
                <img src={!uiState.isPhoneLogin ? emailicon : email} alt="Email" className="w-[60px] h-[29px]" />
              </div>
              <span>Email / Account</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4 mb-4 w-full">
            {uiState.isPhoneLogin ? (
              <div>
                <label htmlFor="phoneNumber" className="block mb-2 text-lg font-sans text-white flex items-center gap-1">
                  <img src={phoneicon} alt="Phone" className="w-5 h-6 mr-2" />
                  Phone number
                </label>
                <div className="flex items-center gap-2 mt-4 relative w-full">
                  <div className="relative country-dropdown-container" style={{ minWidth: "60px", maxWidth: "120px", width: "20%" }}>
                    <div
                      onClick={() => updateUiState({ showDropdown: !uiState.showDropdown })}
                      className="bg-[#333332] text-gray-300 py-4 px-3 rounded-lg text-sm cursor-pointer flex items-center justify-between"
                    >
                      {credentials.countryCode}
                      <FaChevronDown className="text-gray-400 w-4 h-4 ml-2" />  
                    </div>
                    {uiState.showDropdown && (
                      <div
                        className="absolute left-0 top-full mt-1 bg-[#333332] rounded-md shadow-lg z-50 hide-scrollbar"
                        style={{ width: "220px", maxHeight: "200px", overflow: "auto", ...scrollbarHideStyle }}
                      >
                        {countryCodes.map(({ code, country }) => (
                          <div
                            key={code}
                            className="px-3 py-3 text-[#a8a5a1] cursor-pointer hover:bg-[#424242] flex items-center"
                            onClick={() => {
                              setCredentials(prev => ({ ...prev, countryCode: code }));
                              updateUiState({ showDropdown: false });
                            }}
                          >
                            <span className="w-12">{code}</span>
                            <span className="ml-2">{country}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={credentials.phoneNumber}
                    onChange={handleInputChange}
                    className="bg-[#333332] text-gray-300 text-sm rounded-lg border-none flex-1 py-4 px-4 outline-none focus:ring-0 focus:border-transparent box-border"
                    placeholder="Please enter your phone number"
                    required
                    style={{ maxWidth: "calc(100% - 80px)" }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block mb-2 text-md font-medium text-white flex items-center gap-1">
                  <img src={newemail} alt="Email" className="w-[30px] h-[20px]" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="bg-[#333332] text-white text-lg rounded-lg border-none block w-full py-3 px-4 outline-none focus:ring-0 focus:border-transparent box-border"
                  placeholder="Please input your email"
                  required
                />
              </div>
            )}

            <div className="relative mb-4 mt-14">
              <label htmlFor="password" className="block mb-2 text-lg text-white flex items-center gap-1">
                <img src={lockicon} alt="Lock" className="h-6 w-6" />
                <span className="text-lg ml-2">Password</span>
              </label>
              <div className="relative w-full mt-4">
                <input
                  type={uiState.showPassword ? "text" : "password"}
                  id="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="bg-[#333332] text-gray-300 text-sm rounded-lg border-none block w-full py-4 px-4 outline-none focus:ring-0 focus:border-transparent box-border"
                  placeholder="Password "
                  required
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => updateUiState({ showPassword: !uiState.showPassword })}
                >
                  {uiState.showPassword ? (
                    <FaEyeSlash className="text-gray-500 w-6 h-6" />
                  ) : (
                    <FaEye className="text-gray-500 w-6 h-6" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="cursor-pointer mr-2" onClick={() => updateUiState({ rememberMe: !uiState.rememberMe })}>
                <img src={uiState.rememberMe ? agree : agreeborder} alt="Agree Checkbox" className="w-6 h-6" />
              </div>
              <span className="text-gray-400 text-sm">Remember Password</span>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                disabled={loading || uiState.isRetrying || !isButtonActive}
                className={buttonClass}
              >
                {loading || uiState.isRetrying ? (uiState.isRetrying ? "Retrying..." : "Logging in...") : "Log in"}
              </button>
              <Link to="/signup" className="w-full flex justify-center">
                <button
                  type="button"
                  className="w-full text-[#d9ac4f] text-xl font-bold py-2 rounded-full border-2 border-[#d9ac4f] focus:ring-2 focus:ring-indigo-300 tracking-wide hover:bg-[#d9ac4f] hover:bg-opacity-10 transition-colors"
                >
                  Register
                </button>
              </Link>
            </div>
          </form>

          <div className="flex justify-center mt-8 mb-2 space-x-16">
            <Link to="/forgotpassword" className="flex flex-col items-center cursor-pointer">
              <div className="p-2 rounded-full mb-2">
                <img src={forgoticon} alt="Forgot Password" className="w-10 h-10" />
              </div>
              <span className="text-white text-sm font-medium">Forgot password</span>
            </Link>
            <Link to="/customerservice" className="flex flex-col items-center cursor-pointer">
              <div className="p-2 rounded-full mb-2">
                <img src={service} alt="Customer Service" className="w-10 h-10" />
              </div>
              <span className="text-white text-sm font-medium">Customer Service</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;