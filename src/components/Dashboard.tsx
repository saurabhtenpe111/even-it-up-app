
import React from 'react';
import Header from './Header';
import AddPersonForm from './AddPersonForm';
import PeopleList from './PeopleList';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import BalanceSummary from './BalanceSummary';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-3 space-y-6">
            <AddPersonForm />
            <PeopleList />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-6 space-y-6">
            <AddExpenseForm />
            <ExpenseList />
          </div>
          
          {/* Right Sidebar */}
          <div className="md:col-span-3 space-y-6">
            <BalanceSummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
