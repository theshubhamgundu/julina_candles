import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const useGlobalIsLoading = () => {
  return useSelector((state: RootState) => {
    const apis = [
      (state as any).productAPI,
      (state as any).orderAPI,
      (state as any).userAPI,
      (state as any).couponAPI,
      (state as any).paymentAPI,
      (state as any).statsAPI,
    ];

    for (const api of apis) {
      if (!api) continue;
      if (api.queries) {
        for (const key in api.queries) {
          if (api.queries[key]?.status === 'pending') return true;
        }
      }
      if (api.mutations) {
        for (const key in api.mutations) {
          if (api.mutations[key]?.status === 'pending') return true;
        }
      }
    }
    return false;
  });
};

interface GlobalLoadingOverlayProps {
  forcedLoading?: boolean;
}

const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({ forcedLoading }) => {
  const isApiLoading = useGlobalIsLoading();
  const showLoader = forcedLoading || isApiLoading;

  // Prevent scroll when loading overlay is active
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLoader]);

  if (!showLoader) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-auto select-none touch-none"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-xs border border-[#185e33]/20 animate-in fade-in zoom-in duration-200">
        {/* Centered Brand Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#185e33]/20 border-t-[#185e33] border-r-[#e5c158] rounded-full animate-spin"></div>
          <span className="absolute text-2xl animate-pulse">🌾</span>
        </div>

        {/* Text Details */}
        <div className="text-center">
          <h3 className="text-lg font-serif font-bold text-[#185e33] tracking-wide">
            Julina Candles & Melts
          </h3>
          <p className="text-xs text-gray-500 font-sans mt-1 animate-pulse">
            Processing, please wait…
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;

