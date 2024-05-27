import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import ToggleButton from "@/components/ToggleButton";

/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  return (
    <div className="bg-[#FAFAF4]">
      <div className="flex justify-center p-2">
        <Image
            src="/assets/market.png"
            width={860}
          height={540}
          alt="Hero asset, NFT marketplace"
          quality={100}
          className="max-w-screen mb-4"
        />
      </div>
      <div className="px-8 mx-auto flex justify-center text-center">
 <ToggleButton/>
      </div>
    </div>
  );
};

export default Home;
