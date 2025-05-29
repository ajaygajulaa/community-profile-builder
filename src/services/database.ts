
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  occupation?: string;
  interests?: string[];
  role: 'admin' | 'member';
  join_date: string;
}

export interface FinancialData {
  id: string;
  type: 'ganesh_chanda' | 'marriage_gold';
  current_amount?: number;
  target_amount?: number;
  total_fund?: number;
  contributors?: number;
  total_members?: number;
  recent_support?: number;
  last_recipient?: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  file_type: 'image' | 'video';
  file_size?: number;
  description?: string;
  uploaded_by?: string;
  uploaded_at: string;
}

// User operations
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  return (data || []).map(user => ({
    ...user,
    role: user.role as 'admin' | 'member'
  }));
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  
  if (!data) return null;
  
  return {
    ...data,
    role: data.role as 'admin' | 'member'
  };
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    role: data.role as 'admin' | 'member'
  };
};

export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  
  if (error) throw error;
};

// Financial data operations
export const getFinancialData = async (): Promise<FinancialData[]> => {
  const { data, error } = await supabase
    .from('financial_data')
    .select('*');
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    type: item.type as 'ganesh_chanda' | 'marriage_gold'
  }));
};

export const updateFinancialData = async (type: 'ganesh_chanda' | 'marriage_gold', updates: Partial<FinancialData>): Promise<void> => {
  const { error } = await supabase
    .from('financial_data')
    .update(updates)
    .eq('type', type);
  
  if (error) throw error;
};

// Media file operations
export const getMediaFiles = async (): Promise<MediaFile[]> => {
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .order('uploaded_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(file => ({
    ...file,
    file_type: file.file_type as 'image' | 'video'
  }));
};

export const uploadMediaFile = async (file: File, description?: string, uploadedBy?: string): Promise<MediaFile> => {
  // Upload file to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Save file metadata to database
  const { data, error } = await supabase
    .from('media_files')
    .insert([{
      filename: fileName,
      file_type: file.type.startsWith('image/') ? 'image' : 'video',
      file_size: file.size,
      description,
      uploaded_by: uploadedBy
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    file_type: data.file_type as 'image' | 'video'
  };
};
