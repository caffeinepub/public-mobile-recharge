import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Zap } from 'lucide-react';
import OffersSection from './OffersSection';
import { useAvailableOffers, useApplyOffer } from '@/hooks/useQueries';
import type { AppliedOffer } from '@/backend';

interface RechargeFormProps {
  onSubmit: (mobileNumber: string, operator: string, amount: number, appliedOffer?: AppliedOffer) => void;
}

const operators = [
  'Airtel',
  'Jio',
  'Vi (Vodafone Idea)',
  'BSNL',
  'Aircel',
  'Reliance',
  'Tata Docomo',
];

const amounts = [10, 20, 50, 100, 200, 500];

export default function RechargeForm({ onSubmit }: RechargeFormProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<bigint | undefined>();
  const [errors, setErrors] = useState<{ mobile?: string; operator?: string; amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: offers = [], isLoading: offersLoading } = useAvailableOffers(
    operator || null,
    amount
  );
  const applyOfferMutation = useApplyOffer();

  // Determine best offer (highest discount value)
  const bestOfferId = offers.length > 0 ? offers[0].offerId : undefined;

  // Reset selected offer when operator or amount changes
  useEffect(() => {
    setSelectedOfferId(undefined);
  }, [operator, amount]);

  const validateMobileNumber = (number: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { mobile?: string; operator?: string; amount?: string } = {};

    if (!validateMobileNumber(mobileNumber)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!operator) {
      newErrors.operator = 'Please select an operator';
    }

    if (!amount) {
      newErrors.amount = 'Please select a recharge amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      let appliedOffer: AppliedOffer | undefined;

      // Apply offer if one is selected
      if (selectedOfferId && amount) {
        const result = await applyOfferMutation.mutateAsync({
          offerId: selectedOfferId,
          rechargeAmount: amount,
        });
        if (result) {
          appliedOffer = result;
        }
      }

      // Simulate processing delay
      setTimeout(() => {
        onSubmit(mobileNumber, operator, amount!, appliedOffer);
        setIsSubmitting(false);
        
        // Reset form
        setMobileNumber('');
        setOperator('');
        setAmount(null);
        setSelectedOfferId(undefined);
        setErrors({});
      }, 800);
    } catch (error) {
      console.error('Error applying offer:', error);
      setIsSubmitting(false);
      // Continue with recharge even if offer application fails
      setTimeout(() => {
        onSubmit(mobileNumber, operator, amount!);
        setIsSubmitting(false);
        
        // Reset form
        setMobileNumber('');
        setOperator('');
        setAmount(null);
        setSelectedOfferId(undefined);
        setErrors({});
      }, 800);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-base font-medium">
            Mobile Number
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobileNumber}
              onChange={handleMobileChange}
              className={`pl-10 h-12 text-lg ${errors.mobile ? 'border-destructive' : ''}`}
              maxLength={10}
            />
          </div>
          {errors.mobile && (
            <p className="text-sm text-destructive">{errors.mobile}</p>
          )}
        </div>

        {/* Operator Selection */}
        <div className="space-y-2">
          <Label htmlFor="operator" className="text-base font-medium">
            Select Operator
          </Label>
          <Select value={operator} onValueChange={(value) => {
            setOperator(value);
            if (errors.operator) {
              setErrors((prev) => ({ ...prev, operator: undefined }));
            }
          }}>
            <SelectTrigger id="operator" className={`h-12 ${errors.operator ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Choose your operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.operator && (
            <p className="text-sm text-destructive">{errors.operator}</p>
          )}
        </div>

        {/* Amount Selection */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Recharge Amount</Label>
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant={amount === amt ? 'default' : 'outline'}
                className="h-14 text-lg font-semibold"
                onClick={() => {
                  setAmount(amt);
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }
                }}
              >
                ₹{amt}
              </Button>
            ))}
          </div>
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount}</p>
          )}
        </div>
      </div>

      {/* Offers Section */}
      {operator && amount && (
        <OffersSection
          offers={offers}
          isLoading={offersLoading}
          bestOfferId={bestOfferId}
          selectedOfferId={selectedOfferId}
          onSelectOffer={setSelectedOfferId}
          rechargeAmount={amount}
        />
      )}

      {/* Summary Card */}
      {mobileNumber && operator && amount && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recharge Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile Number:</span>
              <span className="font-medium">{mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operator:</span>
              <span className="font-medium">{operator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">₹{amount}</span>
            </div>
            {selectedOfferId && (
              <div className="flex justify-between text-primary">
                <span className="font-medium">Offer Applied:</span>
                <span className="font-medium">✓</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-14 text-lg font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-5 w-5" />
            Recharge Now
          </>
        )}
      </Button>
    </form>
  );
}
