import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import "@/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
		"Create an NFT marketplace on top of your NFT collection on any EVM-compatible blockchain.",
};

export default function RootLayout({
  children,
}: {
	children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden max-w-screen">

        <Toaster />
        <ThirdwebProvider>
          <Navbar />
          <div className="w-screen min-h-screen">
            <div className=" mt-28 max-w-full">
              {children}
            </div>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
