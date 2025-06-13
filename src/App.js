import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { isAuthenticated } from "./api/auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingFallback from "./components/Loader/LoadingFallback";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerService from "./pages/CustomerService";
import ProfilePage from "./pages/ProfilePage";
import Wallet from "./pages/Wallet";
import ActivityPage from "./pages/ActivityPage";
import PromotionPage from "./pages/PromotionPage";
import Subordinate from "./pages/Promotion/Subordinate";
import Attandancebonus from "./pages/Activity/AttendanceBonus";
import GameStatistics from "./pages/Profile/GameStatisticsProfile";
import ActivityAward from "./pages/Activity/ActivityAward";
import CommissionDetailsPage from "./pages/Promotion/CommissionDetailPage";
import PromotionRule from "./pages/Promotion/PromotionRule";
import AgentCustomer from "./pages/Promotion/AgentCustomer";
import RebateRatio from "./pages/Promotion/RebateRatio";
import Rebate from "./pages/Activity/rebate";
import Jackpot from "./pages/Activity/Jackpot";
import Gift from "./pages/Activity/Gift";
import Home from "./pages/Home";
import LotteryWingo from "./pages/Lottery/LotteryWingo/LotteryWingo";
import LotteryK3 from "./pages/Lottery/LotteryK3/LotteryK3";
import Lottery5d from "./pages/Lottery/Lottery5d/Lottery5d";
import LotteryTrxWingo from "./pages/Lottery/LotteryTrx/LotteryTrxWingo";
import Deposit from "./pages/Wallet/Deposit";
import Withdraw from "./pages/Wallet/Withdraw";
import AboutusProfile from "./pages/Profile/AboutusProfile";
import ARWallet from "./pages/Profile/ARWallet";
import BeginnerGuide from "./pages/Profile/BeginnerGuide";
import CustomerServiceProfile from "./pages/Profile/CustomerServiceProfile";
import DepositHistoryProfile from "./pages/Profile/DepositHistoryProfile";
import DepositProfile from "./pages/Profile/DepositProfile";
import FeedbackProfile from "./pages/Profile/FeedbackProfile";
import GameHistoryProfile from "./pages/Profile/GameHistoryProfile";
import GiftsProfile from "./pages/Profile/GiftsProfile";
import NotificationProfile from "./pages/Profile/NotificationProfile";
import Notifications from "./pages/Profile/NotificationsService";
import SafeProfile from "./pages/Profile/SafeProfile";
import SettingsProfile from "./pages/Profile/SettingsProfile";
import TransactionProfile from "./pages/Profile/TransactionProfile";
import VIPProfile from "./pages/Profile/VIPProfile";
import WithdrawHistoryProfile from "./pages/Profile/WithdrawHistoryProfile";
import WithdrawProfile from "./pages/Profile/WithdrawProfile";
import PrivacyAgreement from "./pages/PrivacyAgreement";
import DepositWingo from "./pages/Lottery/LotteryWingo/DepositWingo";
import WithdrawWingo from "./pages/Lottery/LotteryWingo/WithdrawWingo";
import DepositK3 from "./pages/Lottery/LotteryK3/DepositK3";
import WithdrawK3 from "./pages/Lottery/LotteryK3/WithdrawK3";
import Deposit5d from "./pages/Lottery/Lottery5d/Deposit5d";
import Withdraw5d from "./pages/Lottery/Lottery5d/Withdraw5d";
import DepositTrx from "./pages/Lottery/LotteryTrx/DepositTrx";
import WithdrawTrx from "./pages/Lottery/LotteryTrx/WithdrawTrx";
import NewSubordinate from "./pages/Promotion/NewSubordinate";
import InvitePage from "./pages/Promotion/InvitePage";
import DepositHistory from "./pages/Wallet/depositHistory";
import WithdrawHistory from "./pages/Wallet/withdrawHistory";
import AttendanceBonusCombined from "./pages/Profile/Gamerules";
import ActivityAwardss from "./pages/Profile/ActivityInvite";
import InviteBonusTable from "./pages/Activity/InvitationRewardRule";
import MemberInfoCard from "./pages/Activity/InvitationRecord";
import FinancialCard from "./pages/Profile/Safe";
import ActivityDetails from "./pages/Activity/ActivityDetails";
import BankAccountForm from "./pages/Wallet/BankAccountform";
import WalletForm from "./pages/Wallet/AddUSDT";
import PasswordChangeForm from "./pages/SettingsLogin";
import LoginVerificationForm from "./pages/LoginVerification";
import OrderDetailsComponent from "./pages/Lottery/LotteryWingo/LotteryGameDetailed";
import OnlineChatSupport from "./components/OnlineChatSupport";
import VIPHistory from "./pages/Profile/VIPHistory";
import RulesComponent from "./pages/Profile/LearnAboutSafe";
import BDGWin from "./pages/LandingPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import UserProfile from "./pages/Settings";
import SlotGame from "./pages/SlotGame";
import OriginalGames from "./pages/OriginalGame";
import SportsGame from "./pages/SportGame";
import CasinoGames from "./pages/LiveCasino";
import CollectReward from "./pages/Activity/CollectReward";
import { Outlet } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";

function ScrollToTop() {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname, navigationType]);

    return null;
}

