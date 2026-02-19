import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Smartphone } from 'lucide-react';
import type { Transaction } from '@/App';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
        <p className="text-muted-foreground">
          Your recharge history will appear here once you make your first transaction
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-1">
                      <Smartphone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-base mb-1">
                        {transaction.mobileNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.operator}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">₹{transaction.amount}</div>
                    <Badge variant={getStatusColor(transaction.status)} className="mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(transaction.timestamp)}
                  </span>
                  <span className="font-mono">{transaction.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
