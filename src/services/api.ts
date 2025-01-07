import { SearchParams } from "@/components/VehicleSearchForm";

const API_URL = "http://localhost:5000/api";

const searchVehicles = async (params: SearchParams) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const response = await fetch(`${API_URL}/vehicles/search?${queryParams}`);
  if (!response.ok) {
    throw new Error("Search failed");
  }
  return response.json();
};

export default searchVehicles;