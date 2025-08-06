import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { usePortfolio } from '@/hooks/usePortfolio';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { Settings, Loader2 } from 'lucide-react';

interface AllocationData {
  stocks: number;
  bonds: number;
  etfs: number;
}

export function AllocationSettings() {
  const { mainPortfolio, fetchPortfolios } = usePortfolio();
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [allocation, setAllocation] = useState<AllocationData>(
    mainPortfolio?.allocation_strategy || { stocks: 70, bonds: 20, etfs: 10 }
  );

  const handleSliderChange = (type: keyof AllocationData, value: number[]) => {
    const newValue = value[0];
    const oldValue = allocation[type];
    const difference = newValue - oldValue;
    
    // Adjust other allocations proportionally
    const others = Object.keys(allocation).filter(k => k !== type) as (keyof AllocationData)[];
    const otherTotal = others.reduce((sum, key) => sum + allocation[key], 0);
    
    if (otherTotal > 0) {
      const newAllocation = { ...allocation, [type]: newValue };
      
      others.forEach(key => {
        const proportion = allocation[key] / otherTotal;
        newAllocation[key] = Math.max(0, allocation[key] - (difference * proportion));
      });

      // Ensure total equals 100
      const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
      if (total !== 100) {
        const adjustment = (100 - total) / others.length;
        others.forEach(key => {
          newAllocation[key] += adjustment;
        });
      }

      setAllocation(newAllocation);
    }
  };

  const handleSubmit = async () => {
    if (!mainPortfolio || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ allocation_strategy: allocation as any })
        .eq('id', mainPortfolio.id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchPortfolios();
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Allocation strategy updated successfully",
      });
    } catch (error) {
      console.error('Error updating allocation:', error);
      toast({
        title: "Error",
        description: "Failed to update allocation strategy",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = Math.round(allocation.stocks + allocation.bonds + allocation.etfs);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Investment Allocation Strategy
        </CardTitle>
        <CardDescription>
          Set how your round-up investments should be allocated across different asset types
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="stocks">Stocks</Label>
              <span className="text-sm font-medium">{Math.round(allocation.stocks)}%</span>
            </div>
            <Slider
              id="stocks"
              value={[allocation.stocks]}
              onValueChange={(value) => handleSliderChange('stocks', value)}
              max={100}
              step={1}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bonds">Bonds</Label>
              <span className="text-sm font-medium">{Math.round(allocation.bonds)}%</span>
            </div>
            <Slider
              id="bonds"
              value={[allocation.bonds]}
              onValueChange={(value) => handleSliderChange('bonds', value)}
              max={100}
              step={1}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="etfs">ETFs</Label>
              <span className="text-sm font-medium">{Math.round(allocation.etfs)}%</span>
            </div>
            <Slider
              id="etfs"
              value={[allocation.etfs]}
              onValueChange={(value) => handleSliderChange('etfs', value)}
              max={100}
              step={1}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Allocation:</span>
            <span className={`font-bold ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {total}%
            </span>
          </div>
          {total !== 100 && (
            <p className="text-sm text-muted-foreground mt-1">
              Total must equal 100%
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Allocation
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || total !== 100}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setAllocation(mainPortfolio?.allocation_strategy || { stocks: 70, bonds: 20, etfs: 10 });
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}