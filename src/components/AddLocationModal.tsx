import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Compass, Link, Upload, MapPin, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: [number, number];
  onSave: (data: LocationData) => void;
}

export interface LocationData {
  id?: string;
  title: string;
  description: string;
  photoUrl: string;
  photoFile?: File;
  direction: number;
  tags: string[];
  position: [number, number];
}

const DirectionMarker = ({ direction }: { direction: number }) => {
  const map = useMap();
  const center = map.getCenter();
  
  const markerHtml = `
    <div class="direction-marker" style="transform: rotate(${direction}deg)">
      <div class="arrow"></div>
    </div>
  `;

  const icon = L.divIcon({
    html: markerHtml,
    className: 'direction-marker-container',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return <Marker position={[center.lat, center.lng]} icon={icon} />;
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, position, onSave }) => {
  const [formData, setFormData] = useState<LocationData>({
    title: '',
    description: '',
    photoUrl: '',
    direction: 0,
    tags: [],
    position: position,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        photoUrl: '',
        direction: 0,
        tags: [],
        position: position,
      });
      setCurrentTag('');
      setPreviewUrl(null);
      setUploadType('file');
    }
  }, [isOpen, position]);

  const [currentTag, setCurrentTag] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getGoogleMapsUrl = () => {
    const [lat, lng] = position;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const copyCoordinates = () => {
    const [lat, lng] = position;
    navigator.clipboard.writeText(`${lat}, ${lng}`);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSave(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photoFile: file, photoUrl: '' }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add Photo Location</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <h3 className="font-medium">Location Coordinates</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={copyCoordinates}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Copy
                </button>
                <a
                  href={getGoogleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="font-mono text-sm bg-white p-2 rounded border border-gray-200">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-md ${
                  uploadType === 'file'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setUploadType('file')}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Photo
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 rounded-md ${
                  uploadType === 'url'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setUploadType('url')}
              >
                <Link className="h-5 w-5 mr-2" />
                Photo URL
              </button>
            </div>

            {uploadType === 'file' ? (
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">JPG, PNG, GIF up to 10MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, photoFile: undefined }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.photoUrl}
                onChange={e => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                placeholder="Enter photo URL or Instagram post URL"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo Direction
            </label>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="360"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  value={formData.direction}
                  onChange={e => setFormData(prev => ({ ...prev, direction: Number(e.target.value) }))}
                />
                <Compass className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="h-48 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={position}
                  zoom={16}
                  style={{ height: '100%', width: '100%' }}
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DirectionMarker direction={formData.direction} />
                </MapContainer>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (e.g., sunset, landscape)"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;