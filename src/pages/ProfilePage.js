import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/Slice/loginSlice"; // Import logout action
import { AiOutlineRight } from "react-icons/ai";
import wallet from "../../src/Assets/wallets.png";
import rechargeIcon from "../Assets/recharge.png";
import widthdraw from "../Assets/Withdraw.png";
import vipiconup from "../Assets/finalicons/vipiconup.png"
import bet from "../Assets/bet.png";
import transaction from "../Assets/transaction.png";
import DepositHistory from "../Assets/deposithistory.png";
import withdrawHistory from "../Assets/withdrawhistory.png";
import NotifyIcon from "../Assets/notifyIcon.png";
import gift from "../Assets/gift.png";
import gameStatistics from "../Assets/gamestatistics.png";
import languageIcon from "../Assets/languageIcon.png";
import SettingCenter from "../Assets/settingCenter.png";
import about from "../Assets/about.png";
import CustomerService from "../Assets/icon_sevice.png";
import service_notification from "../Assets/service_notification.png";
import service_feedback from "../Assets/service_feedback.png";
import service_guide from "../Assets/service_guide.png";
import logout_icon from "../Assets/logout.png";
import safe from "../Assets/finalicons/iconsafe.png";
import Footer from "../components/Footer";
import { FaCopy } from "react-icons/fa";
import refreshicon from '../Assets/refresh.png'
import vip from "../Assets/vip/vip1.png"

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add state for controlling the logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout button click
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  // Handle confirm logout
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Dispatch logout action to clear Redux state and localStorage
      dispatch(logout());

      // Close the modal
      setShowLogoutModal(false);

      console.log("User logged out successfully");

      // Navigate to login page
      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, we should still logout the user
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle cancel logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 bg-[#242424] overflow-x-hidden">
      {/* Main content wrapper with max-width matching Wallet page */}
      <div className="w-full max-w-md mx-auto">
        {/* Golden background header */}
        <div
          className="w-full relative"
          style={{
            background: "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",
            borderBottomLeftRadius: "40px",
            borderBottomRightRadius: "40px",
            paddingBottom: "100px"
          }}
        >
          <div className="px-6 py-8">
            {/* Profile section with larger circular image */}
            <div className="flex items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white">
                <img
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fd2qp0siotla746.cloudfront.net%2Fimg%2Fuse-cases%2Fprofile-picture%2Ftemplate_3.jpg&f=1&nofb=1"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4 max-w-[calc(100%-7rem)]">
                <div className="flex items-center">
                  <h2 className="text-xl font-normal text-white truncate">MEMBERNGHEGGCK</h2>
                  <img
                    src={vip}
                    alt="VIP Badge"
                    className="h-8 ml-2 flex-shrink-0"
                  />
                </div>
                <div className="flex items-center bg-[#dd9138] rounded-full text-white mt-2 px-1 text-sm w-fit">
                  <span>UID</span>
                  <span className="mx-2">|</span>
                  <span>1952877</span>
                  <button className="ml-2">
                    <FaCopy className="text-white" />
                  </button>
                </div>

                <p className="text-white mt-1 text-sm">Last login: 2025-03-08 10:01:26</p>
              </div>
            </div>
          </div>

          {/* Balance card - positioned to overlap the golden background */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 w-[90%] max-w-full">
            <div className="bg-[#4d4d4c] rounded-lg shadow-lg p-4">
              <div className="text-gray-400 text-lg font-normal">Total balance</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-white text-xl font-bold">₹292672346792.32</div>
                  <button className="text-white">
                    <img src={refreshicon} alt="refresh" className="w-5 h-5" />
                  </button>
                </div>
              </div>


              {/* Quick action buttons */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <Link to="/wallet" className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={wallet} alt="AR Wallet" className="w-8 h-8" />
                  </div>
                  <p className="text-white text-lg ">Wallet</p>
                </Link>

                <Link to="/deposit" className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={rechargeIcon} alt="Deposit" className="w-8 h-8" />
                  </div>
                  <p className="text-white text-lg ">Deposit</p>
                </Link>

                <Link to="/withdraw" className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={widthdraw} alt="Withdraw" className="w-8 h-8" />
                  </div>
                  <p className="text-white text-lg ">Withdraw</p>
                </Link>

                <Link to="/vipprofile" className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={vipiconup} alt="VIP" className="w-8 h-8" />
                  </div>
                  <p className="text-white text-lg ">VIP</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content section with padding to account for the overlapping balance card */}
        <div className="w-full flex flex-col items-center pt-20 px-4">
          <div className="w-full">
            <Link to="/safe" className="block">
              <div className="bg-[#333332] p-1 rounded-lg shadow-md  cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex">
                    <img
                      src={safe}
                      alt="Safe Icon"
                      className="w-14 h-12 mt-3 ml-4 flex-shrink-0"
                    />
                    <div className="text-[#a8a5a1] ml-4">
                      Vault
                      <br />
                      <span className="text-xs leading-tight ">
                        the daily interest rate is 0.1%, and the income is
                        <br /> calculated once every 1 minutes.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>


            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Game History */}
              <Link
                to="/gamehistoryProfile"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={bet} alt="Game History Icon" className="w-9 h-9 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Game History
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium truncate">
                    My game history
                  </p>
                </div>
              </Link>

              {/* Transaction */}
              <Link
                to="/transactionProfile"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={transaction} alt="Transaction Icon" className="w-9 h-9 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Transaction
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium truncate">
                    My transaction history
                  </p>
                </div>
              </Link>

              {/* Deposit */}
              <Link
                to="/deposit-history"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={DepositHistory} alt="Deposit Icon" className="w-9 h-9 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Deposit
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium truncate">
                    My deposit history
                  </p>
                </div>
              </Link>

              {/* Withdraw */}
              <Link
                to="/withdraw-history"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={withdrawHistory} alt="Withdraw Icon" className="w-9 h-9 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Withdraw
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium truncate">
                    My withdraw history
                  </p>
                </div>
              </Link>
            </div>






            <div className="bg-[#333332] p-4 rounded-lg shadow-md mt-4">
              <div className="space-y-6">
                {/* Notification Button */}
                <div>
                  <Link
                    to="/notificationProfile"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={NotifyIcon}
                        alt="Notification Icon"
                        className="w-8 h-8 flex-shrink-0"
                      />
                      Notification
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>

                {/* Gifts Button */}
                <div>
                  <Link
                    to="/Gift"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img src={gift} alt="Gift Icon" className="w-8 h-8 flex-shrink-0" />
                      Gifts
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>

                {/* Game Statistics Button */}
                <div>
                  <Link
                    to="/gamestatistics"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={gameStatistics}
                        alt="Game Statistics Icon"
                        className="w-8 h-8 flex-shrink-0"
                      />
                      Game Statistics
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>

                {/* Language Button */}
                <div>
                  <Link
                    to="/language"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={languageIcon}
                        alt="Language Icon"
                        className="w-8 h-8 flex-shrink-0"
                      />
                      Language
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />

                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#333332] text-[#a8a5a1] p-4 rounded-lg shadow-md mt-4">
              {/* Title aligned to the left */}
              <p className="text-lg font-normal mb-8 text-white text-left">
                Service Center
              </p>

              {/* Grid layout */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Settings */}
                <Link
                  to="/settingsprofile"
                  className="symbol flex flex-col items-center cursor-pointer"
                >
                  <img src={SettingCenter} alt="Settings" className="w-8 h-8" />
                  <p className=" text-sm">Settings</p>
                </Link>

                {/* Feedback */}
                <Link
                  to="/feedbackProfile"
                  className="symbol flex flex-col items-center cursor-pointer"
                >
                  <img src={service_feedback} alt="Feedback" className="w-8 h-8" />
                  <p className=" text-sm">Feedback</p>
                </Link>

                {/* Notification */}
                <Link
                  to="/notificationsService"
                  className="symbol flex flex-col items-center cursor-pointer"
                >
                  <img
                    src={service_notification}
                    alt="Notification"
                    className="w-8 h-8"
                  />
                  <p className=" text-sm">Notification</p>
                </Link>

                {/* Customer Service */}
                <Link
                  to="/agentcustomer"
                  className="symbol flex flex-col items-center cursor-pointer"
                >
                  <img
                    src={CustomerService}
                    alt="Customer Service"
                    className="w-8 h-8"
                  />
                  <p className=" text-sm text-center">Customer Service</p>
                </Link>

                {/* Beginner's Guide */}
                <Link
                  to="/beginnerguide"
                  className="symbol flex flex-col items-center cursor-pointer"
                >
                  <img
                    src={service_guide}
                    alt="Beginner's Guide"
                    className="w-8 h-8"
                  />
                  <p className=" text-sm text-center">Beginner's Guide</p>
                </Link>

                {/* About Us */}
                <Link
                  to="/aboutusprofile"
                  className="symbol flex flex-col items-center cursor-pointer"
                >
                  <img src={about} alt="About Us" className="w-8 h-8" />
                  <p className=" text-sm">About us</p>
                </Link>
              </div>
            </div>

            <form className="space-y-4 md:space-y-6 mt-12 mb-14">
              <button
                type="button"
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center border border-[#d9ac4f] text-[#d9ac4f] py-2 rounded-full disabled:opacity-50"
              >
                <img src={logout_icon} alt="Logout Icon" className="w-6 h-6 mr-2" />
                {isLoggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#2b2b2b] rounded-lg w-4/5 max-w-sm overflow-hidden">
            {/* Alert Icon */}
            <div className="flex justify-center pt-6 pb-2">
              <div className="w-20 h-20 rounded-full bg-[#ff4d4f] flex items-center justify-center">
                <span className="text-white text-6xl font-bold">!</span>
              </div>
            </div>

            {/* Modal Text */}
            <div className="text-center text-white text-2xl font-medium py-4">
              Do you want to log out?
            </div>

            {/* Modal Buttons */}
            <div className="px-10 pb-6 pt-2 mt-4">
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="w-full mb-3 py-2 bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-full text-[#8f5206] text-lg disabled:opacity-50"
              >
                {isLoggingOut ? "Logging Out..." : "Confirm"}
              </button>
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="w-full py-2 border border-[#d9ac4f] rounded-full text-[#d9ac4f] text-lg disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;