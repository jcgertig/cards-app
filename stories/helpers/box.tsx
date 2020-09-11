import React from 'react';
import Center from './center';

interface BoxProps {
  id: string;
  height?: number;
  dark?: boolean;
}

const Box: React.FC<BoxProps> = ({ id, dark = false, height = 300 }) => {
  return (
    <div style={{ height, width: '100%' }} id={id}>
      <Center>
        <div
          style={{
            color: dark ? 'var(--pallet-white)' : 'var(--pallet-black)'
          }}
        >
          {id}
        </div>
      </Center>
    </div>
  );
};

export default Box;
