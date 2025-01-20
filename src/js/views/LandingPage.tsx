import React from "react";
import VehicleSearchForm from "@/components/VehicleSearchForm";

export default function Main() {
  return (
    <div>
      <div className="max-w-[1272px] flex my-16 mx-32 gap-6">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Find Your Perfect Car</h1>
          <VehicleSearchForm />
        </div>
      </div>
    </div>
  );
}
