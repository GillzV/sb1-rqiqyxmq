import React, { createContext, useContext, useState } from 'react';
import type { LocationData } from '../components/AddLocationModal';
import { useLocations } from './LocationContext';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredLocations: LocationData[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { locations } = useLocations();

  const filteredLocations = locations.filter((location: LocationData) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      location.title.toLowerCase().includes(searchLower) ||
      location.description.toLowerCase().includes(searchLower) ||
      location.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, filteredLocations }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 