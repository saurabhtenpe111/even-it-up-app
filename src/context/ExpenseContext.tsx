
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Person, Balance, Split, Settlement } from '@/types/expense';
import { toast } from '@/components/ui/use-toast';

interface ExpenseContextType {
  expenses: Expense[];
  people: Person[];
  balances: Balance[];
  settlements: Settlement[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  removeExpense: (id: string) => void;
  calculateBalances: () => void;
  generateSettlements: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      try {
        // Convert date strings back to Date objects
        const parsed = JSON.parse(saved);
        return parsed.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
      } catch (e) {
        console.error('Failed to parse expenses from localStorage', e);
        return [];
      }
    }
    return [];
  });
  
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem('people');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'You' },
      { id: '2', name: 'Friend 1' },
      { id: '3', name: 'Friend 2' }
    ];
  });
  
  const [balances, setBalances] = useState<Balance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  // Save to localStorage whenever expenses or people change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  // Calculate balances whenever expenses or people change
  useEffect(() => {
    calculateBalances();
  }, [expenses, people]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9)
    };
    setExpenses([...expenses, newExpense]);
    toast({
      title: "Expense added",
      description: `${newExpense.description} - $${newExpense.amount.toFixed(2)}`
    });
  };

  const addPerson = (name: string) => {
    if (!name.trim()) return;
    
    // Check if person already exists
    if (people.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Person already exists",
        description: `${name} is already in your group`,
        variant: "destructive"
      });
      return;
    }
    
    const newPerson: Person = {
      id: Math.random().toString(36).substring(2, 9),
      name
    };
    setPeople([...people, newPerson]);
    toast({
      title: "Person added",
      description: `${name} was added to your group`
    });
  };

  const removePerson = (id: string) => {
    // Check if person is involved in any expenses
    const isInvolved = expenses.some(expense => 
      expense.paidBy === id || expense.splits.some(split => split.personId === id)
    );
    
    if (isInvolved) {
      toast({
        title: "Cannot remove person",
        description: "This person is involved in one or more expenses",
        variant: "destructive"
      });
      return;
    }
    
    setPeople(people.filter(person => person.id !== id));
    toast({
      title: "Person removed",
      description: `${people.find(p => p.id === id)?.name} was removed from your group`
    });
  };

  const removeExpense = (id: string) => {
    const expenseToRemove = expenses.find(e => e.id === id);
    if (!expenseToRemove) return;
    
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Expense removed",
      description: `${expenseToRemove.description} was removed`
    });
  };

  const calculateBalances = () => {
    // Initialize a matrix to track who owes whom
    const balanceMatrix: Record<string, Record<string, number>> = {};
    
    // Initialize the matrix with zero balances
    people.forEach(p1 => {
      balanceMatrix[p1.id] = {};
      people.forEach(p2 => {
        if (p1.id !== p2.id) {
          balanceMatrix[p1.id][p2.id] = 0;
        }
      });
    });

    // Calculate the raw balances from all expenses
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      
      expense.splits.forEach(split => {
        if (split.personId !== paidBy) {
          // The person who paid the expense is owed money by the split person
          balanceMatrix[split.personId][paidBy] += split.amount;
        }
      });
    });

    // Simplify the balances (net amounts)
    const simplifiedBalances: Balance[] = [];
    
    people.forEach(p1 => {
      people.forEach(p2 => {
        if (p1.id !== p2.id) {
          const p1OwesP2 = balanceMatrix[p1.id][p2.id] || 0;
          const p2OwesP1 = balanceMatrix[p2.id][p1.id] || 0;
          
          // Calculate the net amount
          const netAmount = p1OwesP2 - p2OwesP1;
          
          if (netAmount > 0) {
            // p1 owes p2 (net)
            simplifiedBalances.push({
              from: p1.id,
              to: p2.id,
              amount: netAmount
            });
          }
        }
      });
    });

    setBalances(simplifiedBalances);
    generateSettlements();
  };

  const generateSettlements = () => {
    // Deep copy of balances to work with
    const workingBalances = [...balances].map(b => ({ ...b }));
    const result: Settlement[] = [];

    while (workingBalances.length > 0) {
      // Sort balances by amount (highest first)
      workingBalances.sort((a, b) => b.amount - a.amount);
      
      // Get the highest debt
      const highestDebt = workingBalances[0];
      
      // Find if there's a direct counter-balance
      const counterBalanceIndex = workingBalances.findIndex(
        b => b.from === highestDebt.to && b.to === highestDebt.from
      );
      
      if (counterBalanceIndex > 0) {
        // If there's a counter-balance, settle the smaller one
        const counterBalance = workingBalances[counterBalanceIndex];
        const minAmount = Math.min(highestDebt.amount, counterBalance.amount);
        
        // Add settlement
        result.push({
          from: people.find(p => p.id === counterBalance.from)!,
          to: people.find(p => p.id === counterBalance.to)!,
          amount: minAmount
        });
        
        // Update balances
        highestDebt.amount -= minAmount;
        counterBalance.amount -= minAmount;
        
        // Remove settled balances
        if (highestDebt.amount <= 0) {
          workingBalances.splice(0, 1);
        }
        if (counterBalance.amount <= 0) {
          workingBalances.splice(counterBalanceIndex > 0 ? counterBalanceIndex - 1 : counterBalanceIndex, 1);
        }
      } else {
        // If there's no counter-balance, just add the settlement
        result.push({
          from: people.find(p => p.id === highestDebt.from)!,
          to: people.find(p => p.id === highestDebt.to)!,
          amount: highestDebt.amount
        });
        
        // Remove this balance
        workingBalances.splice(0, 1);
      }
    }

    setSettlements(result);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        people,
        balances,
        settlements,
        addExpense,
        addPerson,
        removePerson,
        removeExpense,
        calculateBalances,
        generateSettlements
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
