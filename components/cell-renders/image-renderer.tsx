import React from 'react';
import styled from 'styled-components';

import { S3_IMG, S3_SIZE, S3_TYPE } from '../../lib/constants';

export interface ImageCellRendererProps {
  value: string;
  data: any;
  context: any;
  to?: (data: any) => string;
  model: string;
  size?: S3_SIZE;
  type?: S3_TYPE;
  shape?: 'square' | 'circle' | 'rect' | string;
}

const Outer = styled.div`
  width: 50px;
  height: 50px;
  display: inline-flex;
  flex-flow: column nowrap;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

const Cover = styled.div`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center top;
  transition: all 0.3s ease-in-out;

  &:hover,
  &:focus {
    transform: scale(1.2);
    cursor: pointer;
  }
`;

const ImageCellRenderer: React.FC<ImageCellRendererProps> = ({
  value,
  data,
  context,
  to,
  model,
  size,
  type,
  shape
}) => {
  const handleClick = () => {
    if (to) {
      const path = to(data);
      context.router.prefetch(path);
      context.router.push(path);
    }
  };
  const definedWidth = (shape) => {
    return shape === 'rect' ? '210px' : '50px';
  };

  const renderImageCover = (
    <Cover
      key={data.id}
      onClick={handleClick}
      style={{
        width: `${definedWidth(shape)}`,
        backgroundImage: `url(${
          value ? S3_IMG({ model, size, type }, data.id, value) : ''
        })`
      }}
    />
  );

  if (shape !== 'rect') {
    return <Outer>{renderImageCover}</Outer>;
  } else {
    return <>{renderImageCover}</>;
  }
};

export default ImageCellRenderer;
