import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'leaderboard';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  style = {},
  className = ""
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't render ads in development or if no AdSense client ID
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 ${className}`}
        style={{ minHeight: '100px', ...style }}
      >
        <p className="text-sm">AdSense Ad Placeholder</p>
        <p className="text-xs">Slot: {adSlot}</p>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-8199077937393778"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
    </div>
  );
}

// Predefined ad configurations
export const AdSenseConfigs = {
  sidebar: {
    adSlot: "1234567890",
    adFormat: "rectangle" as const,
    style: { width: '250px', height: '250px' }
  },
  header: {
    adSlot: "1234567891", 
    adFormat: "banner" as const,
    style: { width: '728px', height: '90px' }
  },
  footer: {
    adSlot: "1234567892",
    adFormat: "leaderboard" as const, 
    style: { width: '728px', height: '90px' }
  },
  content: {
    adSlot: "1234567893",
    adFormat: "auto" as const,
    style: { minHeight: '280px' }
  }
};
