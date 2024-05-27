"use client";
import React, { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { NFT_COLLECTION } from "../../const/contracts";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import { MediaRenderer } from "thirdweb/react";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import Skeleton from "@/components/Skeleton";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  tokenId: bigint;
  nft?: NFT;
  directListing?: DirectListing;
  auctionListing?: EnglishAuction;
  overrideOnclickBehavior?: (nft: NFT) => void;
};

export default function NFTComponent({
  tokenId,
  directListing,
  auctionListing,
  overrideOnclickBehavior,
  ...props
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [nft, setNFT] = useState(props.nft);

  useEffect(() => {
    if (nft?.id !== tokenId) {
      getNFT({
        contract: NFT_COLLECTION,
        tokenId: tokenId,
        includeOwner: true,
      }).then((nft) => {
        setNFT(nft);
      });
    }
  }, [tokenId, nft?.id]);

  if (!nft) {
    return <LoadingNFTComponent />;
  }

  const buttonText = pathname.includes("buy") ? "Buy NFT" : "Sell NFT";

  return (
    <div
      className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg flex flex-col w-[308px] h-[469px] bg-[#5591DA] justify-stretch border border-4 overflow-hidden border-black rounded-[35px]"
      onClick={
        overrideOnclickBehavior
          ? () => overrideOnclickBehavior(nft!)
          : () =>
              router.push(
                `/token/${NFT_COLLECTION.address}/${tokenId.toString()}`
              )
      }
    >
      <div className="relative w-full h-fit bg-[#5591DA]">
        {nft.metadata.image && (
          <MediaRenderer
            src={nft.metadata.image}
            client={client}
            className="p-4 w-[268px] h-[253px] object-center object-top"
          />
        )}
        <div className="flex items-center justify-between flex-1 w-full px-3 bg-[#5591DA]">
          <div className="flex flex-col justify-center py-3">
            <p className="max-w-full overflow-hidden text-lg text-white text-ellipsis whitespace-nowrap">
              {nft.metadata.name}
            </p>
            <p className="text-sm font-semibold text-white/60">
              #{nft.id.toString()}
            </p>
          </div>

          {(directListing || auctionListing) && (
            <div className="flex flex-col items-end justify-center">
              <p className="max-w-full mb-1 overflow-hidden font-medium text-ellipsis whitespace-nowrap text-white/60">
                Price
              </p>
              <p className="max-w-full overflow-hidden text-white text-ellipsis whitespace-nowrap">
                {directListing
                  ? `${directListing?.currencyValuePerToken.displayValue}${directListing?.currencyValuePerToken.symbol}`
                  : `${auctionListing?.minimumBidCurrencyValue.displayValue}${auctionListing?.minimumBidCurrencyValue.symbol}`}
              </p>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="md:tracking-wider relative inline-block px-4 md:px-0 ml-2 md:leading-4 md:h-[53px] md:w-[159px] transition-all duration-300 rounded-2xl overflow-hidden z-10 montserrat-bold text-md md:text-[20px] bg-[#e63b51] border-4 border-black custom-button"
      >
        {buttonText}
        <style jsx>{`
          .custom-button::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffba00;
            z-index: -2;
          }
          .custom-button::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background-color: #e63b51;
            transition: all 0.3s;
            z-index: -1;
          }
          .custom-button:hover::before {
            width: 100%;
          }
        `}</style>
      </button>
    </div>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="w-full h-[350px] rounded-lg">
      <Skeleton width="100%" height="100%" />
    </div>
  );
}
