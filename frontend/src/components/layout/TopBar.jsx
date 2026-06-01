
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <header className=" w-[1372px] h-[75.59px]  bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3 flex-shrink-0">
      
      <Button className="bg-[#001744] hover:bg-[#152060] text-white text-[16px] rounded-[8px] pt-[12px] pr[20px] pb-[12px] pl-[20px] gap-[8px] h-[52px] w-[168px]  flex items-center gap-2">
        
        Upgrade
        
        
        <span 
        
        className="bg-[#3a4685] text-white text-[16px] font-bold px-2 py-0.5 rounded-md"><span className="text-yellow-300 text-[16px]">⚡</span>921</span>
      </Button>

      <button className="w-[44px] h-[44px] rounded-full border border-[#5c5c5c] flex items-center justify-center hover:bg-gray-50 transition-colors relative">
      <img
  src="bell.svg"
  alt="Notifications"
  className="w-[24px] h-[24px]"
/>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <button className="w-[44px] h-[44px] rounded-full border border-[#5c5c5c] flex items-center justify-center hover:bg-gray-50 transition-colors">
      <img
  src="message.svg"
  alt="mess"
  className="w-[20px] h-[20px]"
  
/>
      </button>
      
    </header>
  );
}