import { useEffect, useRef, useState } from "react";

interface AdSenseProps {
  adSlot?: string;
  adFormat?: "auto" | "rectangle" | "banner" | "leaderboard";
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = {},
  className = "",
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adError, setAdError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize ads in production and if we have a valid ad slot
    if (!import.meta.env.PROD || !adSlot || adError || isInitialized) {
      return;
    }

    const initializeAd = () => {
      try {
        // Check if adsbygoogle is available
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          // Push ad to AdSense queue with error handling
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("AdSense initialization error:", error);
        setAdError(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeAd, 100);

    return () => clearTimeout(timer);
  }, [adSlot, adError, isInitialized]);

  // Always show placeholder in development or if there's an error
  const showPlaceholder = !import.meta.env.PROD || !adSlot || adError;

  if (showPlaceholder) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 ${className}`}
        style={{ minHeight: "100px", ...style }}
      >
        <p className="text-sm font-medium">Advertisement</p>
        {!import.meta.env.PROD && (
          <>
            <p className="text-xs">AdSense Placeholder</p>
            <p className="text-xs">Slot: {adSlot || 'Not specified'}</p>
            <p className="text-xs">Publisher: pub-8199077937393778</p>
          </>
        )}
        {adError && (
          <p className="text-xs text-red-500">Ad failed to load</p>
        )}
      </div>
    );
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-8199077937393778"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}

// Predefined ad configurations
// Note: Replace with actual AdSense ad slot IDs from your AdSense account
export const AdSenseConfigs = {
  sidebar: {
    adSlot: undefined, // Replace with actual AdSense ad slot ID
    adFormat: "rectangle" as const,
    style: { width: "250px", height: "250px" },
  },
  header: {
    adSlot: undefined, // Replace with actual AdSense ad slot ID
    adFormat: "banner" as const,
    style: { width: "728px", height: "90px" },
  },
  footer: {
    adSlot: undefined, // Replace with actual AdSense ad slot ID
    adFormat: "leaderboard" as const,
    style: { width: "728px", height: "90px" },
  },
  content: {
    adSlot: undefined, // Replace with actual AdSense ad slot ID
    adFormat: "auto" as const,
    style: { minHeight: "280px" },
  },
};

// Helper function to check if AdSense is properly configured
export const isAdSenseConfigured = () => {
  return Object.values(AdSenseConfigs).some(config => config.adSlot);
};
