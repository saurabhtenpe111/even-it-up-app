
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
  }
};
