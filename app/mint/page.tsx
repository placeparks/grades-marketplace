'use client';

import React from 'react';
import { claimTo } from 'thirdweb/extensions/erc721';
import { TransactionButton, useActiveAccount } from 'thirdweb/react';
import { NFT_COLLECTION } from "@/const/contracts";

const Mint = () => {
    const account = useActiveAccount();

    return (
        <div className='p-12'>
            <h2>Claim NFT</h2>
            <TransactionButton
                transaction={() => (
                    claimTo({
                        contract: NFT_COLLECTION,
                        to: account?.address || "",
                        quantity: BigInt(1)
                    })
                )}
                onTransactionConfirmed={async () => {
                    alert("NFT claimed!");
                }}
            >
                Claim NFT
            </TransactionButton>
        </div>
    );
};

export default Mint;
