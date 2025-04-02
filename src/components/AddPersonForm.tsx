
import React, { useState } from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users } from 'lucide-react';

const AddPersonForm = () => {
  const [name, setName] = useState('');
  const { addPerson } = useExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addPerson(name.trim());
      setName('');
    }
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm p-4">
      <div className="flex items-center mb-4 space-x-2">
        <Users className="h-5 w-5 text-teal-500" />
        <h3 className="text-lg font-medium">Add New Person</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="flex-1"
        />
        <Button type="submit" size="sm" className="bg-teal-400 hover:bg-teal-500">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddPersonForm;
