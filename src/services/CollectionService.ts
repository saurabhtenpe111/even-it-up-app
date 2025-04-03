import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface Collection {
  id: string;
  title: string;
  apiId: string;
  description: string;
  icon: string;
  iconColor: string;
  status: 'published' | 'draft';
  fields: number;
  items?: number;
  lastUpdated: string;
  settings?: Json;
  permissions?: string[];
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: Json;
  permissions?: string[];
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    // First, get the collections
    const { data: collectionsData, error: collectionsError } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (collectionsError) {
      throw collectionsError;
    }

    // Count fields per collection
    const fieldCounts: Record<string, number> = {};
    for (const collection of collectionsData || []) {
      const { count, error } = await supabase
        .from('fields')
        .select('*', { count: 'exact', head: false })
        .eq('collection_id', collection.id);
      
      if (error) {
        console.error("Error counting fields:", error);
      } else {
        fieldCounts[collection.id] = count || 0;
      }
    }

    // Count content items per collection
    const contentCounts: Record<string, number> = {};
    for (const collection of collectionsData || []) {
      const { count, error } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: false })
        .eq('collection_id', collection.id);
      
      if (error) {
        console.error("Error counting content items:", error);
      } else {
        contentCounts[collection.id] = count || 0;
      }
    }

    // Map the data to our Collection interface
    return (collectionsData || []).map((collection) => ({
      id: collection.id,
      title: collection.title,
      apiId: collection.api_id,
      description: collection.description || '',
      icon: collection.icon || 'C',
      iconColor: collection.icon_color || 'blue',
      status: collection.status as 'published' | 'draft',
      fields: fieldCounts[collection.id] || 0,
      items: contentCounts[collection.id] || 0,
      lastUpdated: new Date(collection.updated_at).toLocaleDateString(),
      // Handle settings and permissions that might not exist in the database
      settings: collection.settings || {},
      permissions: collection.permissions || []
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

export interface CreateCollectionParams {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: Json;
  permissions?: string[];
}

export async function createCollection(params: CreateCollectionParams): Promise<Collection> {
  try {
    const { name, apiId, description = '', status = 'published', settings = {}, permissions = [] } = params;
    
    // Create the insert object
    const insertObj = { 
      title: name, 
      api_id: apiId, 
      description, 
      status,
      icon: 'C',
      icon_color: 'blue'
    };
    
    const { data: newCollection, error } = await supabase
      .from('collections')
      .insert([insertObj])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!newCollection) {
      throw new Error('Failed to create collection - no data returned');
    }

    return {
      id: newCollection.id,
      title: newCollection.title,
      apiId: newCollection.api_id,
      description: newCollection.description || '',
      icon: newCollection.icon || 'C',
      iconColor: newCollection.icon_color || 'blue',
      status: newCollection.status as 'published' | 'draft',
      fields: 0,
      items: 0,
      lastUpdated: new Date(newCollection.updated_at).toLocaleDateString(),
      settings: newCollection.settings || {},
      permissions: newCollection.permissions || []
    };
  } catch (error: any) {
    console.error('Error creating collection:', error);
    toast({
      title: 'Failed to create collection',
      description: error.message,
      variant: 'destructive'
    });
    throw error;
  }
}

// ContentItem interface matches the structure shown in the provided image
export interface ContentItem {
  id: string;
  collection_id: string;
  data: any;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_published?: boolean;
  api_id?: string;
  api_id_plural?: string;
}

export async function getContentItems(collectionId: string): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('collection_id', collectionId);

    if (error) {
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      status: item.status as 'published' | 'draft'
    }));
  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
}

// Field interface matching the structure shown in the provided image
export interface Field {
  id: string;
  name: string;
  api_id: string;
  type: string;
  collection_id: string;
  label?: string;
  description?: string;
  placeholder?: string;
  default_value?: any;
  validation?: any;
  options?: any;
  is_hidden?: boolean;
  position?: number;
  required: boolean;
  ui_options?: any;
  config?: any; // For backward compatibility
  order?: number; // For backward compatibility
}

// Field settings interface to properly type the settings
export interface FieldSettings {
  default_value?: any;
  validation?: any;
  options?: any;
  is_hidden?: boolean;
  ui_options?: any;
  [key: string]: any;
}

export async function getFieldsForCollection(collectionId: string): Promise<Field[]> {
  try {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('collection_id', collectionId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map(field => {
      // Safely access nested properties
      const settings = field.settings as FieldSettings || {};
      
      return {
        id: field.id,
        name: field.name,
        api_id: field.api_id,
        type: field.type,
        collection_id: field.collection_id,
        description: field.description || '',
        label: field.name, // Using name as fallback for label
        placeholder: '',
        default_value: settings.default_value || null,
        validation: settings.validation || null,
        options: settings.options || null,
        is_hidden: settings.is_hidden || false,
        position: field.sort_order || 0,
        required: field.required || false,
        ui_options: settings.ui_options || null,
        // For backward compatibility
        config: field.settings || {},
        order: field.sort_order || 0
      };
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
}

export async function createField(collectionId: string, fieldData: any): Promise<Field> {
  try {
    // Check if collection exists
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .single();

    if (collectionError || !collection) {
      throw new Error(`Collection with ID ${collectionId} not found`);
    }

    // We'll store most of the custom field props in the settings JSON column
    const fieldSettings: FieldSettings = {
      default_value: fieldData.default_value || null,
      validation: fieldData.validation || null,
      options: fieldData.options || null,
      is_hidden: fieldData.is_hidden || false,
      ui_options: fieldData.ui_options || null
    };

    const { data: field, error } = await supabase
      .from('fields')
      .insert([
        {
          collection_id: collectionId,
          name: fieldData.name,
          api_id: fieldData.api_id || fieldData.name.toLowerCase().replace(/\s+/g, '_'),
          type: fieldData.type,
          description: fieldData.description || '',
          required: fieldData.required || false,
          sort_order: fieldData.position || 0,
          settings: fieldSettings
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!field) {
      throw new Error('Failed to create field - no data returned');
    }

    return {
      id: field.id,
      name: field.name,
      api_id: field.api_id,
      type: field.type,
      collection_id: field.collection_id,
      description: field.description || '',
      label: field.name, // Using name as label
      placeholder: '',
      default_value: fieldSettings.default_value,
      validation: fieldSettings.validation,
      options: fieldSettings.options,
      is_hidden: fieldSettings.is_hidden,
      position: field.sort_order || 0,
      required: field.required || false,
      ui_options: fieldSettings.ui_options,
      config: field.settings || {},
      order: field.sort_order || 0
    };
  } catch (error: any) {
    console.error('Error creating field:', error);
    throw error;
  }
}

export const deleteField = async (collectionId: string, fieldId: string): Promise<void> => {
  // This would normally make an API call to delete the field
  // For now, we'll simulate a delay and return success
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Deleting field ${fieldId} from collection ${collectionId}`);
  
  // In a real application, this would call your backend API
  // For example:
  // return fetch(`/api/collections/${collectionId}/fields/${fieldId}`, {
  //   method: 'DELETE',
  // }).then(response => {
  //   if (!response.ok) throw new Error('Failed to delete field');
  //   return response.json();
  // });
  
  return Promise.resolve();
};
