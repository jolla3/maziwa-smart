// /src/components/Sellers/routes/sellerRoutes.js
import {
  LayoutDashboard,
  List,
  ClipboardCheck,
  Store,
  Eye,
  MessageCircle,
  Clock
} from "lucide-react";

const sellerRoutes = [
  {
    path: "/slr.drb/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    path: "/slr.drb/my-listings",
    label: "My Listings",
    icon: List
  },
  {
    path: "/slr.drb/seller-approval",
    label: "Approval",
    icon: ClipboardCheck
  },
  {
    path: "/slr.drb/market",
    label: "Market",
    icon: Store
  },
  {
    path: "/slr.drb/view-market",
    label: "Market View",
    icon: Eye
  },
  {
    path: "/slr.drb/chatroom",
    label: "Chat Room",
    icon: MessageCircle
  },
  {
    path: "/slr.drb/recents",
    label: "Recent Chats",
    icon: Clock
  }
];

export default sellerRoutes;
