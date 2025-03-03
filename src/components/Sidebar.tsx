import React, { useState } from 'react';
import { Camera, Heart, Bookmark, Star, ChevronRight, Trash2 } from 'lucide-react';
import { useLocations } from '../contexts/LocationContext';
import { useSearch } from '../contexts/SearchContext';
import type { LocationData } from './AddLocationModal';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setSelectedLocationId, deleteLocation } = useLocations();
  const { filteredLocations } = useSearch();

  const handleLocationClick = (locationId: string) => {
    setSelectedLocationId(locationId);
  };

  const handleDelete = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation();
    deleteLocation(locationId);
  };

  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-96'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 z-10"
      >
        <ChevronRight className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`h-full overflow-y-auto ${isCollapsed ? 'hidden' : ''}`}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Featured Locations</h2>
          
          <div className="space-y-4">
            {filteredLocations.map((location: LocationData) => (
              <div
                key={location.id}
                className="border rounded-lg overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => location.id && handleLocationClick(location.id)}
              >
                <img
                  src={location.photoUrl}
                  alt={location.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{location.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-600 hover:text-red-500"
                        onClick={(e) => location.id && handleDelete(e, location.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-indigo-600">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Camera className="h-4 w-4 mr-1" />
                    <span>{location.tags.join(', ')}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">(New)</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {location.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;