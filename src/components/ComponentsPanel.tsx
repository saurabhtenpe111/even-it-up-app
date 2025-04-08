
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { CreateComponentDrawer } from './CreateComponentDrawer';

// Define interface for component
interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
  fields: number;
}

// Define interface for ComponentsPanel props
interface ComponentsPanelProps {
  collections?: any[];
  // Add missing props that are being passed to the component
  onCreateField?: (collectionId: string, fieldData: any) => Promise<any>;
  onUpdateField?: (collectionId: string, fieldId: string, fieldData: any) => Promise<any>;
  isUpdating?: boolean;
}

// Mock components data
const mockComponents = [
  {
    id: "1",
    name: "Contact Form",
    description: "Standard contact form with name, email, and message",
    category: "form",
    lastUpdated: "Apr 2, 2025",
    fields: 3
  },
  {
    id: "2",
    name: "Product Card",
    description: "Display product with image, title, price, and description",
    category: "commerce",
    lastUpdated: "Mar 31, 2025",
    fields: 4
  },
  {
    id: "3",
    name: "User Profile",
    description: "User profile display with avatar, name, bio, and stats",
    category: "profile",
    lastUpdated: "Mar 28, 2025",
    fields: 5
  },
  {
    id: "4",
    name: "Newsletter Signup",
    description: "Email capture form with GDPR consent checkbox",
    category: "marketing",
    lastUpdated: "Mar 25, 2025",
    fields: 2
  }
];

export const ComponentsPanel: React.FC<ComponentsPanelProps> = ({ 
  collections,
  onCreateField,
  onUpdateField,
  isUpdating 
}) => {
  const navigate = useNavigate();
  const [components] = useState(mockComponents);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const filteredComponents = components.filter(component => {
    return component.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           component.category.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleComponentClick = (componentId: string) => {
    navigate(`/components/${componentId}`);
  };
  
  // If collections are provided, we could use them here
  // This is just to show we're handling the collections prop
  console.log("Collections received:", collections);
  
  // If onCreateField is provided, we could use it here when creating a component
  console.log("onCreateField provided:", !!onCreateField);
  console.log("onUpdateField provided:", !!onUpdateField);
  console.log("isUpdating status:", isUpdating);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Components</h1>
          <p className="text-muted-foreground mt-1">Create and manage reusable components</p>
        </div>
        
        <Button 
          variant="default"
          className="gap-2"
          onClick={() => setDrawerOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Create Component
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search components..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <div className="border rounded-md flex">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === 'grid' ? 'bg-gray-100' : ''}`}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === 'list' ? 'bg-gray-100' : ''}`}
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {filteredComponents.length > 0 ? (
        <div className={`grid gap-4 ${view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredComponents.map((component) => (
            <Card 
              key={component.id} 
              className={`border cursor-pointer hover:shadow-md transition-shadow overflow-hidden hover:border-gray-300`}
              onClick={() => handleComponentClick(component.id)}
            >
              <CardHeader className={`${view === 'grid' ? '' : 'pb-3'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {component.name}
                      <Badge variant="outline" className="capitalize">
                        {component.category}
                      </Badge>
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-1">
                  {component.description}
                </CardDescription>
              </CardHeader>
              
              {view === 'grid' && (
                <CardContent>
                  {/* Component Preview would go here */}
                  <div className="h-32 bg-gray-50 border rounded-md flex items-center justify-center text-gray-400">
                    Component Preview
                  </div>
                </CardContent>
              )}
              
              <CardFooter className={`flex justify-between text-sm text-gray-500 border-t ${view === 'grid' ? 'mt-2' : 'mt-0'}`}>
                <span>Last updated: {component.lastUpdated}</span>
                <span>{component.fields} fields</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg">No components found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or create a new component</p>
          <Button 
            variant="default" 
            className="mt-4 gap-2"
            onClick={() => setDrawerOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Create Component
          </Button>
        </div>
      )}
      
      {/* Create Component Drawer */}
      <CreateComponentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSave={(data) => {
          console.log("Component created:", data);
          setDrawerOpen(false);
          
          // If onCreateField is provided, use it to create a field for this component
          if (onCreateField && collections && collections.length > 0) {
            // This is just an example of how you might use onCreateField
            // You'd need to adapt this based on the actual structure of your data
            const defaultCollectionId = collections[0].id;
            console.log("Could create field in collection:", defaultCollectionId);
          }
        }}
      />
    </div>
  );
}
