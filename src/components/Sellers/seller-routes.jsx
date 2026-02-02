import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SellerApp from './SellerApp';
import DashboardHomePage from './pages/DashboardHomePage';

import SellerRequest from './pages/seller Request approval/SellerRequest';
import MarketPage from '../globals/global markets/marketviewpage/MarketplacePage';
import MarketView from '../globals/global markets/MarketView';
import ChatRoom from '../globals/CHAT/chatroom/ChatRoom';
import ChatList from '../globals/CHAT/ChatList';
import EditListing from './pages/market crud/EditListing';
import CreateListing from './pages/market crud/CreateListing';
import ViewListing from './pages/market crud/ViewListing';
import MyListings from './pages/market crud/MyListings';

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SellerApp />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHomePage />} />
        <Route path="my-listings" element={<MyListings />} />
        <Route path="edit" element={<EditListing />} />
        <Route path="create" element={<CreateListing />} />
        <Route path="view" element={<ViewListing />} />
        {/* <Route path="my-listings" element={< />} /> */}
        <Route path="seller-approval" element={<SellerRequest />} />
        <Route path="market/*" element={<MarketPage />} />
        <Route path="view-market" element={<MarketView />} />
        <Route path="chatroom" element={<ChatRoom />} />
        <Route path="recents" element={<ChatList />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;    