import { CheckCircle2, Download, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/App';
import type { AppliedOffer } from '@/backend';

interface ConfirmationViewProps {
  transaction: Transaction;
  appliedOffer?: AppliedOffer;
  onNewRecharge: () => void;
}

export default function ConfirmationView({ transaction, appliedOffer, onNewRecharge }: ConfirmationViewProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Icon */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-primary/10 rounded-full p-6">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Recharge Successful!</h2>
          <p className="text-muted-foreground">
            Your mobile has been recharged successfully
          </p>
        </div>
      </div>

      {/* Offer Applied Banner */}
      {appliedOffer && (
        <Card className="bg-primary/5 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Offer Applied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium mb-3">{appliedOffer.offer.title}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="font-medium">₹{Number(appliedOffer.originalAmount)}</span>
              </div>
              <div className="flex justify-between text-primary">
                <span className="font-medium">Discount:</span>
                <span className="font-bold">-₹{Number(appliedOffer.discount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Final Amount:</span>
                <span className="font-bold text-lg text-primary">₹{Number(appliedOffer.finalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Details</CardTitle>
            <Badge variant={getStatusColor(transaction.status)}>
              {transaction.status.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>Transaction ID: {transaction.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mobile Number</span>
              <span className="font-medium">{transaction.mobileNumber}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Operator</span>
              <span className="font-medium">{transaction.operator}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-xl text-primary">₹{transaction.amount}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium text-sm">{formatDate(transaction.timestamp)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => window.print()}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={onNewRecharge}
        >
          New Recharge
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Success Badge Image */}
      <div className="flex justify-center pt-4">
        <img
          src="/assets/generated/success-badge.dim_96x96.png"
          alt="Success"
          className="h-20 w-20 opacity-80"
        />
      </div>
    </div>
  );
}
