import { NFT as NFTType } from "thirdweb";
import React, { useState } from "react";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { ADDRESS_ZERO } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";
import DirectListingButton from "./DirectListingButton";
import cn from "classnames";
import ApprovalButton from "./ApproveButton";

type Props = {
	nft: NFTType;
};

const INPUT_STYLES =
	"block w-full py-3 px-4 mb-4 bg-transparent border border-black text-base box-shadow-md rounded-lg mb-4";
const LEGEND_STYLES = "mb-2 text-black/80";
export default function SaleInfo({ nft }: Props) {
  const account = useActiveAccount();
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  const { data: hasApproval } = useReadContract(isApprovedForAll, {
    contract: NFT_COLLECTION,
    owner: account?.address || ADDRESS_ZERO,
    operator: MARKETPLACE.address,
  });

  const [directListingState, setDirectListingState] = useState({
    price: "0",
  });


  return (
    <>
      <div className="w-full md:w-5/6">
        <div className="flex justify-start w-full mb-6 border-b border-black/60">
          <h3
            className={cn(
              "px-4 h-12 flex items-center justify-center text-base font-semibold cursor-pointer transition-all hover:text-blue/80",
              tab === "direct" &&
								"text-[#0294fe] border-b-2 border-[#5591DA]"
            )}
            onClick={() => setTab("direct")}
          >
						Direct
          </h3>
   
        </div>

        {/* Direct listing fields */}
        <div
          className={cn(
            tab === "direct" ? "flex" : "hidden",
            "flex-col"
          )}
        >
          {/* Input field for buyout price */}
          <legend className={cn(LEGEND_STYLES)}>
            {" "}
						Price per token
          </legend>
          <input
            className={cn(INPUT_STYLES)}
            type="number"
            step={0.000001}
            value={directListingState.price}
            onChange={(e) =>
              setDirectListingState({ price: e.target.value })
            }
          />
          {!hasApproval ? (
            <ApprovalButton />
          ) : (
            <DirectListingButton
              nft={nft}
              pricePerToken={directListingState.price}
            />
          )}
        </div>
        
      </div>
    </>
  );
}