// Enhanced Protected Route Component
const ProtectedRoute = ({ children }) => {
    const authStatus = isAuthenticated();

    if (!authStatus) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Layout component for protected routes
const ProtectedLayout = () => {
    return (
        <ProtectedRoute>
            <Outlet />
        </ProtectedRoute>
    );
};

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow">
                        <Suspense fallback={<LoadingFallback />}>
                            <AudioProvider>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                                    <Route path="/customerservice" element={<CustomerService />} />
                                    <Route path="/privacyagreement" element={<PrivacyAgreement />} />
                                    <Route path="/bdgwin" element={<BDGWin />} />

                                    {/* Protected Routes */}
                                    <Route element={<ProtectedLayout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/profilepage" element={<ProfilePage />} />
                                        <Route path="/wallet" element={<Wallet />} />
                                        <Route path="/activitypage" element={<ActivityPage />} />
                                        <Route path="/promotionpage" element={<PromotionPage />} />
                                        <Route path="/subordinate" element={<Subordinate />} />
                                        <Route path="/commissiondetailpage" element={<CommissionDetailsPage />} />
                                        <Route path="/promotionrule" element={<PromotionRule />} />
                                        <Route path="/agentcustomer" element={<AgentCustomer />} />
                                        <Route path="/rebateratio" element={<RebateRatio />} />
                                        <Route path="/newsubordinate" element={<NewSubordinate />} />
                                        <Route path="/invitepage" element={<InvitePage />} />
                                        <Route path="/invitebonus" element={<ActivityAward />} />
                                        <Route path="/rebate" element={<Rebate />} />
                                        <Route path="/jackpot" element={<Jackpot />} />
                                        <Route path="/gift" element={<Gift />} />
                                        <Route path="/attendancebonus" element={<Attandancebonus />} />
                                        <Route path="/game-rules" element={<AttendanceBonusCombined />} />
                                        <Route path="/activityawards" element={<ActivityAwardss />} />
                                        <Route path="/invitationrule" element={<InviteBonusTable />} />
                                        <Route path="/invitaionrecord" element={<MemberInfoCard />} />
                                        <Route path="/activitygamesrules" element={<ActivityDetails />} />
                                        <Route path="/chat-support" element={<OnlineChatSupport />} />
                                        <Route path="/lotterywingo" element={<LotteryWingo />} />
                                        <Route path="/depositwingo" element={<DepositWingo />} />
                                        <Route path="/withdrawwingo" element={<WithdrawWingo />} />
                                        <Route path="/lotteryk3" element={<LotteryK3 />} />
                                        <Route path="/depositk3" element={<DepositK3 />} />
                                        <Route path="/withdrawk3" element={<WithdrawK3 />} />
                                        <Route path="/lottery5d" element={<Lottery5d />} />
                                        <Route path="/deposit5d" element={<Deposit5d />} />
                                        <Route path="/withdraw5d" element={<Withdraw5d />} />
                                        <Route path="/lotterytrxwingo" element={<LotteryTrxWingo />} />
                                        <Route path="/deposittrx" element={<DepositTrx />} />
                                        <Route path="/withdrawtrx" element={<WithdrawTrx />} />
                                        <Route path="/orderdetail" element={<OrderDetailsComponent />} />
                                        <Route path="/deposit" element={<Deposit />} />
                                        <Route path="/withdraw" element={<Withdraw />} />
                                        <Route path="/deposit-history" element={<DepositHistory />} />
                                        <Route path="/withdraw-history" element={<WithdrawHistory />} />
                                        <Route path="/bankaccountform" element={<BankAccountForm />} />
                                        <Route path="/addusdt" element={<WalletForm />} />
                                        <Route path="/passwordchangeform" element={<PasswordChangeForm />} />
                                        <Route path="/resetemail" element={<LoginVerificationForm />} />
                                        <Route path="/aboutusprofile" element={<AboutusProfile />} />
                                        <Route path="/arwallet" element={<ARWallet />} />
                                        <Route path="/beginnerguide" element={<BeginnerGuide />} />
                                        <Route path="/customerserviceprofile" element={<CustomerServiceProfile />} />
                                        <Route path="/deposithistoryprofile" element={<DepositHistoryProfile />} />
                                        <Route path="/depositprofile" element={<DepositProfile />} />
                                        <Route path="/feedbackprofile" element={<FeedbackProfile />} />
                                        <Route path="/gamehistoryprofile" element={<GameHistoryProfile />} />
                                        <Route path="/gamestatistics" element={<GameStatistics />} />
                                        <Route path="/giftsprofile" element={<GiftsProfile />} />
                                        <Route path="/notificationprofile" element={<NotificationProfile />} />
                                        <Route path="/notificationsservice" element={<Notifications />} />
                                        <Route path="/safeprofile" element={<SafeProfile />} />
                                        <Route path="/settingsprofile" element={<UserProfile />} />
                                        <Route path="/transactionprofile" element={<TransactionProfile />} />
                                        <Route path="/vipprofile" element={<VIPProfile />} />
                                        <Route path="/withdrawhistoryprofile" element={<WithdrawHistoryProfile />} />
                                        <Route path="/withdrawprofile" element={<WithdrawProfile />} />
                                        <Route path="/safe" element={<FinancialCard />} />
                                        <Route path="/about-safe" element={<RulesComponent />} />
                                        <Route path="/viphistory" element={<VIPHistory />} />
                                        <Route path="/SlotGame" element={<SlotGame />} />
                                        <Route path="/original-games" element={<OriginalGames />} />
                                        <Route path="/SportsGame" element={<SportsGame />} />
                                        <Route path="/casino-games" element={<CasinoGames />} />
                                        <Route path="/collect-reward" element={<CollectReward />} />
                                    </Route>

                                    {/* Default Redirect */}
                                    <Route path="*" element={<Navigate to="/login" replace />} />
                                </Routes>
                            </AudioProvider>
                        </Suspense>
                    </main>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;