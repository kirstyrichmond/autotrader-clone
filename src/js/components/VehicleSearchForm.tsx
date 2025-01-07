import React, { useState } from "react";
import searchVehicles from "../../services/api";
import { Vehicle } from "./ResultItem";

export interface SearchParams {
  postcode: string;
  radius: number;
}

const VehicleSearchForm: React.FC<{ onSearch: (vehicles: Vehicle[]) => void }> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    postcode: "",
    radius: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { vehicles } = await searchVehicles(searchParams);
      onSearch(vehicles);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Enter postcode"
          value={searchParams.postcode}
          onChange={(e) => setSearchParams({ ...searchParams, postcode: e.target.value })}
          className="p-2 border rounded"
        />

        <select
          value={searchParams.radius}
          onChange={(e) => setSearchParams({ ...searchParams, radius: Number(e.target.value) })}
          className="p-2 border rounded"
        >
          <option value={500}>National</option>
          <option value={1}>Within 1 miles</option>
          <option value={5}>Within 5 miles</option>
          <option value={10}>Within 10 miles</option>
          <option value={15}>Within 15 miles</option>
          <option value={20}>Within 20 miles</option>
          <option value={25}>Within 25 miles</option>
          <option value={30}>Within 30 miles</option>
          <option value={35}>Within 35 miles</option>
          <option value={40}>Within 40 miles</option>
          <option value={45}>Within 45 miles</option>
          <option value={50}>Within 50 miles</option>
          <option value={55}>Within 55 miles</option>
          <option value={60}>Within 60 miles</option>
          <option value={70}>Within 70 miles</option>
          <option value={80}>Within 80 miles</option>
          <option value={90}>Within 90 miles</option>
          <option value={100}>Within 100 miles</option>
          <option value={200}>Within 200 miles</option>
        </select>

        <button type="submit" disabled={loading} className="col-span-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default VehicleSearchForm;