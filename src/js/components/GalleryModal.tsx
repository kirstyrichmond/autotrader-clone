import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryModalProps {
  images: Array<{ preview?: string; url?: string }>;
  isOpen: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

const GalleryModal = ({ images, isOpen, onClose, initialImageIndex = 0 }: GalleryModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getCurrentImageUrl = () => {
    const image = images[currentImageIndex];
    return image?.preview || image?.url || '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 p-2 text-gray-300 hover:text-gray-500"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 p-2 text-gray-300 hover:text-gray-500"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Image */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <img
          src={getCurrentImageUrl()}
          alt={`Image ${currentImageIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-300">
        {currentImageIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default GalleryModal;