
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ComponentField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  config?: Record<string, any>;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ComponentField[];
  lastUpdated: string;
}

export async function fetchComponents(): Promise<Component[]> {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(component => {
      return {
        id: component.id,
        name: component.name,
        description: component.description || '',
        category: component.category || 'Other',
        fields: component.fields || [],
        lastUpdated: component.updated_at
      };
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    toast({
      title: 'Failed to load components',
      description: 'There was an error loading your components',
      variant: 'destructive'
    });
    return [];
  }
}

export async function createComponent(component: Omit<Component, 'id' | 'lastUpdated'>): Promise<Component> {
  try {
    const { data, error } = await supabase
      .from('components')
      .insert([{
        name: component.name,
        description: component.description,
        category: component.category,
        fields: component.fields,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      category: data.category || 'Other',
      fields: data.fields || [],
      lastUpdated: data.updated_at
    };
  } catch (error) {
    console.error('Error creating component:', error);
    toast({
      title: 'Failed to create component',
      description: 'There was an error creating your component',
      variant: 'destructive'
    });
    throw error;
  }
}

export async function updateComponent(component: Component): Promise<Component> {
  try {
    const { data, error } = await supabase
      .from('components')
      .update({
        name: component.name,
        description: component.description,
        category: component.category,
        fields: component.fields,
      })
      .eq('id', component.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      category: data.category || 'Other',
      fields: data.fields || [],
      lastUpdated: data.updated_at
    };
  } catch (error) {
    console.error('Error updating component:', error);
    toast({
      title: 'Failed to update component',
      description: 'There was an error updating your component',
      variant: 'destructive'
    });
    throw error;
  }
}

export async function deleteComponent(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting component:', error);
    toast({
      title: 'Failed to delete component',
      description: 'There was an error deleting your component',
      variant: 'destructive'
    });
    throw error;
  }
}
