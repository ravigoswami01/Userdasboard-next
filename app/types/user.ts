export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'Active' | 'Inactive'; 
  joinedAt: string;
  bio: string;
  lastSeen: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterState {
  status: ('Active' | 'Inactive')[]; 
  search: string;
}

export type SortOption = 'name_asc' | 'name_desc' | 'none';