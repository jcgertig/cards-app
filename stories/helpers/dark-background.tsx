import React from 'react';

interface DarkBackgroundProps {
  children: React.ReactNode;
}

const DarkBackground: React.FC<DarkBackgroundProps> = ({ children }) => {
  return (
    <div
      style={{
        background: 'var(--pallet-black)',
        height: '100%',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

export default DarkBackground;
