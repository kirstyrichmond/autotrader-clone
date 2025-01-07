import FilterBox from "@/components/FilterBox";
import { Vehicle } from "@/components/ResultItem";
import Results from "@/components/Results";
import React, { useState } from "react";


export default function CarSearch() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  return (
    <div>
      <div className="max-w-[1272px] flex my-16 mx-32 gap-6">
        <FilterBox />
        {/* <Results /> */}
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Find Your Perfect Car</h1>
          {vehicles.length > 0 && <Results vehicles={vehicles} />}
        </div>
      </div>
    </div>
  );
}
