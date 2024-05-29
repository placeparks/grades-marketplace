import React, { useEffect, useState } from 'react';
import { getContract } from 'thirdweb';
import { MARKETPLACE_ADDRESS, NETWORK } from '@/const/contracts';
import client from '@/lib/client';

interface Offer {
  id: string;
  price: string;
  quantity: number;
  creator: string;
  [key: string]: any;
}

const MarketplaceComponent: React.FC = () => {
  const marketplace = getContract({
    address: MARKETPLACE_ADDRESS,
    client,
    chain: NETWORK,
  });

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!marketplace) return;
      try {
        const startId = 0;
        const endId = 100;
        const offersData = await marketplace.call("getAllOffers", [startId, endId]);
        setOffers(offersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [marketplace]);

  if (loading) return <div>Loading offers...</div>;
  if (error) return <div>Error fetching offers: {error}</div>;

  return (
    <div>
      <h1>Marketplace Offers</h1>
      {offers.length > 0 ? (
        offers.map((offer, index) => (
          <div key={index}>
            <p>Offer ID: {offer.id}</p>
            <p>Price: {offer.price}</p>
            <p>Quantity: {offer.quantity}</p>
            <p>Creator: {offer.creator}</p>
            {/* Add more offer details as needed */}
          </div>
        ))
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

export default MarketplaceComponent;
