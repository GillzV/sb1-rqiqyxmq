import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Camera, Navigation } from 'lucide-react';
import L from 'leaflet';
import AddLocationModal from './AddLocationModal';
import type { LocationData } from './AddLocationModal';

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

const MapComponent = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([37.8, -122.4]);
  const customIcon = createCustomIcon();

  const handleMapClick = useCallback((position: [number, number]) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  }, []);

  const handleSaveLocation = (locationData: LocationData) => {
    setLocations(prev => [...prev, locationData]);
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
        
        {locations.map((location, index) => (
          <Marker key={index} position={location.position} icon={customIcon}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <img
                  src={location.photoUrl}
                  alt={location.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold mb-1">{location.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Navigation className="h-4 w-4 mr-1" />
                  <span>{location.direction}°</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
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
            </Popup>
          </Marker>
        ))}
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