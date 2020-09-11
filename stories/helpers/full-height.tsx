import React from 'react';

interface FullHeightProps {
  children: React.ReactNode;
}

const FullHeight: React.FC<FullHeightProps> = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {children}
    </div>
  );
};

export default FullHeight;
