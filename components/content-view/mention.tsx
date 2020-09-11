import React from 'react';

const Mention: React.FC<any> = ({ className, children }) => (
  <span className={className}>{children}</span>
);

export default Mention;
