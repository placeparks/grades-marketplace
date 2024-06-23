"use client";
import React, { useEffect, useState } from "react";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import { NFT as NFTType } from "thirdweb";
import { getNFTs, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import { NFT_COLLECTION } from "@/const/contracts";
import toast from "react-hot-toast";
import toastStyle from "@/util/toastConfig";


interface OwnedNFT {
  tokenId: bigint;
  metadata: NFTType['metadata'];
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [selectedNft, setSelectedNft] = useState<OwnedNFT | undefined>();

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
              return { tokenId: nft.id, metadata: nft.metadata };
            }
            return null;
          });

          const ownedNfts = (await Promise.all(ownedNftsPromises)).filter(
            (nft) => nft !== null
          );
          setOwnedNFTs(ownedNfts as OwnedNFT[]);
        } catch (err) {
          toast.error("Something went wrong while fetching your NFTs!", {
            position: "bottom-center",
            style: toastStyle,
          });
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOwnedNFTs();
  }, [account]);

  return (
    <div className="p-12">
      <h1>{"Owned NFT(s)"}</h1>
      <p>Browse and manage your NFTs from this collection.</p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {ownedNFTs.map((nft) => (
            <div
              key={nft.tokenId.toString()}
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg flex flex-col w-[308px] h-[450px] bg-[#5591DA] justify-stretch border border-4 overflow-hidden border-black rounded-[35px]"
              onClick={() => setSelectedNft(nft)}
            >
              <div className="relative w-full h-fit bg-[#5591DA]">
                {nft.metadata.image && (
                  <MediaRenderer
                    src={nft.metadata.image}
                    client={client}
                    className="p-4 w-[268px] h-[270px] object-center object-top"
                  />
                )}
                <div className="flex items-center justify-between flex-1 w-full px-3 bg-[#5591DA]">
                  <div className="flex flex-col justify-center py-3">
                    <p className="max-w-full overflow-hidden text-lg text-white text-ellipsis whitespace-nowrap">
                      {nft.metadata.name}
                    </p>
                    <p className="text-sm font-semibold text-white/60">
                      #{nft.tokenId.toString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    
    </div>
  );
}
