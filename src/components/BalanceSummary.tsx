
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight } from 'lucide-react';

const BalanceSummary = () => {
  const { settlements, people } = useExpense();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No settlements needed</p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-background border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{settlement.from.name}</span>
                    <ArrowRight className="h-4 w-4 text-teal-500" />
                    <span className="font-medium">{settlement.to.name}</span>
                  </div>
                  <span className="text-lg font-semibold">${settlement.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceSummary;
