// ============================================================================
// FILE: /src/components/sellerdashboard/routes/sellerRoutes.js
// ============================================================================
import {
  LayoutDashboard,
  List,
  PlusCircle,
  Edit,
  Eye,
  ClipboardCheck,
  Store,
  MessageCircle,
  Clock
} from "lucide-react";

// Your real page imports
import DashboardPage from "../pages/DashboardHomePage";
import MyListings from "../pages/market crud/MyListings";
// import CreateListing from "../../../pages/seller/CreateListing";
// import EditListing from "../../../pages/seller/EditListing";
// import ViewListing from "../pages/market crud/ViewListing";
import SellerRequest from "../pages/seller Request approval/SellerRequest";
import MarketPage from "../../globals/global markets/MarketplacePage";
import MarketView from "../../globals/global markets/MarketView";
import ChatRoom from "../../globals/CHAT/ChatRoom";
import ChatList from "../../globals/CHAT/ChatList";

export const sellerRoutes = [
  {
    path: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    element: DashboardPage ? <DashboardPage /> : null
  },
  {
    path: "my-listings",
    label: "My Listings",
    icon: List,
    element: <MyListings />, // parent can render an index/listing page
    children: [
      {
        path: "", // /seller/my-listings  -> index (MyListings)
        label: "List",
        element: <MyListings />
      } ]
  },
  {
    path: "seller-approval",
    label: "Approval",
    icon: ClipboardCheck,
    element: <SellerRequest />
  },
  {
    path: "market",
    label: "Market",
    icon: Store,
    element: <MarketPage />
  },
  {
    path: "view-market",
    label: "Market View",
    icon: Eye,
    element: <MarketView />
  },
  {
    path: "chatroom",
    label: "Chat Room",
    icon: MessageCircle,
    element: <ChatRoom />
  },
  {
    path: "recents",
    label: "Recent Chats",
    icon: Clock,
    element: <ChatList />
  }
];
