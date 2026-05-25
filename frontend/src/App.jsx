import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import HuddlePage from "@/components/huddle/HuddlePage";
import AISummaryCard from "./components/AISummaryCard";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <HuddlePage />
          
        </div>
      </div>
    </div>
  );
}