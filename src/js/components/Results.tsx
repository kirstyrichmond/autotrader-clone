import React from 'react';
import ResultItem, { Vehicle } from './ResultItem';

const Results: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  return (
    <div className="mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {vehicles.map((vehicle: Vehicle) => (
          <ResultItem key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default Results;