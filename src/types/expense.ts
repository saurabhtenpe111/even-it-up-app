
export interface Person {
  id: string;
  name: string;
}

export interface Split {
  personId: string;
  amount: number;
  percentage?: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  paidBy: string; // personId
  splits: Split[];
}

export interface Balance {
  from: string; // personId
  to: string; // personId
  amount: number;
}

export interface Settlement {
  from: Person;
  to: Person;
  amount: number;
}
