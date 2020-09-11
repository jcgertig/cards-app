import React from 'react';
import FullHeight from './full-height';

interface CenterProps {
  children: React.ReactNode;
  maxWidth?: number;
  fullHeight?: boolean;
}

const Center: React.FC<CenterProps> = ({
  children,
  maxWidth,
  fullHeight = false
}) => {
  const Wrapper = fullHeight ? FullHeight : React.Fragment;
  return (
    <Wrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        {maxWidth && <div style={{ maxWidth }}>{children}</div>}
        {!maxWidth && children}
      </div>
    </Wrapper>
  );
};

export default Center;
