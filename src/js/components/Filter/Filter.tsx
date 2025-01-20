import React from "react";
import AccordionItem from "./AccordionItem";
import { 
  ArrowDownUp,
  MapPin,
  Car,
  PoundSterling,
  Calendar,
  Gauge,
  Cog,
  Square,
  Palette,
  Users,
  Fuel,
  Power,
  LucideIcon
} from "lucide-react";
import Distance from "./Components/Distance";
import Price from "./Components/Price";
import Year from "./Components/Year";
import Mileage from "./Components/Mileage";
import Gearbox from "./Components/Gearbox";
import FuelType from "./Components/FuelType";

export type FiltersProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  component?: React.FC;
}

const Filter = () => {
  

  const filters = [
    {
      label: "Sort",
      value: "",
      icon: ArrowDownUp
    },
    {
      label: "Distance from you",
      value: "post code + radius",
      icon: MapPin,
      component: Distance
    },
    {
      label: "Make and model",
      value: "",
      icon: Car
    },
    {
      label: "Price",
      value: "",
      icon: PoundSterling,
      component: Price
    },
    {
      label: "Year",
      value: "",
      icon: Calendar,
      component: Year
    },
    {
      label: "Mileage",
      value: "",
      icon: Gauge,
      component: Mileage
    },
    {
      label: "Gearbox",
      value: "",
      icon: Cog,
      component: Gearbox
    },
    {
      label: "Body type",
      value: "",
      icon: Square
    },
    {
      label: "Colour",
      value: "",
      icon: Palette
    },
    {
      label: "Seats",
      value: "",
      icon: Users
    },
    {
      label: "Fuel type",
      value: "",
      icon: Fuel,
      component: FuelType
    },
    {
      label: "Engine power",
      value: "",
      icon: Power
    }
  ];
  return (
    <div className="">
      <h3 className="border-b border-slate-200 py-3">Filter and sort</h3>
      <div className="">
        {filters.map((filter, index) => (
          <div key={index} className="border-b border-slate-200">
            <AccordionItem item={filter} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
