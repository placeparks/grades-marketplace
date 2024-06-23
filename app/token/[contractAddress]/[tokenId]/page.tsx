export const dynamic = "force-dynamic";
export const revalidate = 0;
import React from "react";
import { MediaRenderer } from "thirdweb/react";
import {
	getAllValidListings,
	getAllValidAuctions,
} from "thirdweb/extensions/marketplace";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";
import randomColor from "@/util/randomColor";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import BuyListingButton from "@/components/token/BuyListingButton";
import Events from "@/components/token/Events";

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default async function TokenPage({
	params,
}: {
	params: { contractAddress: string; tokenId: string };
}) {
	const listingsPromise = getAllValidListings({
		contract: MARKETPLACE,
	});
	const auctionsPromise = getAllValidAuctions({
		contract: MARKETPLACE,
	});
	const nftPromise = getNFT({
		contract: NFT_COLLECTION,
		tokenId: BigInt(params.tokenId),
		includeOwner: true,
	});

	const [listings, auctions, nft] = await Promise.all([
		listingsPromise,
		auctionsPromise,
		nftPromise,
	]);

	const directListing = listings?.find(
		(l) =>
			l.assetContractAddress === params.contractAddress &&
			l.tokenId === BigInt(params.tokenId)
	);



	return (
		<div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-10 mt-32 gap-16">
		  <div className="flex flex-col lg:w-1/2">
			<MediaRenderer
			  src={nft.metadata.image}
			  client={client}
			  className="rounded-lg w-full bg-white/[.04]"
			/>
			<div className="flex flex-col my-4">
			  <h1 className="text-3xl font-semibold break-words hyphens-auto">
				{nft.metadata.name}
			  </h1>
			  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
				#{nft.id.toString()}
			  </p>
			</div>
			<div className="flex items-center gap-4 transition-all cursor-pointer hover:opacity-80">
			  <div
				className="w-12 h-12 overflow-hidden border-2 rounded-full opacity-90 border-black/20"
				style={{
				  background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
				}}
			  />
			  {nft.owner && (
				<div className="flex flex-col">
				  <p className="text-black/60">Current Owner</p>
				  <p className="font-medium text-black">
					{nft.owner.slice(0, 8)}...
					{nft.owner.slice(-4)}
				  </p>
				</div>
			  )}
			</div>
			<div className="mt-6 bg-white/[.04] p-4 rounded-lg">
			  <p className="mb-1 text-black">Price</p>
			  <div className="text-lg font-medium rounded-md text-black">
				{directListing ? (
				  <>
					{
					  directListing?.currencyValuePerToken
						.displayValue
					}
					{" " +
					  directListing?.currencyValuePerToken
						.symbol}
				  </>
				
				) : (
				  "Not for sale"
				)}
			  </div>
			
			  <div className="mt-4">
				<BuyListingButton
				  directListing={directListing}
				/>
			  </div>
			</div>
		  </div>
	
		  <div className="lg:w-1/2">
			<div className="px-4 text-black">
			  <h3 className="text-2xl font-semibold">History</h3>
			  <Events tokenId={nft.id} />
			</div>
		  </div>
		</div>
	  );
	}
