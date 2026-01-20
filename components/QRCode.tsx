
import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150 }) => {
  // Simple mock QR code using a patterned SVG
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect width="100" height="100" fill="white" />
        <path
          d="M10,10 h30 v30 h-30 z M60,10 h30 v30 h-30 z M10,60 h30 v30 h-30 z M50,50 h10 v10 h-10 z M70,70 h20 v20 h-20 z"
          fill="black"
        />
        <path
          d="M15,15 h20 v20 h-20 z M65,15 h20 v20 h-20 z M15,65 h20 v20 h-20 z"
          fill="white"
        />
        <rect x="20" y="20" width="10" height="10" fill="black" />
        <rect x="70" y="20" width="10" height="10" fill="black" />
        <rect x="20" y="70" width="10" height="10" fill="black" />
        <rect x="50" y="50" width="5" height="5" fill="black" />
        <rect x="80" y="80" width="10" height="10" fill="black" />
        {/* Abstract blocks to represent data */}
        <path d="M45,10 h5 v5 h-5 z M55,20 h5 v5 h-5 z M45,30 h10 v5 h-10 z M10,45 h5 v5 h-5 z M25,45 h10 v10 h-10 z" fill="black" />
      </svg>
      <div className="mt-2 text-xs font-mono text-slate-500 break-all text-center max-w-[150px]">
        {value}
      </div>
    </div>
  );
};

export default QRCode;
