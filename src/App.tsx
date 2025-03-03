import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import CommunityFeed from './components/CommunityFeed';
import { LocationProvider } from './contexts/LocationContext';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <LocationProvider>
      <SearchProvider>
        <Router>
          <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex">
              <Routes>
                <Route path="/" element={
                  <>
                    <div className="flex-1 relative">
                      <Map />
                    </div>
                    <Sidebar />
                  </>
                } />
                <Route path="/community" element={<CommunityFeed />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SearchProvider>
    </LocationProvider>
  );
}

export default App;