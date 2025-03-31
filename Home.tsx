import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AQIMeter } from '../components/AQIMeter';
import { Activity } from 'lucide-react';
import { AQI_RANGES } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Activity className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-4xl font-bold text-blue-600">AQI Prediction System</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is Air Quality Index (AQI)?</h2>
          <p className="text-gray-700 mb-6">
            The Air Quality Index (AQI) is a standardized indicator of air quality levels. It helps
            you understand how clean or polluted your air is, and what associated health effects
            might be a concern.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">
              High AQI levels can lead to respiratory issues like asthma and bronchitis, and an
              increased risk of cardiovascular disorders like heart attacks and strokes, especially
              in those exposed to contaminated air.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">AQI Levels and Health Implications</h3>
          <AQIMeter />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {AQI_RANGES.map((range) => (
              <div
                key={range.level}
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${range.color}20` }}
              >
                <h4 className="font-semibold mb-2" style={{ color: range.color }}>
                  {range.level} ({range.min}-{range.max})
                </h4>
                <p className="text-sm text-gray-700">{range.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/predict')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
                     shadow-lg transform transition-transform hover:scale-105"
          >
            Make AQI Prediction
          </button>
        </div>
      </div>
    </div>
  );
};