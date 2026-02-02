import { User, SortOption } from '../types/user';

export function filterUsers(users: User[], searchTerm: string): User[] {
  if (!searchTerm.trim()) return users;
  
  const term = searchTerm.toLowerCase();
  return users.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  );
}

export function sortUsers(users: User[], sortOption: SortOption): User[] {
  const sorted = [...users];
  
  switch (sortOption) {
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}