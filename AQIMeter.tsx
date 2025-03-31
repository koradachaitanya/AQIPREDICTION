import React from 'react';
import { AQI_RANGES } from '../types';

interface AQIMeterProps {
  value?: number;
}

export const AQIMeter: React.FC<AQIMeterProps> = ({ value }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative h-8 rounded-full overflow-hidden flex">
        {AQI_RANGES.map((range) => (
          <div
            key={range.level}
            style={{ backgroundColor: range.color }}
            className="flex-1 relative"
          >
            {value !== undefined && value >= range.min && value <= range.max && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-800" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm">
        {AQI_RANGES.map((range) => (
          <div key={range.level} className="text-center">
            <div className="font-semibold">{range.min}</div>
          </div>
        ))}
        <div className="text-center">
          <div className="font-semibold">500</div>
        </div>
      </div>
    </div>
  );
};