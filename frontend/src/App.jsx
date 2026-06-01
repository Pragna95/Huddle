import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import HuddlePage from "@/components/huddle/HuddlePage";
import AISummaryCard from "@/components/chat/AISummaryCard";
import OutgoingCallModal from "./components/OutgoingCallModal";


export default function App() {
  const [showCallModal, setShowCallModal] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          <HuddlePage />
          

          {showCallModal && (
            <OutgoingCallModal
              closeModal={() => setShowCallModal(false)}
            />
          )} 
          
        </div>
       </div>
    </div>
   );
}