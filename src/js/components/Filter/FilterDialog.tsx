import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import Filter from './Filter';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose, onSearch }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-medium">Filter and sort</DialogTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <Filter />

          <div className="mt-6 flex justify-between gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onSearch();
                onClose();
              }}
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