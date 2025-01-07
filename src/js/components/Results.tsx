import React from 'react';
import ResultItem, { Vehicle } from './ResultItem';

const Results: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  return (
    <div className="space-y-4">
      <ul>
        {vehicles.map((vehicle: Vehicle) => (
          <li className='my-8' key={vehicle.id}>
            <ResultItem vehicle={vehicle} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;