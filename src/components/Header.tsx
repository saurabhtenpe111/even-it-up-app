
import React from 'react';
import { DollarSign } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-teal-400 p-2 rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Even It Up</h1>
        </div>
        <div className="text-sm text-gray-500">Split bills easily</div>
      </div>
    </header>
  );
};

export default Header;
