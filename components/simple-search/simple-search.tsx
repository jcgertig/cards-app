import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

type Option = { label: string; value: any; [key: string]: any };
export interface SimpleSearchSelectProps {
  defaultValue?: Option;
  onChange: (value: Option) => void;
}

const SimpleSearchSelect: React.FC<SimpleSearchSelectProps & {
  loadOptions: (value: string) => Promise<Option>;
}> = ({ onChange, defaultValue, loadOptions }) => {
  const [selected, setSelected] = useState<Option | undefined>(defaultValue);

  const handleChange = (selectedOptions) => {
    setSelected(selectedOptions);
    onChange(selectedOptions);
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      value={selected}
      onChange={handleChange}
      loadOptions={loadOptions}
    />
  );
};

export default React.memo(SimpleSearchSelect);
