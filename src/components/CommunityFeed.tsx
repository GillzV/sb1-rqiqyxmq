import React from 'react';
import { User, MessageSquare, Heart, Share2 } from 'lucide-react';

const CommunityFeed = () => {
  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Community Feed</h1>
        
        <div className="space-y-6">
          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">John Photographer</h3>
                    <p className="text-sm text-gray-500">San Francisco, CA</p>
                  </div>
                </div>
              </div>
              
              <img
                src={`https://source.unsplash.com/random/800x600?photography&sig=${post}`}
                alt="Photography location"
                className="w-full h-96 object-cover"
              />
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                      <span>245</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                      <MessageSquare className="h-5 w-5" />
                      <span>18</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-2">
                  Found this amazing spot for car photography! The lighting during golden hour is perfect.
                </p>
                
                <div className="text-sm text-gray-500">
                  <p>📍 Twin Peaks, San Francisco</p>
                  <p>📸 Best for: Car Photography, Cityscape</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;