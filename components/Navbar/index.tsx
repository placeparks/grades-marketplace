"use client"

import { ConnectButton } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import client from "@/lib/client";
import { NETWORK } from "@/const/contracts";

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="fixed top-0 z-10 flex items-center justify-center w-full bg-transparent text-white/60 backdrop-blur-md">
      <nav className="flex items-center justify-between w-full px-8 py-5 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="mr-4">
            <Image
              src="/logo1.png"
              width={72}
              height={72}
              alt="NFT marketplace sample logo"
              className="h-16 w-auto md:h-[80.42px] md:w-[123.81px]"
            />
          </Link>
          <Link href="/mint" className="text-black transition hover:text-blue/100">
                Mint
              </Link>
          {!isHomePage && (
            <div className="flex items-center gap-6 font-medium text-black">
              <Link href="/buy" className="transition hover:text-blue/100">
                Buy
              </Link>
              <Link href="/sell" className="transition hover:text-blue/100">
                Sell
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="">
            <ConnectButton theme="dark" client={client} chain={NETWORK} />
          </div>
        </div>
      </nav>
    </div>
  );
}
