import React, { useState } from "react";
import { FiltersProps } from "./Filter";
import { ChevronDown, ChevronUp } from "lucide-react";

type ItemProps = {
  item: FiltersProps;
}

const AccordionItem: React.FC<ItemProps> = ({item}) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;
  const Component = item.component;
  
  const handleAccordion = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <div onClick={(e) => handleAccordion(e)} className="flex items-center justify-between py-4 cursor-pointer">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="font-medium">{item.label}</p>
            { !isOpen && <p className="text-sm text-gray-500">{item.value}</p>}
          </div>
        </div>
        { isOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" /> }
      </div>
        {
          isOpen && (
            <div className="mb-4">
              {Component && <Component />}
            </div>
          )
        }
    </div>
  );
};

export default AccordionItem;