'use client';

import React from 'react';
import { claimTo } from 'thirdweb/extensions/erc721';
import { TransactionButton, useActiveAccount } from 'thirdweb/react';
import { NFT_COLLECTION } from "@/const/contracts";

const Mint = () => {
    const account = useActiveAccount();

    return (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center pb-10">
              <img
                src="/pic.png"
                className="w-24 h-24 mb-3 mt-4 rounded-full shadow-lg"
                alt="NFT Image"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                Grades NFT
              </h5>
              <div className="flex mt-4 md:mt-6">
                <TransactionButton
                  transaction={() =>
                    claimTo({
                      contract: NFT_COLLECTION,
                      to: account?.address || "",
                      quantity: BigInt(1),
                    })
                  }
                  onTransactionConfirmed={async () => {
                    alert("NFT claimed!");
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                >
                  Claim NFT
                </TransactionButton>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Mint;
