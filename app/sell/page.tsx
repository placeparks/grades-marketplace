"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import NFTGrid, { NFTGridLoading } from "@/components/NFT/NFTGrid";
import { NFT as NFTType } from "thirdweb";
import { getNFTs, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import SaleInfo from "@/components/SaleInfo";
import client from "@/lib/client";
import { NFT_COLLECTION } from "@/const/contracts";
import toast from "react-hot-toast";
import toastStyle from "@/util/toastConfig";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<{ tokenId: bigint; nft: NFTType }[]>([]);
  const [selectedNft, setSelectedNft] = useState<NFTType | undefined>();

  const account = useActiveAccount();

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (account) {
        setLoading(true);
        try {
          const totalNFTSupply = await totalSupply({
            contract: NFT_COLLECTION,
          });
          const nfts = await getNFTs({
            contract: NFT_COLLECTION,
            start: 0,
            count: parseInt(totalNFTSupply.toString()),
          });

          const ownedNftsPromises = nfts.map(async (nft) => {
            const owner = await ownerOf({
              contract: NFT_COLLECTION,
              tokenId: nft.id,
            });
            if (owner === account.address) {
              return { tokenId: nft.id, nft };
            }
            return null;
          });

          const ownedNfts = (await Promise.all(ownedNftsPromises)).filter(
            (nft) => nft !== null
          );
          setOwnedNFTs(ownedNfts as { tokenId: bigint; nft: NFTType }[]);
        } catch (err) {
          toast.error(
            "Something went wrong while fetching your NFTs!",
            {
              position: "bottom-center",
              style: toastStyle,
            }
          );
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOwnedNFTs();
  }, [account]);

  return (
    <div className="bg-[#FAFAF4]">
      <div className="content-container">
        <h1 className="text-4xl text-black pl-12 pt-12">Sell NFTs</h1>
        <div className="pl-12 pt-4">
          {!selectedNft ? (
            <>
              {loading ? (
                <NFTGridLoading />
              ) : (
                <NFTGrid
                  nftData={ownedNFTs.map((nft) => ({
                    tokenId: nft.tokenId,
                    nft: nft.nft,
                  }))}
                  overrideOnclickBehavior={(nft) => {
                    setSelectedNft(nft);
                  }}
                  emptyText={
                    !account
                      ? "Connect your wallet to list your NFTs!"
                      : "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
                  }
                />
              )}
            </>
          ) : (
            <div className="flex h-screen w-full relative gap-8 mt-0 content-container ">
              <div className="flex flex-col w-full ">
                <div className="relative">
                  <MediaRenderer
                    client={client}
                    src={selectedNft.metadata.image}
                    className="rounded-lg !w-3/5 !h-auto bg-white/[.04]"
                  />
                  <button
                    onClick={() => {
                      setSelectedNft(undefined);
                    }}
                    className="absolute top-0 right-0 m-3 transition-all cursor-pointer hover:scale-110"
                  >
                    <Cross1Icon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="relative top-0 w-full max-w-full">
                <h1 className="mb-1 text-3xl font-semibold break-words">
                  {selectedNft.metadata.name}
                </h1>
                <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  #{selectedNft.id.toString()}
                </p>
                <p className="text-black/60">
                  You&rsquo;re about to list the following item for sale.
                </p>

                <div className="relative flex flex-col flex-1 py-4 overflow-hidden bg-transparent rounded-lg">
                  <SaleInfo nft={selectedNft} />
                </div>
							  </div>
							  
            </div>
          )}
        </div>
      </div>
      <div className="bgsection"></div>
    </div>
  );
}
