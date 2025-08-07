import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConnectedAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  status: 'connected' | 'pending' | 'error';
}

export function ConnectBankAccount() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      bankName: 'Demo Bank',
      accountType: 'checking',
      accountNumber: '****1234',
      balance: 2500.00,
      status: 'connected'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectAccount = async (formData: FormData) => {
    setIsConnecting(true);
    
    // Simulate bank connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAccount: ConnectedAccount = {
      id: Date.now().toString(),
      bankName: formData.get('bankName') as string,
      accountType: formData.get('accountType') as string,
      accountNumber: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      balance: Math.floor(Math.random() * 10000) + 1000,
      status: Math.random() > 0.2 ? 'connected' : 'error'
    };

    setAccounts(prev => [...prev, newAccount]);
    setIsConnecting(false);
    setShowAddForm(false);

    if (newAccount.status === 'connected') {
      toast({
        title: "Account Connected!",
        description: `Successfully connected your ${newAccount.bankName} ${newAccount.accountType} account.`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to your bank account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage your bank account connections for automatic transaction tracking
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
              <Plus className="h-4 w-4 mr-2" />
              Connect Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {accounts.length > 0 ? (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.accountType} • {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-medium">${account.balance.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(account.status)}
                        <Badge variant={getStatusColor(account.status)}>
                          {account.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No bank accounts connected. Connect your first account to start tracking transactions automatically.
            </p>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Connect New Account</CardTitle>
            <CardDescription>
              Add a new bank account to track transactions and round-ups automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConnectAccount(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    placeholder="e.g., Chase, Bank of America"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select name="accountType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isConnecting}>
                  {isConnecting ? (
                    <>Connecting...</>
                  ) : (
                    'Connect Account'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>🔒 Your banking information is encrypted and secure.</p>
                <p>We use bank-level security to protect your data.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}