import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div
        className="text-center space-y-6 animate-fade-in"
      >
        {/* Logo Animation */}
        <div
          className="relative w-16 h-16 mx-auto animate-spin"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
          <div className="relative w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading FinTrack
          </h2>
          <p className="text-gray-600">Preparing your financial dashboard...</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        <div
          className="flex justify-center animate-spin"
        >
          <Loader2 className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export default Loading;