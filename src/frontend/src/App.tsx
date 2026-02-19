import { useState } from 'react';
import { Smartphone, History, CheckCircle2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RechargeForm from '@/components/RechargeForm';
import TransactionHistory from '@/components/TransactionHistory';
import ConfirmationView from '@/components/ConfirmationView';
import type { AppliedOffer } from '@/backend';

export interface Transaction {
  id: string;
  mobileNumber: string;
  operator: string;
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  appliedOffer?: AppliedOffer;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<string>('recharge');

  const handleRechargeSubmit = (
    mobileNumber: string,
    operator: string,
    amount: number,
    appliedOffer?: AppliedOffer
  ) => {
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      mobileNumber,
      operator,
      amount,
      timestamp: new Date(),
      status: 'completed',
      appliedOffer,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setCurrentTransaction(newTransaction);
    setActiveTab('confirmation');
  };

  const handleNewRecharge = () => {
    setCurrentTransaction(null);
    setActiveTab('recharge');
  };

  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'a2z-recharge'
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/a2z-logo.dim_400x120.png"
                alt="A2Z Recharge"
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Quick & Easy Recharge</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome to A2Z Recharge
            </h1>
            <p className="text-muted-foreground text-lg">
              Recharge your mobile instantly with just a few clicks
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="recharge" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="hidden sm:inline">Recharge</span>
                  </TabsTrigger>
                  <TabsTrigger value="confirmation" className="gap-2" disabled={!currentTransaction}>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Confirmation</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recharge" className="mt-0">
                  <RechargeForm onSubmit={handleRechargeSubmit} />
                </TabsContent>

                <TabsContent value="confirmation" className="mt-0">
                  {currentTransaction && (
                    <ConfirmationView
                      transaction={currentTransaction}
                      appliedOffer={currentTransaction.appliedOffer}
                      onNewRecharge={handleNewRecharge}
                    />
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <TransactionHistory transactions={transactions} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Instant Recharge</CardTitle>
                <CardDescription>Process in seconds</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Secure Transactions</CardTitle>
                <CardDescription>Your data is safe</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">24/7 Available</CardTitle>
                <CardDescription>Recharge anytime</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              © {currentYear} A2Z Recharge. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
