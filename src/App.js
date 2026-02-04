// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./theme";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider } from "./components/PrivateComponents/AuthContext";
import Topbar from "./components/globals/Topbar";
// import Homepage from "./components/globals/Homepage";
import Login from "./components/globals/logins/Login";
import AdminRegister from "./components/globals/logins/RegisterAdmin";
import PrivateRoute from "./components/PrivateComponents/PrivateRoute";

import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import ViewFarmers from "./components/admin/myfarmers/ViewFarmers";
import CreateFarmer from "./components/admin/myfarmers/CreateFarmer";
import ViewPorters from "./components/admin/myporters/ViewPorters";
import CreatePorter from "./components/admin/myporters/CreatePorter";
import UpdatePorterForm from "./components/admin/myporters/UpdatePorter";
import UpdateFarmer from "./components/admin/myfarmers/UpdateFarmer";
import Records from "./components/admin/Records";
import DownloadMonthlyReport from "./components/scenes/DownloadReport";
import AdminMilkSummary from "./components/admin/AdminMilkSummary";
import Calendar from "./components/scenes/calendar";
import PorterProfileForm from "./components/porters/MyProfile";
import AddMilk from "./components/porters/AddMilk";
import PorterLayout from "./components/porters/porterLayout";
import PorterMilkSummary from "./components/porters/PorterMilkSummary";
import MonthlyPorterSummary from "./components/porters/MonthlyPorterSummary";
import PorterHome from "./components/porters/PorterHome";
import FarmerLayout from "./components/farmer/farmerLayout";
// import NotAuthorized from "./components/globals/NotAuthorized";
import DailyMilkSummary from "./components/farmer/CRUD/DailyMilkSummary";
import BreedManagement from "./components/farmer/CRUD/BreedManagment";
// import CowManagement from "./components/farmer/CowManagement";
// import CowFamilyTree from "./components/farmer/CowFamilyTree";
import CowRegistrationForm from "./components/farmer/CRUD/CowRegistrationForm";
import AddCalfForm from "./components/farmer/CRUD/AddCalfForm";
import MilkRecording from "./components/farmer/CRUD/MilkRecording";
import DairySummaries from "./components/farmer/CRUD/DairySummaries";
import InseminationCard from "./components/farmer/CRUD/InseminationCard";
import GoogleCallbackHandler from "./components/globals/logins/GoogleCallbackHandle";
import PrivacyPolicy from "./components/PrivateComponents/PrivacyPolicy";
import TermsOfService from "./components/PrivateComponents/TermsOfService";
import ChatRoom from "./components/globals/CHAT/chatroom/ChatRoom";
import ChatList from "./components/globals/CHAT/ChatList";
import MyListings from "./components/globals/global markets/market crud/MyListings";
import CreateListing from "./components/globals/global markets/market crud/CreateListing";
import EditListing from "./components/globals/global markets/market crud/EditListing";
import ViewListing from "./components/globals/global markets/market crud/ViewListing";
// import MarketplacePage from "./components/globals/MarketplacePage";
import MarketPage from "./components/globals/global markets/marketviewpage/MarketplacePage";
// import MarketView from "./components/globals/MarketView";
import Notifications from "./components/globals/Notification";
import FarmerRegister from "./components/globals/logins/Registerfarmer";
import LandingPage from "./components/pages/landingPages -- HOMEPAGE/LandingPage";
import SellerRegister from "./components/globals/logins/SellerRegister";
import SellerRequest from "./components/Sellers/pages/seller Request approval/SellerRequest";
import AdminSellerRequests from "./components/SUPERaDMIN/AdminSellerRequests";
// import MarketView from "./components/globals/global markets/market view/MarketView";
import InseminationRecordsList from "./components/farmer/CRUD/InseminationRecordsList";
import AnimalDashboard from "./components/farmer/animals/AnimalDashboard";
import FarmerHome from "./components/farmer/farmhome/FarmerHome";
import MarketView from "./components/globals/global markets/MarketView";
import SetPassword from "./components/globals/logins/SetPassword";
// import DashboardHome from "./components/SUPERaDMIN/DashboardHome";
import SuperAdminRoutes from "./components/SUPERaDMIN/superadmin-routes";
// import SellerDashboard from "./components/Sellers/SellerDashboard";
// import DashboardHomePage from "./components/Sellers/pages/DashboardHomePage";
import MilkIntelligenceDashboard from "./components/farmer/CRUD/MilkAnimalSummary";
import PurchaseHistoryPage from "./components/globals/global markets/marketviewpage/pages/PurchaseHistoryPage";
import BasketPage from "./components/globals/global markets/marketviewpage/pages/BasketPage";
import WishlistPage from "./components/globals/global markets/marketviewpage/pages/WishlistPage";
import SellerRoutes from "./components/Sellers/seller-routes";
import SellerAnalytics from "./components/farmer/farmhome/components/SellerAnalytics";
import ForgotPassword from "./components/PrivateComponents/ForgotPassword";
import ResetPassword from "./components/PrivateComponents/ResetPassword";
import ProfilePage from "./components/PrivateComponents/ProfilePage";
import NotAuthorized from "./components/globals/NotAuthorized";
// import { GoogleLogin } from "@react-oauth/google";


// import farmerLayout from './components/farmer/farmerLayout'
// import Calendar from "./components/globals/Calendar";
// import AdminMilkSummary.jsx from "./components/admin/AdminMilkSummary";




