
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Trash2, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const PeopleList = () => {
  const { people, removePerson } = useExpense();

  return (
    <div className="rounded-lg border bg-card shadow-sm p-4">
      <div className="flex items-center mb-4 space-x-2">
        <Users className="h-5 w-5 text-teal-500" />
        <h3 className="text-lg font-medium">People</h3>
      </div>
      
      {people.length === 0 ? (
        <p className="text-muted-foreground text-center py-2">No people added yet</p>
      ) : (
        <ScrollArea className="h-[200px]">
          <ul className="space-y-2">
            {people.map((person) => (
              <li key={person.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <span>{person.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePerson(person.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
};

export default PeopleList;
