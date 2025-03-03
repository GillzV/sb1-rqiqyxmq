import React, { createContext, useContext, useState, useCallback } from 'react';
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

  // Debug logging
  React.useEffect(() => {
    console.log('Locations state updated:', locations);
  }, [locations]);

  const addLocation = useCallback((location: LocationData) => {
    console.log('Adding location:', location);
    const newLocation = { ...location, id: crypto.randomUUID() };
    setLocations(prev => {
      const updated = [...prev, newLocation];
      console.log('Updated locations:', updated);
      return updated;
    });
  }, []);

  const deleteLocation = useCallback((locationId: string) => {
    console.log('Deleting location:', locationId);
    setLocations(prev => {
      const updated = prev.filter(loc => loc.id !== locationId);
      console.log('Updated locations after delete:', updated);
      return updated;
    });
    if (selectedLocationId === locationId) {
      setSelectedLocationId(null);
    }
  }, [selectedLocationId]);

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