'use client';

export function AdBanner() {
  return (
    <div className="w-full h-24 bg-gray-800 border-2 border-red-600 rounded flex items-center justify-center my-4" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2440121173517125"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
