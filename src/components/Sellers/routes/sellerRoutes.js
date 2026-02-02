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
    path: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    path: "my-listings",
    label: "My Listings",
    icon: List
  },
  {
    path: "seller-approval",
    label: "Approval",
    icon: ClipboardCheck
  },
  {
    path: "market",
    label: "Market",
    icon: Store
  },
  {
    path: "view-market",
    label: "Market View",
    icon: Eye
  },
  {
    path: "chatroom",
    label: "Chat Room",
    icon: MessageCircle
  },
  {
    path: "recents",
    label: "Recent Chats",
    icon: Clock
  }
];

export default sellerRoutes;