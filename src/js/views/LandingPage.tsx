import React from "react";
import VehicleSearchForm from "@/components/VehicleSearchForm";
import bannerImage from "../../assets/images/banner.avif";

export default function Main() {
  return (
    <div>
      <div className="relative min-h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full lg:w-1/2 xl:w-2/5 py-8 md:py-16">
            <div className="mb-6 md:mb-8 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                Find Your Perfect Car
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 drop-shadow-md leading-relaxed">
                Search thousands of quality used cars from trusted dealers across the UK
              </p>
            </div>
            <div className="max-w-full sm:max-w-md lg:max-w-lg">
              <VehicleSearchForm />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* add more sections here */}
        {/* <div>hello</div> */}
      </div>
    </div>
  );
}
