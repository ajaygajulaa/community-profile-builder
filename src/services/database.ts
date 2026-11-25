import { mockUsers, mockFinances } from "@/utils/mockData";

// This is a local, in-memory demo store. Reloading the page resets all changes.
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

let users: User[] = mockUsers.map(({ joinDate, id, role, ...user }) => ({
  ...user, id: String(id), role: role as User['role'], join_date: joinDate,
}));
const finances: FinancialData[] = [
  { id: 'ganesh', type: 'ganesh_chanda', current_amount: mockFinances.ganeshChanda.currentAmount, target_amount: mockFinances.ganeshChanda.targetAmount, contributors: mockFinances.ganeshChanda.contributors, total_members: mockFinances.ganeshChanda.totalMembers },
  { id: 'gold', type: 'marriage_gold', total_fund: mockFinances.marriageGold.totalFund, recent_support: mockFinances.marriageGold.recentSupport, last_recipient: mockFinances.marriageGold.lastRecipient },
];
const media: MediaFile[] = [];
const copy = <T>(value: T): T => structuredClone(value);
let nextId = 0;
const id = () => `demo-${++nextId}`;

export const getUsers = async (): Promise<User[]> => copy(users);
export const getUserByEmail = async (email: string): Promise<User | null> =>
  copy(users.find(user => user.email.toLowerCase() === email.trim().toLowerCase()) ?? null);
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const name = userData.name.trim();
  const email = userData.email.trim().toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a name and valid email.');
  if (users.some(user => user.email.toLowerCase() === email)) throw new Error('Email already registered.');
  const user: User = { ...copy(userData), id: id(), name, email, role: 'member' };
  users.push(user);
  return copy(user);
};
export const deleteUser = async (userId: string): Promise<void> => {
  if (!users.some(user => user.id === userId && user.role === 'member')) throw new Error('Member not found.');
  users = users.filter(user => user.id !== userId);
};
export const getFinancialData = async (): Promise<FinancialData[]> => copy(finances);
export const updateFinancialData = async (type: FinancialData['type'], updates: Partial<FinancialData>): Promise<void> => {
  const item = finances.find(entry => entry.type === type);
  if (!item) throw new Error('Fund not found.');
  const amount = type === 'ganesh_chanda' ? updates.current_amount : updates.total_fund;
  if (amount === undefined || !Number.isFinite(amount) || amount < 0) throw new Error('Enter a non-negative amount.');
  if (type === 'ganesh_chanda') item.current_amount = amount;
  else item.total_fund = amount;
};
export const getMediaFiles = async (): Promise<MediaFile[]> => copy(media);
export const uploadMediaFile = async (file: File, description?: string, uploadedBy?: string): Promise<MediaFile> => {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) throw new Error('Select an image or video.');
  const entry: MediaFile = { id: id(), filename: file.name, file_type: file.type.startsWith('image/') ? 'image' : 'video', file_size: file.size, description, uploaded_by: uploadedBy, uploaded_at: new Date().toISOString() };
  media.unshift(entry);
  return copy(entry);
};
