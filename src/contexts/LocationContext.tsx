import React, { createContext, useContext, useState } from 'react';
import type { LocationData } from '../components/AddLocationModal';

interface LocationContextType {
  locations: LocationData[];
  addLocation: (location: LocationData) => void;
  deleteLocation: (locationId: string) => void;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const addLocation = (location: LocationData) => {
    const newLocation = { ...location, id: crypto.randomUUID() };
    setLocations(prev => [...prev, newLocation]);
  };

  const deleteLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    if (selectedLocationId === locationId) {
      setSelectedLocationId(null);
    }
  };

  return (
    <LocationContext.Provider value={{ 
      locations, 
      addLocation, 
      deleteLocation,
      selectedLocationId, 
      setSelectedLocationId 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
}; 