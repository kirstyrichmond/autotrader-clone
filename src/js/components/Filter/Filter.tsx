import React from "react";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { searchFiltersSchema } from "../../schemas";
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
import Sort from "./Components/Sort";

export type FiltersProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  component?: React.FC;
}

interface Props {
  onSubmit?: (values: any) => void;
  activeAccordion?: string;
}

const Filter: React.FC<Props> = ({ onSubmit, activeAccordion }) => {
  const filters = useSelector((state: RootState) => state.vehicles.filters);

  const filterItems = [
    {
      label: "Sort",
      value: "",
      icon: ArrowDownUp,
      component: Sort
    },
    {
      label: "Distance from you",
      value: "post code + radius",
      icon: MapPin,
      component: Distance
    },
    // {
    //   label: "Make and model",
    //   value: "",
    //   icon: Car
    // },
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
    // {
    //   label: "Body type",
    //   value: "",
    //   icon: Square
    // },
    // {
    //   label: "Colour",
    //   value: "",
    //   icon: Palette
    // },
    // {
    //   label: "Seats",
    //   value: "",
    //   icon: Users
    // },
    {
      label: "Fuel type",
      value: "",
      icon: Fuel,
      component: FuelType
    },
    // {
    //   label: "Engine power",
    //   value: "",
    //   icon: Power
    // }
  ];
  
  return (
    <Formik
      initialValues={filters}
      validationSchema={searchFiltersSchema}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values);
        }
      }}
      enableReinitialize
    >
      {() => (
        <Form id="filter-form">
          {filterItems.map((filter, index) => (
            <div key={index} className="border-b border-slate-200">
              <AccordionItem
                item={filter}
                defaultOpen={activeAccordion === filter.label}
              />
            </div>
          ))}
        </Form>
      )}
    </Formik>
  );
};

export default Filter;
