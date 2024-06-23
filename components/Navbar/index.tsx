"use client";

import { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import client from "@/lib/client";
import { NETWORK } from "@/const/contracts";
import { useActiveAccount } from "thirdweb/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { address } = useActiveAccount() || {};

  return (
    <div className="fixed top-0 z-10 w-full bg-transparent text-white/60 backdrop-blur-md">
      <nav className="flex items-center justify-between w-full px-4 py-3 mx-auto max-w-7xl md:px-8 md:py-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="mr-4">
            <Image
              src="/logo1.png"
              width={72}
              height={72}
              alt="NFT marketplace sample logo"
              className="h-12 w-auto md:h-[80.42px] md:w-[123.81px]"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6 font-medium text-black">
            <Link href="/mint" className="transition hover:text-blue/100">
              Mint
            </Link>
            <Link href="/collection" className="transition hover:text-blue/100">
              Collection
            </Link>
            {!isHomePage && (
              <>
                <Link href="/buy" className="transition hover:text-blue/100">
                  Buy
                </Link>
                <Link href="/sell" className="transition hover:text-blue/100">
                  Sell
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <ConnectButton theme="dark" client={client} chain={NETWORK} />
          {address && (
            <Link href={`/profile/${address}`}>
              <Image
                src="/user-icon.png"
                width={32}
                height={32}
                alt="Profile"
                className="rounded-full"
              />
            </Link>
          )}
          <button
            className="block md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white text-black w-full px-4 py-3">
          <Link href="/mint" className="block py-2 hover:text-blue/100">
            Mint
          </Link>
          <Link href="/collection" className="block py-2 hover:text-blue/100">
            Collection
          </Link>
          {!isHomePage && (
            <>
              <Link href="/buy" className="block py-2 hover:text-blue/100">
                Buy
              </Link>
              <Link href="/sell" className="block py-2 hover:text-blue/100">
                Sell
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
