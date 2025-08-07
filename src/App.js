// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './admin.css';

// Auth and Private Route
import { AuthProvider } from './components/PrivateComponents/AuthContext';
import PrivateRoute from './components/PrivateComponents/PrivateRoute';

// Pages
import HomePage from './components/Homepage';
import Login from './components/Login';
import RegisterAdmin from './components/RegisterAdmin';
import AdminDashboard from './components/AdminDashboard';

// Porter Dashboard & Actions
import MyPortersDash from './components/DashboardTabs/MyPortersDash';
import CreatePorter from './components/DashboardTabs/myporters/CreatePorter';
import ViewPorters from './components/DashboardTabs/myporters/ViewPorters';
import UpdatePorterForm from './components/DashboardTabs/myporters/UpdatePorter';
import DeletePorter from './components/DashboardTabs/myporters/DeletePorter';

// Farmer Dashboard & Actions
import MyFarmersDash from './components/DashboardTabs/MyFarmerDash';
import CreateFarmer from './components/DashboardTabs/myfarmers/CreateFarmer';
import DeleteFarmer from './components/DashboardTabs/myfarmers/DeleteFarmers';
import ViewFarmers from './components/DashboardTabs/myfarmers/ViewFarmers';
import UpdateFarmer from './components/DashboardTabs/myfarmers/UpdateFarmer';
// import UpdateFarmer from './components/DashboardTabs/myFarmers/UpdateFarmer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterAdmin />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admindashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route path="view-farmers" element={<ViewFarmers />} />
            <Route path="view-porters" element={<ViewPorters />} />
          </Route>
          {/* ==============================
                Porter Management Routes
            ============================== */}
          <Route path="myporterDash" element={<MyPortersDash />} />
          <Route path="create-porter" element={<CreatePorter />} />
          <Route path="update-porter/:id" element={<UpdatePorterForm />} />
          <Route path="delete-porter/:id" element={<DeletePorter />} />

          {/* ==============================
                Farmer Management Routes
            ============================== */}
          <Route path="/myfarmerDash" element={<MyFarmersDash />} />
          <Route path="/create-farmer" element={<CreateFarmer />} />
          <Route path="/view-farmers" element={<ViewFarmers />} />
          <Route path="/update-farmer/:id" element={<UpdateFarmer />} />
          <Route path="/delete-farmer/:id" element={<DeleteFarmer />} />

          {/* </Route> */}

          {/* 404 Page */}
          <Route
            path="*"
            element={<h3 className="text-center mt-5">404 - Page Not Found</h3>}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
