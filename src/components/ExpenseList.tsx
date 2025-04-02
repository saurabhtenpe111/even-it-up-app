
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExpenseList = () => {
  const { expenses, people, removeExpense } = useExpense();

  const getPersonName = (id: string) => {
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense History</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No expenses recorded yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {sortedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-3 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{expense.description}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(expense.date), 'MMM d, yyyy')} • 
                        Paid by <span className="font-medium">{getPersonName(expense.paidBy)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpense(expense.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
                    {expense.splits.map((split) => (
                      <div key={split.personId} className="flex justify-between px-2 py-1 bg-muted rounded">
                        <span>{getPersonName(split.personId)}</span>
                        <span>${split.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
