import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Camera, Navigation, Trash2, MapPin, ExternalLink } from 'lucide-react';
import L from 'leaflet';
import AddLocationModal from './AddLocationModal';
import type { LocationData } from './AddLocationModal';
import { useLocations } from '../contexts/LocationContext';

// Create a custom icon using Lucide React Camera icon
const createCustomIcon = () => {
  const iconHtml = document.createElement('div');
  iconHtml.className = 'bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-indigo-50';
  iconHtml.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;

  return L.divIcon({
    html: iconHtml.outerHTML,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

interface MapClickHandlerProps {
  onMapClick: (latlng: [number, number]) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// New component to handle map panning
const MapController: React.FC = () => {
  const map = useMap();
  const { selectedLocationId, locations } = useLocations();

  useEffect(() => {
    if (selectedLocationId) {
      const location = locations.find((loc: LocationData) => loc.id === selectedLocationId);
      if (location) {
        map.setView(location.position, 16);
      }
    }
  }, [selectedLocationId, locations, map]);

  return null;
};

const MapComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([37.8, -122.4]);
  const { locations, addLocation, deleteLocation } = useLocations();
  const customIcon = createCustomIcon();

  // Debug logging
  useEffect(() => {
    console.log('Current locations:', locations);
  }, [locations]);

  const handleMapClick = useCallback((position: [number, number]) => {
    console.log('Map clicked at position:', position);
    setSelectedPosition(position);
    setIsModalOpen(true);
  }, []);

  const handleSaveLocation = async (locationData: LocationData) => {
    try {
      if (locationData.photoFile) {
        locationData.photoUrl = URL.createObjectURL(locationData.photoFile);
      }
      console.log('Saving location with position:', locationData.position);
      await addLocation(locationData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const getGoogleMapsUrl = (position: [number, number]) => {
    const [lat, lng] = position;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const copyCoordinates = (position: [number, number]) => {
    const [lat, lng] = position;
    navigator.clipboard.writeText(`${lat}, ${lng}`);
  };

  return (
    <>
      <MapContainer
        center={[37.8, -122.4]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapController />
        
        {Array.isArray(locations) && locations.map((location: LocationData) => {
          console.log('Rendering marker for location:', location);
          return (
            <Marker 
              key={location.id} 
              position={location.position} 
              icon={customIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <img
                    src={location.photoUrl}
                    alt={location.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{location.title}</h3>
                    <button
                      onClick={() => location.id && deleteLocation(location.id)}
                      className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                  
                  {/* Coordinates section */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium">Coordinates </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyCoordinates(location.position)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          Copy
                        </button>
                        <a
                          href={getGoogleMapsUrl(location.position)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                        >
                          <span>Maps</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div className="font-mono text-xs bg-white p-1.5 rounded border border-gray-200">
                      {location.position[0].toFixed(6)}, {location.position[1].toFixed(6)}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Navigation className="h-4 w-4 mr-1" />
                    <span>{location.direction}°</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {location.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        position={selectedPosition}
        onSave={handleSaveLocation}
      />
    </>
  );
};

export default MapComponent;