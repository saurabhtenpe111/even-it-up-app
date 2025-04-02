
import React, { useState, useEffect } from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, Split } from '@/types/expense';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const splitTypes = ['Equal', 'Amount', 'Percentage'] as const;
type SplitType = typeof splitTypes[number];

const AddExpenseForm = () => {
  const { people, addExpense } = useExpense();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('Equal');
  const [splits, setSplits] = useState<Split[]>([]);

  // Set default paidBy if not set and people are available
  useEffect(() => {
    if (people.length > 0 && !paidBy) {
      setPaidBy(people[0].id);
    }
  }, [people, paidBy]);

  // Reset splits when splitType changes or when people change
  useEffect(() => {
    if (people.length > 0) {
      if (splitType === 'Equal') {
        // Equal split
        const equalAmount = amount ? parseFloat(amount) / people.length : 0;
        const newSplits: Split[] = people.map(person => ({
          personId: person.id,
          amount: parseFloat(equalAmount.toFixed(2)),
        }));
        setSplits(newSplits);
      } else {
        // For other split types, initialize with zero values
        const newSplits: Split[] = people.map(person => ({
          personId: person.id,
          amount: 0,
          percentage: splitType === 'Percentage' ? 0 : undefined,
        }));
        setSplits(newSplits);
      }
    }
  }, [people, splitType, amount]);

  const updateSplitAmount = (personId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (splitType === 'Amount') {
      setSplits(splits.map(split => 
        split.personId === personId ? { ...split, amount: numValue } : split
      ));
    } else if (splitType === 'Percentage') {
      const totalAmount = parseFloat(amount) || 0;
      const newAmount = (numValue / 100) * totalAmount;
      
      setSplits(splits.map(split => 
        split.personId === personId 
          ? { ...split, percentage: numValue, amount: parseFloat(newAmount.toFixed(2)) } 
          : split
      ));
    }
  };

  const getTotalSplitAmount = (): number => {
    return parseFloat(splits.reduce((sum, split) => sum + split.amount, 0).toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !paidBy || parseFloat(amount) <= 0) {
      return;
    }

    const totalAmount = parseFloat(amount);
    const totalSplitAmount = getTotalSplitAmount();
    
    // Check if the split amounts add up to the total
    if (Math.abs(totalAmount - totalSplitAmount) > 0.01) {
      alert(`Split amounts must add up to the total (${totalAmount}). Current total: ${totalSplitAmount}`);
      return;
    }

    const newExpense: Omit<Expense, 'id'> = {
      description,
      amount: totalAmount,
      date: new Date(date),
      paidBy,
      splits,
    };

    addExpense(newExpense);
    
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaidBy(people[0]?.id || '');
    setSplitType('Equal');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-teal-500" />
          <span>Add New Expense</span>
        </CardTitle>
        <CardDescription>
          Enter expense details and how to split it
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Dinner, Movie tickets, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid by</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-2">
            <Label>Split Type</Label>
            <Tabs value={splitType} onValueChange={(value) => setSplitType(value as SplitType)} className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                {splitTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="Equal" className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Split equally among all {people.length} people: 
                  ${amount ? (parseFloat(amount) / people.length).toFixed(2) : '0.00'} each
                </p>
              </TabsContent>
              
              <TabsContent value="Amount" className="pt-4">
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {splits.map((split, index) => {
                      const person = people.find(p => p.id === split.personId);
                      return (
                        <div key={split.personId} className="flex items-center space-x-2">
                          <Label htmlFor={`amount-${index}`} className="w-1/3">
                            {person?.name}
                          </Label>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id={`amount-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={split.amount || ''}
                              onChange={(e) => updateSplitAmount(split.personId, e.target.value)}
                              className="pl-7"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="mt-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total amount:</span>
                    <span>${amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Split total:</span>
                    <span 
                      className={parseFloat(amount || '0') !== getTotalSplitAmount() ? 'text-red-500' : ''}
                    >
                      ${getTotalSplitAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="Percentage" className="pt-4">
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {splits.map((split, index) => {
                      const person = people.find(p => p.id === split.personId);
                      return (
                        <div key={split.personId} className="flex items-center space-x-2">
                          <Label htmlFor={`percentage-${index}`} className="w-1/3">
                            {person?.name}
                          </Label>
                          <div className="relative flex-1">
                            <Input
                              id={`percentage-${index}`}
                              type="number"
                              step="1"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={split.percentage || ''}
                              onChange={(e) => updateSplitAmount(split.personId, e.target.value)}
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                          </div>
                          <span className="w-20 text-right text-sm">
                            ${split.amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="mt-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total amount:</span>
                    <span>${amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total percentage:</span>
                    <span 
                      className={
                        splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 100 
                          ? 'text-red-500' 
                          : ''
                      }
                    >
                      {splits.reduce((sum, split) => sum + (split.percentage || 0), 0)}%
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Split total:</span>
                    <span 
                      className={parseFloat(amount || '0') !== getTotalSplitAmount() ? 'text-red-500' : ''}
                    >
                      ${getTotalSplitAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDescription('');
              setAmount('');
              setDate(new Date().toISOString().split('T')[0]);
              setPaidBy(people[0]?.id || '');
              setSplitType('Equal');
            }}
          >
            Clear
          </Button>
          <Button type="submit" className="bg-teal-400 hover:bg-teal-500">
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddExpenseForm;
