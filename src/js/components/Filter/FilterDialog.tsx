import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import Filter from './Filter';
import { FilterState } from '../../../store/slices/vehiclesSlice';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: FilterState) => void;
  activeAccordion?: string;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose, onSearch, activeAccordion }) => {
  const handleSubmit = (values: FilterState) => {
    onSearch(values);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md max-h-full transform overflow-hidden rounded-lg bg-white flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="text-lg font-medium">Filter and sort</DialogTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-3 p-6">
            <Filter onSubmit={handleSubmit} activeAccordion={activeAccordion} />
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between gap-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="filter-form"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search vehicles
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FilterDialog;