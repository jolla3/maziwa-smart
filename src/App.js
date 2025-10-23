// src/App.js
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./admin.css";
import "./theme";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider } from "./components/PrivateComponents/AuthContext";
import Topbar from "./components/globals/Topbar";
import Homepage from "./components/globals/Homepage";
import Login from "./components/globals/Login";
import AdminRegister from "./components/globals/RegisterAdmin";
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
import Calendar from "./components/globals/calendar";
import PorterProfileForm from "./components/porters/MyProfile";
import AddMilk from "./components/porters/AddMilk";
import PorterLayout from "./components/porters/porterLayout";
import PorterMilkSummary from "./components/porters/PorterMilkSummary";
import MonthlyPorterSummary from "./components/porters/MonthlyPorterSummary";
import PorterHome from "./components/porters/PorterHome";
import FarmerLayout from "./components/farmer/farmerLayout";
// import NotAuthorized from "./components/globals/NotAuthorized";
import DailyMilkSummary from "./components/farmer/DailyMilkSummary";
import FarmerHome from "./components/farmer/FarmerHome";
import BreedManagement from "./components/farmer/BreedManagment";
import CowManagement from "./components/farmer/CowManagement";
import AddCalf from "./components/farmer/AddCalf";
import CowFamilyTree from "./components/farmer/CowFamilyTree";
import CowRegistrationForm from "./components/farmer/CowRegistrationForm";
import AddCalfForm from "./components/farmer/AddCalfForm";
import MilkRecording from "./components/farmer/MilkRecording";
import DairySummaries from "./components/farmer/DairySummaries";
import InseminationCard from "./components/farmer/InseminationCard";
import EnhancedFarmDashboard from "./components/farmer/FarmDashboard";
import GoogleCallbackHandler from "./components/globals/GoogleCallbackHandle";
import PrivacyPolicy from "./components/PrivateComponents/PrivacyPolicy";
import TermsOfService from "./components/PrivateComponents/TermsOfService";
import ChatRoom from "./components/globals/ChatRoom";
import ChatList from "./components/globals/ChatList";
import MyListings from "./components/globals/MyListings";
import CreateListing from "./components/globals/CreateListing";
import EditListing from "./components/globals/EditListing";
import ViewListing from "./components/globals/ViewListing";
// import MarketplacePage from "./components/globals/MarketplacePage";
import MarketPage from "./components/globals/MarketplacePage";
import MarketView from "./components/globals/MarketView";
import Notifications from "./components/globals/Notification";
import FarmerRegister from "./components/globals/Registerfarmer";
import LandingPage from "./components/pages/landingPages/LandingPage";
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

            {/* <Route path="/google-login" element={<GoogleLogin />} /> */}
            <Route path="/google-callback" element={<GoogleCallbackHandler />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/recents" element={<ChatList />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/edit" element={<EditListing />} />
            <Route path="/view" element={<ViewListing />} />
            <Route path="/market" element={<MarketPage/>} />
            <Route path="/view-market" element={<MarketView/>} />
            <Route path="/notifications" element={<Notifications/>} />
            
            

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
              path="/farmerdashboard"
              element={
                <PrivateRoute role="farmer">
                  <FarmerLayout />
                </PrivateRoute>
              }
            >
              {/* Default dashboard landing page */}
              <Route index element={< FarmerHome/>} />
              {/* Other porter pages */}
              
              <Route path="calendar" element={<Calendar />} />
              <Route path="daily" element={<DailyMilkSummary />} />
              <Route path="breeds" element={<BreedManagement />} />
              <Route path="cows" element={<CowManagement />} />
              <Route path="calf" element={<AddCalf />} />
              <Route path="familytree" element={<CowFamilyTree />} />
              <Route path="register-cow" element={<CowRegistrationForm />} />
              <Route path="register-calf" element={<AddCalfForm />} />
              <Route path="milkrecording" element={<MilkRecording />} />
              <Route path="dairysummaries" element={<DairySummaries />} />
              <Route path="inseminationcard" element={<InseminationCard />} />
              <Route path="farmerdash" element={<EnhancedFarmDashboard />} />
            </Route>

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <h3 className="text-center mt-5">404 - Page Not Found</h3>
              }
            />

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
