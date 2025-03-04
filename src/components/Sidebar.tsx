import React from 'react';
import { Search, MapPin, Navigation, Trash2, X } from 'lucide-react';
import { useLocations } from '../contexts/LocationContext';
import { useSearch } from '../contexts/SearchContext';

const Sidebar: React.FC = () => {
  const { locations, deleteLocation, selectedLocationId, setSelectedLocationId } = useLocations();
  const { searchQuery, setSearchQuery, filteredLocations } = useSearch();

  return (
    <div className="w-80 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Featured Locations</h2>
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedLocationId === location.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocationId(location.id || null)}
              >
                <div className="relative">
                  <img
                    src={location.photoUrl}
                    alt={location.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (location.id) deleteLocation(location.id);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-medium mb-1">{location.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{location.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location.position[0].toFixed(6)}, {location.position[1].toFixed(6)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Navigation className="h-4 w-4 mr-1" />
                  <span>Direction: {location.direction}°</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {location.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
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