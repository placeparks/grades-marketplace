"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ToggleButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string>("buy");

  useEffect(() => {
    if (pathname === "/buy" || pathname === "/sell") {
      setActive(pathname.substring(1)); // Set active state based on current path
    }
  }, [pathname]);

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <div className="relative flex items-center w-full max-w-xs md:max-w-md h-[50px] md:h-[63px] border-2 border-black rounded-[15px] bg-[#C56BDD] overflow-hidden">
      <button
        className={`relative flex-1 h-full ${
          active === "buy" ? "text-white" : "text-white"
        } transition-colors duration-300`}
        onClick={() => handleNavigation("buy")}
      >
        {active === "buy" && (
          <div className="absolute inset-0 m-1 bg-[#5591DA] rounded-xl transition-all duration-500"></div>
        )}
        <span className="relative z-10">BUY</span>
      </button>
      <div className="relative h-[65%] w-[3px] bg-[#6A6A6A]"></div>
      <button
        className={`relative flex-1 h-full ${
          active === "sell" ? "text-white" : "text-white"
        } transition-colors duration-300`}
        onClick={() => handleNavigation("sell")}
      >
        {active === "sell" && (
          <div className="absolute inset-0 m-1 bg-[#5591DA] rounded-xl transition-all duration-500"></div>
        )}
        <span className="relative z-10">SELL</span>
      </button>
    </div>
  );
};

export default ToggleButton;
