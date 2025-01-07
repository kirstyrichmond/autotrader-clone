import React, { useState } from "react";
import { Vehicle } from "@/components/ResultItem";
import Results from "@/components/Results";
import VehicleSearchForm from "@/components/VehicleSearchForm";

export default function Main() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  return (
    <div>
      <div className="max-w-[1272px] flex my-16 mx-32 gap-6">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Find Your Perfect Car</h1>
          <VehicleSearchForm onSearch={setVehicles} />
          {vehicles.length > 0 && <Results vehicles={vehicles} />}
        </div>
      </div>
    </div>
  );
}
