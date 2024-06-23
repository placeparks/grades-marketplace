"use client";
import React, { useState, useEffect } from "react";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFTs, totalSupply, ownerOf, getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import { NFT_COLLECTION } from "@/const/contracts";
import { NFT } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common"; // Import the method to get contract metadata

function CollectionPage() {
  const nftsPerPage = 30;
  const [page, setPage] = useState(1);
  const [collectionNFTs, setCollectionNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalNFTCount, setTotalNFTCount] = useState<number>(0);

  // Use useReadContract to fetch contract metadata
  const { data: contractMetadata, isLoading: isMetadataLoading } = useReadContract(getContractMetadata, {
    contract: NFT_COLLECTION,
  });

  useEffect(() => {
    const fetchTotalSupply = async () => {
      const total = await totalSupply({
        contract: NFT_COLLECTION,
      });
      setTotalNFTCount(Number(total));
    };

    fetchTotalSupply();
  }, []);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const nfts = await getNFTs({
          contract: NFT_COLLECTION,
          start: (page - 1) * nftsPerPage,
          count: nftsPerPage,
        });

        const nftsWithOwners = await Promise.all(
          nfts.map(async (nft) => {
            let owner;
            try {
              owner = await ownerOf({
                contract: NFT_COLLECTION,
                tokenId: nft.id,
              });
            } catch (e) {
              owner = null; // If the owner cannot be fetched, it's not claimed.
            }
            return { ...nft, owner };
          })
        );

        setCollectionNFTs(nftsWithOwners);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [page]);

  return (
    <div className="m-0 bg-[#0A0A0A] p-0 font-inter text-neutral-200 min-h-screen">
      <header className="p-6">
        <h1 className="text-4xl font-bold text-center">NFT Collection</h1>
      </header>

      <div className="z-20 mx-auto flex flex-col px-4">
        {contractMetadata && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">
              {contractMetadata.name || "Unknown Collection"}
            </h1>
            <h2 className="text-xl font-bold text-white">
              {contractMetadata.description || "No description available."}
            </h2>
          </div>
        )}

        <div className="mt-6">
          {loading || isMetadataLoading ? (
            <div className="mx-auto flex flex-wrap items-center justify-center gap-8">
              {Array.from({ length: nftsPerPage }).map((_, i) => (
                <div
                  className="!h-60 !w-60 animate-pulse rounded-lg bg-gray-800"
                  key={i}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {collectionNFTs.map((nft, index) => (
                <NFTComponent key={index} nft={nft} tokenId={nft.id} owner={nft.owner} />
              ))}
            </div>
          )}
        </div>

        {totalNFTCount > nftsPerPage && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({
              length: Math.ceil(totalNFTCount / nftsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg ${
                  index + 1 === page ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionPage;

type NFTComponentProps = {
  nft: NFT;
  tokenId: bigint;
  owner: string | null;
};

function NFTComponent({ nft, tokenId, owner }: NFTComponentProps) {
  const [nftData, setNFTData] = useState<NFT | null>(nft);

  useEffect(() => {
    if (nftData?.id !== tokenId) {
      getNFT({
        contract: NFT_COLLECTION,
        tokenId: tokenId,
      }).then((fetchedNft: NFT) => setNFTData(fetchedNft));
    }
  }, [tokenId, nftData?.id]);

  if (!nftData) {
    return <LoadingNFTComponent />;
  }

  const truncatedOwner = owner
    ? `${owner.slice(0, 6)}...${owner.slice(-4)}`
    : "Not Claimed";

  return (
    <div className="transition-all hover:scale-105 hover:shadow-lg flex flex-col w-[308px] h-[469px] bg-[#5591DA] justify-stretch border border-4 overflow-hidden border-black rounded-[35px]">
      <div className="relative w-full h-fit bg-[#5591DA]">
        {nftData.metadata.image && (
          <MediaRenderer
            src={nftData.metadata.image}
            client={client}
            className="p-4 w-[268px] h-[253px] object-center object-top"
          />
        )}
        <div className="flex items-center justify-between flex-1 w-full px-3 bg-[#5591DA]">
          <div className="flex flex-col justify-center py-3">
            <p className="max-w-full overflow-hidden text-lg text-white text-ellipsis whitespace-nowrap">
              {nftData.metadata.name}
            </p>
            <p className="text-sm font-semibold text-white/60">
              #{nftData.id.toString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 mb-2">
        <p
          className={`inline-block px-4 py-2 rounded-2xl text-md font-semibold border-2 ${
            owner ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {owner ? `Owner: ${truncatedOwner}` : "Not Claimed"}
        </p>
      </div>
    </div>
  );
}

function LoadingNFTComponent() {
  return (
    <div className="w-full h-[350px] rounded-lg bg-gray-800 animate-pulse"></div>
  );
}
