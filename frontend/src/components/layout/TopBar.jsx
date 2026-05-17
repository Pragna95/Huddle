import { Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3 flex-shrink-0">
      <Button className="bg-[#1e2b72] hover:bg-[#152060] text-white text-sm rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-yellow-300">⚡</span>
        Upgrade
        <span className="bg-[#152060] text-white text-xs font-bold px-2 py-0.5 rounded-md">921</span>
      </Button>

      <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors relative">
        <Bell className="w-4 h-4 text-gray-600" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
        <MessageCircle className="w-4 h-4 text-gray-600" />
      </button>
    </header>
  );
}