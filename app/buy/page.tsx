export const dynamic = "force-dynamic";
export const revalidate = 0;
import React, { Suspense } from "react";
import { NFTGridLoading } from "@/components/NFT/NFTGrid";
import ListingGrid from "@/components/ListingGrid/ListingGrid";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";

export default function Buy() {
	return (
		<div className="p-12">
			<h1 className="text-4xl">Buy NFTs</h1>

			<div className="my-8 text-black">
				<Suspense fallback={<NFTGridLoading />}>
					<ListingGrid
						marketplace={MARKETPLACE}
						collection={NFT_COLLECTION}
						emptyText={
							"Looks like there are no listed NFTs in this collection."
						}
					/>
				</Suspense>
			</div>
		</div>
	);
}
