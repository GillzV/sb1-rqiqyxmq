import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Map as MapIcon, Users, Search } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">ShutterSpot</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-lg w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search locations..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <MapIcon className="h-5 w-5" />
              <span>Map</span>
            </Link>
            <Link to="/community" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <Users className="h-5 w-5" />
              <span>Community</span>
            </Link>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Share Spot
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;