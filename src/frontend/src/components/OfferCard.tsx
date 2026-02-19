import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Tag, Calendar } from 'lucide-react';
import type { PromotionalOffer } from '@/backend';

interface OfferCardProps {
  offer: PromotionalOffer;
  estimatedSavings?: number;
  isBestOffer?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function OfferCard({
  offer,
  estimatedSavings,
  isBestOffer,
  isSelected,
  onClick,
}: OfferCardProps) {
  const formatDate = (timestamp: bigint) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'short',
    }).format(new Date(Number(timestamp) / 1000000));
  };

  const getDiscountDisplay = () => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else {
      return `₹${offer.discountValue} Cashback`;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary border-2 bg-primary/5'
          : isBestOffer
          ? 'border-primary/50 border-2'
          : ''
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {offer.title}
          </CardTitle>
          {isSelected && (
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
          )}
        </div>
        {isBestOffer && !isSelected && (
          <Badge className="w-fit mt-1 bg-primary/90">Best Deal</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold text-primary">
            {getDiscountDisplay()}
          </span>
        </div>

        {estimatedSavings !== undefined && estimatedSavings > 0 && (
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-sm text-muted-foreground">You save</p>
            <p className="text-lg font-bold text-primary">₹{estimatedSavings}</p>
          </div>
        )}

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{offer.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {offer.applicableOperators.map((op) => (
              <Badge key={op} variant="outline" className="text-xs">
                {op}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Calendar className="h-3 w-3" />
            <span>Valid till {formatDate(offer.validityEnd)}</span>
          </div>
          <p className="text-xs">Min. recharge: ₹{Number(offer.minRechargeAmount)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
