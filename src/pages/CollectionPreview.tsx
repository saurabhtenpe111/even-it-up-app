
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFieldsForCollection } from '@/services/CollectionService';
import { InputTextField } from '@/components/fields/inputs/InputTextField';
import { NumberInputField } from '@/components/fields/inputs/NumberInputField';
import { DateCalendarField } from '@/components/fields/inputs/DateCalendarField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function CollectionPreview() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>('form');
  
  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => getFieldsForCollection(collectionId!),
    enabled: !!collectionId
  });

  // Group fields by category for better organization
  const groupedFields = React.useMemo(() => {
    const groups: Record<string, any[]> = {
      basic: [],
      selection: [],
      relational: [],
      advanced: [],
      presentation: [],
      groups: [],
      additional: []
    };

    fields.forEach(field => {
      switch (field.type) {
        case 'text':
        case 'number':
        case 'textarea':
        case 'date':
        case 'email':
        case 'password':
        case 'url':
          groups.basic.push(field);
          break;
        case 'select':
        case 'multiselect':
        case 'boolean':
        case 'switch':
        case 'checkbox':
        case 'radio':
        case 'radio-cards':
          groups.selection.push(field);
          break;
        case 'relation':
        case 'one-to-many':
        case 'file':
        case 'image':
          groups.relational.push(field);
          break;
        case 'json':
        case 'map':
        case 'rating':
        case 'slider':
          groups.advanced.push(field);
          break;
        case 'divider':
        case 'notice':
        case 'header':
          groups.presentation.push(field);
          break;
        case 'accordion':
        case 'tab-group':
          groups.groups.push(field);
          break;
        case 'mask':
        case 'otp':
        case 'autocomplete':
        case 'seo':
          groups.additional.push(field);
          break;
        default:
          groups.basic.push(field);
      }
    });

    return groups;
  }, [fields]);

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Render basic fields
  const renderBasicField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'password':
        return (
          <InputTextField
            key={field.id}
            id={field.id}
            label={field.name}
            placeholder={field.ui_options?.placeholder || `Enter ${field.name.toLowerCase()}`}
            helpText={field.helpText}
            required={field.required}
            value={formValues[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            type={field.type === 'password' ? 'password' : 'text'}
          />
        );
      case 'number':
        return (
          <NumberInputField
            key={field.id}
            id={field.id}
            label={field.name}
            value={formValues[field.id] || 0}
            onChange={(value) => handleChange(field.id, value)}
            min={field.min}
            max={field.max}
            required={field.required}
            showButtons={field.advanced?.showButtons}
            buttonLayout={field.advanced?.buttonLayout || "horizontal"}
            prefix={field.advanced?.prefix}
            suffix={field.advanced?.suffix}
          />
        );
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              id={field.id}
              placeholder={field.ui_options?.placeholder || `Enter ${field.name.toLowerCase()}`}
              value={formValues[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );
      case 'date':
        return (
          <DateCalendarField
            key={field.id}
            id={field.id}
            label={field.name}
            value={formValues[field.id]}
            onChange={(date) => handleChange(field.id, date)}
            required={field.required}
            helpText={field.helpText}
          />
        );
      default:
        return (
          <InputTextField
            key={field.id}
            id={field.id}
            label={`${field.name} (${field.type})`}
            placeholder={`This field type (${field.type}) preview is not implemented yet`}
            disabled
          />
        );
    }
  };

  // Render selection fields
  const renderSelectionField = (field: any) => {
    switch (field.type) {
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formValues[field.id] || ''}
              onValueChange={(value) => handleChange(field.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.ui_options?.placeholder || `Select ${field.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );
      case 'multiselect':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">Option 1</span>
              <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">Option 2</span>
              <span className="bg-transparent border border-blue-300 text-gray-700 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-50">+ Add</span>
            </div>
          </div>
        );
      case 'boolean':
      case 'switch':
        return (
          <div key={field.id} className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <label htmlFor={field.id} className="block text-sm font-medium">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.helpText && (
                <p className="text-xs text-gray-500">{field.helpText}</p>
              )}
            </div>
            <Switch
              id={field.id}
              checked={formValues[field.id] || false}
              onCheckedChange={(checked) => handleChange(field.id, checked)}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-option1`} />
                <label htmlFor={`${field.id}-option1`} className="text-sm">Option 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-option2`} checked />
                <label htmlFor={`${field.id}-option2`} className="text-sm">Option 2</label>
              </div>
            </div>
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <RadioGroup defaultValue="option2" className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id={`${field.id}-option1`} />
                <label htmlFor={`${field.id}-option1`} className="text-sm">Option 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id={`${field.id}-option2`} />
                <label htmlFor={`${field.id}-option2`} className="text-sm">Option 2</label>
              </div>
            </RadioGroup>
          </div>
        );
      case 'radio-cards':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="border rounded-md p-4 relative">
                <div className="absolute top-3 left-3">
                  <RadioGroupItem value="option1" id={`${field.id}-card1`} />
                </div>
                <div className="ml-7">Option 1</div>
              </div>
              <div className="border rounded-md p-4 bg-blue-50 border-blue-300 relative">
                <div className="absolute top-3 left-3">
                  <RadioGroupItem value="option2" id={`${field.id}-card2`} checked />
                </div>
                <div className="ml-7">Option 2</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name} ({field.type})</label>
            <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
              This field type ({field.type}) preview is not implemented yet
            </div>
          </div>
        );
    }
  };

  // Render relational fields
  const renderRelationalField = (field: any) => {
    switch (field.type) {
      case 'relation':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Related Item Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Related Item 1</SelectItem>
                <SelectItem value="item2">Related Item 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'one-to-many':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">Item 1</span>
              <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">Item 2</span>
              <span className="bg-transparent border border-blue-300 text-gray-700 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-50">+</span>
            </div>
          </div>
        );
      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="flex items-center border rounded-md p-2">
              <span className="text-sm text-gray-600">example-file.pdf</span>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                  <ArrowLeft className="h-4 w-4 rotate-90" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="text-lg">×</span>
                </Button>
              </div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="flex items-center border rounded-md p-2">
              <div className="bg-gray-100 text-gray-500 rounded px-2 py-1 text-sm">IMG</div>
              <span className="text-sm text-gray-600 ml-2">example-image.jpg</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                <span className="text-lg">×</span>
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name} ({field.type})</label>
            <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
              This field type ({field.type}) preview is not implemented yet
            </div>
          </div>
        );
    }
  };

  // Render advanced fields
  const renderAdvancedField = (field: any) => {
    switch (field.type) {
      case 'json':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <pre className="p-3 border rounded-md bg-gray-50 text-xs font-mono">
              {`{
  "key": "value",
  "number": 123
}`}
            </pre>
          </div>
        );
      case 'map':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="h-32 bg-blue-50 rounded-md flex items-center justify-center">
              <div className="text-center text-blue-500">
                <span className="block mb-1">●</span>
                <span className="text-sm">Map Preview</span>
              </div>
            </div>
          </div>
        );
      case 'rating':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="flex gap-1 text-yellow-400 text-2xl">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span className="text-gray-300">★</span>
            </div>
          </div>
        );
      case 'slider':
        return (
          <div key={field.id} className="space-y-4">
            <label className="text-sm font-medium">{field.name}</label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm">50</div>
          </div>
        );
      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name} ({field.type})</label>
            <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
              This field type ({field.type}) preview is not implemented yet
            </div>
          </div>
        );
    }
  };

  // Render presentation fields
  const renderPresentationField = (field: any) => {
    switch (field.type) {
      case 'divider':
        return (
          <div key={field.id} className="py-4">
            <Separator />
          </div>
        );
      case 'notice':
        return (
          <div key={field.id} className="py-2">
            <Alert className="bg-amber-50 border-amber-100">
              <AlertDescription className="text-amber-800">
                Notice text or warning message
              </AlertDescription>
            </Alert>
          </div>
        );
      case 'header':
        return (
          <div key={field.id} className="py-2">
            <h3 className="text-sm font-medium text-gray-500">Super Header</h3>
            <h2 className="text-xl font-bold">Section Title</h2>
          </div>
        );
      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name} ({field.type})</label>
            <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
              This field type ({field.type}) preview is not implemented yet
            </div>
          </div>
        );
    }
  };

  // Render group fields
  const renderGroupField = (field: any) => {
    switch (field.type) {
      case 'accordion':
        return (
          <div key={field.id} className="py-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Accordion Section Title</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4">Accordion content goes here</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      case 'tab-group':
        return (
          <div key={field.id} className="py-2">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="p-4 border border-t-0 rounded-b-md">
                Tab content goes here
              </TabsContent>
              <TabsContent value="tab2" className="p-4 border border-t-0 rounded-b-md">
                Tab 2 content
              </TabsContent>
              <TabsContent value="tab3" className="p-4 border border-t-0 rounded-b-md">
                Tab 3 content
              </TabsContent>
            </Tabs>
          </div>
        );
      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name} ({field.type})</label>
            <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
              This field type ({field.type}) preview is not implemented yet
            </div>
          </div>
        );
    }
  };

  // Render additional fields
  const renderAdditionalField = (field: any) => {
    switch (field.type) {
      case 'mask':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <InputTextField
              value="(123) 456-7890"
              readOnly
            />
          </div>
        );
      case 'otp':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="w-10 h-10 border rounded-md flex items-center justify-center">
                  {num}
                </div>
              ))}
            </div>
          </div>
        );
      case 'autocomplete':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="relative">
              <InputTextField value="New Y" />
              <div className="absolute top-full left-0 right-0 z-10 border rounded-md bg-white shadow-md mt-1">
                <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer">New York</div>
                <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer">New York City</div>
                <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer">New Yorker</div>
              </div>
            </div>
          </div>
        );
      case 'seo':
        return (
          <div key={field.id} className="space-y-4">
            <label className="text-sm font-medium">{field.name}</label>
            <div className="space-y-3 border rounded-md p-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">META Title</label>
                <InputTextField value="Page Title | Website Name" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">META Description</label>
                <Textarea placeholder="Brief description of the page content..." />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium">{field.name} ({field.type})</label>
            <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
              This field type ({field.type}) preview is not implemented yet
            </div>
          </div>
        );
    }
  };

  // Render all fields
  const renderFields = () => {
    // If we have no fields in any category, show a message
    if (
      Object.values(groupedFields).every(group => group.length === 0)
    ) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p>No fields have been added to this collection yet.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate(`/collections/${collectionId}/fields`)}
          >
            Add Fields
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Basic Fields */}
        {groupedFields.basic.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Fields</h3>
            <div className="space-y-6">
              {groupedFields.basic.map(renderBasicField)}
            </div>
          </div>
        )}

        {/* Selection Fields */}
        {groupedFields.selection.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Selection</h3>
            <div className="space-y-6">
              {groupedFields.selection.map(renderSelectionField)}
            </div>
          </div>
        )}

        {/* Relational Fields */}
        {groupedFields.relational.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Relational</h3>
            <div className="space-y-6">
              {groupedFields.relational.map(renderRelationalField)}
            </div>
          </div>
        )}

        {/* Advanced Fields */}
        {groupedFields.advanced.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Advanced</h3>
            <div className="space-y-6">
              {groupedFields.advanced.map(renderAdvancedField)}
            </div>
          </div>
        )}

        {/* Presentation Fields */}
        {groupedFields.presentation.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Presentation</h3>
            <div className="space-y-6">
              {groupedFields.presentation.map(renderPresentationField)}
            </div>
          </div>
        )}

        {/* Group Fields */}
        {groupedFields.groups.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Groups</h3>
            <div className="space-y-6">
              {groupedFields.groups.map(renderGroupField)}
            </div>
          </div>
        )}

        {/* Additional Fields */}
        {groupedFields.additional.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Field Previews</h3>
            <div className="space-y-6">
              {groupedFields.additional.map(renderAdditionalField)}
            </div>
          </div>
        )}

        {/* Demo Fields - Always show some examples even if there are no fields */}
        {fields.length === 0 && (
          <div className="space-y-6">
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="text-md font-medium mb-4">Demo Fields</h3>
              <div className="space-y-4">
                <InputTextField
                  id="demo-text"
                  label="Text Field"
                  placeholder="Enter text"
                />
                <NumberInputField
                  id="demo-number"
                  label="Number Field"
                  value={1000}
                  onChange={() => {}}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Select Field</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <label className="block text-sm font-medium">Toggle Field</label>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button>Submit Form</Button>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/collections/${collectionId}/fields`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1">Collection Preview</h1>
              <p className="text-gray-500">
                Previewing the {collectionId} collection form
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/collections/${collectionId}/fields`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Fields
          </Button>
        </div>

        <Tabs defaultValue="form" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="form">Form Preview</TabsTrigger>
            <TabsTrigger value="json">JSON Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>Collection Form Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">Loading fields...</div>
                ) : error ? (
                  <div className="py-8 text-center text-red-500">Error loading fields</div>
                ) : (
                  renderFields()
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle>Form Data (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify({fields, values: formValues}, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