function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          {/* Global Topbar */}
          <Topbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="register" element={<AdminRegister />} />
            <Route path="register_farmer" element={<FarmerRegister />} />
            <Route path="register_seller" element={<SellerRegister />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />


            {/* <Route path="/google-login" element={<GoogleLogin />} /> */}
            <Route path="/google-callback" element={<GoogleCallbackHandler />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/recents" element={<ChatList />} />
            {/* <Route path="/my-listings" element={<MyListings />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/edit" element={<EditListing />} />
            <Route path="/view" element={<ViewListing />} /> */}
            <Route path="/market/*" element={<MarketPage />} />
            <Route path="/view-market" element={<MarketView />} />
            <Route path="/animal-milk-summary" element={<MilkIntelligenceDashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/seller-approval" element={<SellerRequest />} />
            <Route path="/admin-approval" element={<AdminSellerRequests />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<ProfilePage />} />



            {/* superadmin Routes */}
            {/* // CORRECT - SuperAdminRoutes handles its own internal routing */}
            <Route
              path="/spr.dmn/*"
              element={
                <PrivateRoute role="superadmin">
                  <SuperAdminRoutes />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              {/* <Route index element={<AdminHome />} /> */}
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admindashboard"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              <Route index element={<AdminHome />} />

              {/* Other admin pages */}
              <Route path="view-farmers" element={<ViewFarmers />} />
              <Route path="create-farmer" element={<CreateFarmer />} />
              <Route path="view-porters" element={<ViewPorters />} />
              <Route path="create-porter" element={<CreatePorter />} />
              <Route path="update-porter" element={<UpdatePorterForm />} />
              <Route path="update-farmer" element={<UpdateFarmer />} />
              <Route path="records" element={<Records />} />
              <Route path="download" element={<DownloadMonthlyReport />} />
              <Route path="summary" element={<AdminMilkSummary />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>

            {/* porter Routes */}
            <Route
              path="/porterdashboard"
              element={
                <PrivateRoute role="porter">
                  <PorterLayout />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              <Route index element={<PorterHome />} />

              {/* Other admin pages */}
              <Route path="myprofile" element={<PorterProfileForm />} />
              <Route path="addmilk" element={<AddMilk />} />
              <Route path="records" element={<PorterMilkSummary />} />
              <Route path="monthly" element={<MonthlyPorterSummary />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>


            {/* Farmer Routes */}
            <Route
              path="/fmr.drb"
              element={
                <PrivateRoute role="farmer">
                  <FarmerLayout />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              <Route index element={< FarmerHome />} />
              {/* Other porter pages */}

              <Route path="calendar" element={<Calendar />} />
              <Route path="daily" element={<DailyMilkSummary />} />
              <Route path="breeds" element={<BreedManagement />} />
              <Route path="cows" element={<AnimalDashboard />} />
              <Route path="calf" element={<AddCalfForm />} />


              <Route path="register-cow" element={<CowRegistrationForm />} />
              <Route path="register-calf" element={<AddCalfForm />} />
              <Route path="milkrecording" element={<MilkRecording />} />
              <Route path="dairysummaries" element={<DairySummaries />} />
              <Route path="inseminationcard" element={<InseminationCard />} />
              <Route path="insemination-record" element={<InseminationRecordsList />} />
              <Route path="chatroom" element={<ChatRoom />} />
              <Route path="recents" element={<ChatList />} />
              <Route path="my-listings" element={<MyListings />} />
              <Route path="create" element={<CreateListing />} />
              <Route path="edit" element={<EditListing />} />
              <Route path="view" element={<ViewListing />} />
              <Route path="market/*" element={<MarketPage />} />
              <Route path="view-market" element={<MarketView />} />
              <Route path="animal-milk-summary" element={<MilkIntelligenceDashboard />} />
              {/* <Route index element={<MainMarketView />} /> */}
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="basket" element={<BasketPage />} />
              <Route path="purchases" element={<PurchaseHistoryPage />} />
              <Route path="fmr-analytics" element={<SellerAnalytics />} />

            </Route>


            {/* managers  Routes */}
            <Route
              path="/man.drb"
              element={
                <PrivateRoute role="manager">
                  <FarmerLayout />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              <Route index element={< FarmerHome />} />
              {/* Other porter pages */}

              <Route path="calendar" element={<Calendar />} />
              <Route path="daily" element={<DailyMilkSummary />} />
              <Route path="breeds" element={<BreedManagement />} />
              <Route path="cows" element={<AnimalDashboard />} />
              <Route path="calf" element={<AddCalfForm />} />
              <Route path="register-cow" element={<CowRegistrationForm />} />
              <Route path="register-calf" element={<AddCalfForm />} />
              <Route path="milkrecording" element={<MilkRecording />} />
              <Route path="dairysummaries" element={<DairySummaries />} />
              <Route path="inseminationcard" element={<InseminationCard />} />
              <Route path="insemination-record" element={<InseminationRecordsList />} />

            </Route>


            <Route
              path="/slr.drb/*"
              element={
                <PrivateRoute role="seller">
                  <SellerRoutes />
                </PrivateRoute>
              }
            />



            {/* buyer  Routes */}
            <Route
              path="/byr.drb"
              element={
                <PrivateRoute role="buyer">
                  <FarmerLayout />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              <Route index element={< FarmerHome />} />
              {/* Other porter pages */}


              <Route path="seller-approval" element={<SellerRequest />} />
              <Route path="market" element={<MarketPage />} />
              <Route path="view-market" element={<MarketView />} />
              <Route path="chatroom" element={<ChatRoom />} />
              <Route path="recents" element={<ChatList />} />
            </Route>

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <NotAuthorized />
              }
            />

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
