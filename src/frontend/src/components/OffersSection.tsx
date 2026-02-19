import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import OfferCard from './OfferCard';
import type { PromotionalOffer } from '@/backend';

interface OffersSectionProps {
  offers: PromotionalOffer[];
  isLoading?: boolean;
  bestOfferId?: bigint;
  selectedOfferId?: bigint;
  onSelectOffer?: (offerId: bigint) => void;
  rechargeAmount?: number;
}

export default function OffersSection({
  offers,
  isLoading,
  bestOfferId,
  selectedOfferId,
  onSelectOffer,
  rechargeAmount,
}: OffersSectionProps) {
  const calculateSavings = (offer: PromotionalOffer): number => {
    if (!rechargeAmount) return 0;

    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = (rechargeAmount * Number(offer.discountValue)) / 100;
    } else {
      discount = Number(offer.discountValue);
    }

    if (offer.maxDiscountCap) {
      discount = Math.min(discount, Number(offer.maxDiscountCap));
    }

    return Math.floor(discount);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Available Offers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">No Offers Available</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No promotional offers are currently available for your selected operator and amount.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Available Offers</h3>
        <span className="text-sm text-muted-foreground">
          ({offers.length} {offers.length === 1 ? 'offer' : 'offers'})
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {offers.map((offer) => (
          <OfferCard
            key={Number(offer.offerId)}
            offer={offer}
            estimatedSavings={calculateSavings(offer)}
            isBestOffer={offer.offerId === bestOfferId}
            isSelected={offer.offerId === selectedOfferId}
            onClick={() => onSelectOffer?.(offer.offerId)}
          />
        ))}
      </div>
    </div>
  );
}
