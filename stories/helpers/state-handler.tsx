import React, { useState } from 'react';

interface StateHandlerChildProps {
  value: any;
  setValue: (newValue: any) => void;
}

interface StateHandlerProps {
  children: React.FC<StateHandlerChildProps>;
  baseValue?: any;
}

const StateHandler: React.FC<StateHandlerProps> = ({ children, baseValue }) => {
  const [value, setValue] = useState(baseValue);
  return <>{children({ value, setValue })}</>;
};

export default StateHandler;
