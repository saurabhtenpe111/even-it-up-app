
export interface ValidationSettings {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  unique?: boolean;
  message?: string;
  [key: string]: any;
}

export interface Collection {
  id: string;
  title: string;
  apiId: string;
  description?: string;
  status: string;
  fields?: any[];
  createdAt: string;
  updatedAt: string;
  // Add the missing fields
  icon?: string;
  iconColor?: string;
  items?: number;
  lastUpdated?: string;
  // Legacy field names
  created_at?: string;
  updated_at?: string;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: string;
  settings?: Record<string, any>;
}

export const CollectionService = {
  getFieldsForCollection: async (collectionId: string) => {
    // Mock implementation
    return Promise.resolve([]);
  },
  
  createField: async (collectionId: string, fieldData: any) => {
    // Mock implementation
    return Promise.resolve({ id: 'new-field-id', ...fieldData });
  },
  
  updateField: async (collectionId: string, fieldId: string, fieldData: any) => {
    // Mock implementation
    return Promise.resolve({ id: fieldId, ...fieldData });
  },
  
  deleteField: async (collectionId: string, fieldId: string) => {
    // Mock implementation
    return Promise.resolve({ success: true });
  },

  // Add missing functions referenced in the codebase
  fetchCollections: async (): Promise<Collection[]> => {
    // Mock implementation
    return Promise.resolve([
      {
        id: 'col1',
        title: 'Blog Posts',
        apiId: 'blog_posts',
        description: 'Collection of blog posts',
        status: 'published',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: 'file-text',
        iconColor: 'blue',
        items: 5,
        lastUpdated: new Date().toISOString(),
        // Legacy field names for compatibility
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'col2',
        title: 'Products',
        apiId: 'products',
        description: 'Collection of products',
        status: 'published',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: 'shopping-bag',
        iconColor: 'green',
        items: 12,
        lastUpdated: new Date().toISOString(),
        // Legacy field names for compatibility
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  },

  createCollection: async (collectionData: CollectionFormData): Promise<Collection> => {
    // Mock implementation
    return Promise.resolve({
      id: `col-${Date.now()}`,
      title: collectionData.name,
      apiId: collectionData.apiId,
      description: collectionData.description,
      status: collectionData.status || 'draft',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: 'file',
      iconColor: 'gray',
      items: 0,
      lastUpdated: new Date().toISOString(),
      // Legacy field names for compatibility
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  },

  getContentItems: async (collectionId: string): Promise<any[]> => {
    // Mock implementation
    return Promise.resolve([
      {
        id: `item-${Date.now()}-1`,
        collectionId,
        data: { title: 'Test Item 1' },
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `item-${Date.now()}-2`,
        collectionId,
        data: { title: 'Test Item 2' },
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }
};

// Export individual functions for direct imports
export const {
  getFieldsForCollection,
  createField,
  updateField,
  deleteField,
  fetchCollections,
  createCollection,
  getContentItems
} = CollectionService;
