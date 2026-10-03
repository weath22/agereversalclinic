import React from 'react';
import { TreatmentPricingItem } from '../../data/treatmentPricing';

interface PricingCardProps {
  treatment: TreatmentPricingItem;
  onChoosePackage: (treatment: TreatmentPricingItem) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  treatment,
  onChoosePackage,
}) => {
  return (
    <div className="group h-full">
      <div className="flex h-full flex-1 cursor-pointer flex-col rounded bg-transparent sm:bg-mist overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div
          className="relative"
          role="button"
          onClick={() => onChoosePackage(treatment)}
        >
          <div className="h-44 sm:h-72 bg-noir-900 md:h-80 overflow-hidden">
            <img
              alt={treatment.title}
              loading="lazy"
              width="800"
              height="800"
              decoding="async"
              data-nimg="1"
              className="h-full w-full object-cover opacity-60 duration-300 sm:group-hover:opacity-80"
              src={treatment.image}
              style={{ color: 'transparent' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-noir-900/40 backdrop-blur-[1px] px-2.5 sm:px-3 py-2">
            <p className="no-margin text-xs sm:text-sm text-white md:text-lg font-medium">
              {treatment.title}
            </p>
          </div>
          {treatment.badge && (
            <div className="absolute left-2 sm:left-3 top-3 sm:top-4 flex flex-col space-y-2 items-start">
              <div className="inline-flex items-center font-Lato rounded-full border border-noir-600 px-2 py-0.5 text-[10px] sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-none font-semibold antialiased text-white bg-[#EA014A]">
                {treatment.badge}
              </div>
            </div>
          )}
        </div>
        <div className="flex h-full flex-col justify-between space-y-3 sm:space-y-4 px-3 sm:px-4 py-3 sm:py-4">
          <div
            className="space-y-2 sm:space-y-4"
            role="button"
            onClick={() => onChoosePackage(treatment)}
          >
            <div className="space-y-0">
              <p className="text-xs sm:text-sm text-gray-500 md:text-sm">Starting at</p>
              <div className="flex flex-col space-y-0 md:flex-row md:items-end md:space-x-4">
                <p className="no-margin text-xl sm:text-3xl md:text-4xl font-normal">
                  £{treatment.startingPrice}
                  <span className="text-xs sm:text-sm md:text-lg md:align-bottom">.00</span>
                </p>
              </div>
            </div>
            <p className="no-margin hidden text-sm text-noir-600 md:block md:text-base font-light">
              {treatment.description}
            </p>
          </div>
          <div>
            <p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChoosePackage(treatment);
                }}
                className="inline-flex items-center rounded-full justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none bg-access-purple text-white sm:hover:bg-purple sm:duration-200 disabled:bg-noir-900 disabled:hover:bg-noir-900 px-3.5 sm:px-6 py-2 md:py-2.5 text-xs sm:text-base w-full md:w-auto cursor-pointer"
              >
                Select Package
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
