import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AQIMeter } from '../components/AQIMeter';
import { Activity, ArrowLeft, Info } from 'lucide-react';
import { AQI_RANGES, type AQIParameters } from '../types';

const PARAMETER_RANGES = {
  pm25: { 
    min: 0, 
    max: 500, 
    unit: 'μg/m³',
    name: 'Particulate Matter (PM2.5)',
    description: 'Fine particles that can penetrate deep into the lungs.',
    sources: [
      'Vehicle exhaust emissions',
      'Industrial processes and manufacturing',
      'Construction and demolition activities',
      'Agricultural operations',
      'Forest fires and burning of biomass'
    ],
    measurement: 'Measured using optical particle counters or beta attenuation monitors installed at air quality monitoring stations.',
    impacts: {
      low: 'At low levels (0-12 μg/m³), air quality is good and poses minimal health risks.',
      high: 'High levels can cause respiratory issues, heart problems, and reduced lung function. Particularly dangerous for children and elderly.'
    }
  },
  no2: { 
    min: 0, 
    max: 2000, 
    unit: 'ppb',
    name: 'Nitrogen Dioxide (NO2)',
    description: 'A reddish-brown gas primarily from vehicle emissions and industrial processes.',
    sources: [
      'Vehicle exhaust (especially diesel)',
      'Power plants and industrial facilities',
      'Home heating systems',
      'Gas stoves and heaters',
      'Industrial boilers'
    ],
    measurement: 'Monitored using chemiluminescence analyzers at air quality stations, which detect NO2 by measuring light produced from its reaction with other chemicals.',
    impacts: {
      low: 'Low levels indicate good air quality and healthy breathing conditions.',
      high: 'Can cause inflammation of airways, reduced lung function, and increased asthma attacks. Long-term exposure may contribute to heart disease.'
    }
  },
  o3: { 
    min: 0, 
    max: 500, 
    unit: 'ppb',
    name: 'Ozone (O3)',
    description: 'Ground-level ozone formed by chemical reactions between pollutants.',
    sources: [
      'Chemical reaction between NOx and VOCs in sunlight',
      'Vehicle exhaust',
      'Industrial emissions',
      'Chemical solvents',
      'Natural sources during hot weather'
    ],
    measurement: 'Measured using UV absorption photometry at monitoring stations, particularly during peak daylight hours when levels are typically highest.',
    impacts: {
      low: 'Natural low levels help protect Earth from harmful UV radiation.',
      high: 'Can trigger chest pain, coughing, throat irritation, and congestion. Worsens bronchitis, emphysema, and asthma.'
    }
  },
  co: { 
    min: 0, 
    max: 50, 
    unit: 'ppm',
    name: 'Carbon Monoxide (CO)',
    description: 'An odorless, colorless gas from incomplete combustion.',
    sources: [
      'Vehicle exhaust in high-traffic areas',
      'Indoor sources like gas stoves and heaters',
      'Industrial processes',
      'Wildfires and agricultural burning',
      'Tobacco smoke'
    ],
    measurement: 'Detected using infrared absorption spectroscopy at monitoring stations, with particular focus on urban areas and high-traffic locations.',
    impacts: {
      low: 'Natural background levels are not harmful to human health.',
      high: 'Reduces oxygen delivery to organs and tissues. Can cause headaches, dizziness, and at very high levels, death.'
    }
  },
};

export const Predict: React.FC = () => {
  const navigate = useNavigate();
  const [parameters, setParameters] = useState<AQIParameters>({
    pm25: '',
    no2: '',
    o3: '',
    co: '',
  } as unknown as AQIParameters);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const aqi = Math.round(
      (parameters.pm25 / 500) * 300 +
      (parameters.no2 / 2000) * 100 +
      (parameters.o3 / 500) * 50 +
      (parameters.co / 50) * 50
    );
    setPrediction(Math.min(500, Math.max(0, aqi)));
  };

  const getCurrentRange = () => {
    if (!prediction) return null;
    return AQI_RANGES.find(range => prediction >= range.min && prediction <= range.max);
  };

  const range = getCurrentRange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-blue-600">AQI Prediction</h1>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Enter AQI Parameters</h2>
            <form onSubmit={handleSubmit}>
              {Object.entries(PARAMETER_RANGES).map(([key, param]) => (
                <div key={key} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 text-sm font-bold">
                      {param.name} ({param.unit})
                      <span className="text-gray-500 text-xs ml-2">
                        Range: {param.min}-{param.max}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSelectedParameter(selectedParameter === key ? null : key)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  {selectedParameter === key && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">{param.description}</p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Common Sources:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {param.sources.map((source, index) => (
                              <li key={index}>{source}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">How it's Measured:</h4>
                          <p className="text-sm text-gray-700">{param.measurement}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Health Impacts:</h4>
                          <p className="text-sm">
                            <span className="font-semibold text-green-600">Low Levels:</span> {param.impacts.low}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-red-600">High Levels:</span> {param.impacts.high}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    type="number"
                    min={param.min}
                    max={param.max}
                    value={parameters[key as keyof AQIParameters] || ''}
                    onChange={(e) =>
                      setParameters((prev) => ({
                        ...prev,
                        [key]: Number(e.target.value),
                      }))
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                             leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={`Enter ${param.name} value`}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 
                         rounded-lg shadow-lg transform transition-transform hover:scale-105"
              >
                Generate Prediction
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Prediction Results</h2>
            {prediction !== null && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Predicted AQI</h3>
                  <AQIMeter value={prediction} />
                </div>
                {range && (
                  <div
                    className="p-6 rounded-lg mb-6"
                    style={{ backgroundColor: `${range.color}10` }}
                  >
                    <h4
                      className="text-lg font-semibold mb-2"
                      style={{ color: range.color }}
                    >
                      {range.level} - AQI: {prediction}
                    </h4>
                    <p className="text-gray-700 mb-4">{range.message}</p>
                    <div className="space-y-2">
                      <h5 className="font-semibold">Recommended Actions:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {prediction > 100 && (
                          <>
                            <li>Stay indoors as much as possible</li>
                            <li>Use air purifiers in your home</li>
                            <li>Wear N95 masks when outdoors</li>
                            <li>Avoid strenuous outdoor activities</li>
                            <li>Keep pets indoors</li>
                            <li>Close windows and use air conditioning</li>
                          </>
                        )}
                        {prediction <= 100 && (
                          <>
                            <li>Air quality is acceptable for most activities</li>
                            <li>Sensitive individuals should monitor their health</li>
                            <li>Regular outdoor activities can be maintained</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
            {prediction === null && (
              <div className="text-center text-gray-500">
                Enter parameters and generate a prediction to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};