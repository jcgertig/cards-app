import React, { useState } from 'react';
import { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { arrayMove } from '../../lib/utils/array-move';

export const SortableMultiValue = SortableElement((props) => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});
export const SortableSelectContainer = SortableContainer(CreatableSelect);

const getHelperDimensions = ({ node }) => node.getBoundingClientRect();

type Option = { label: string; value: any; [key: string]: any };
interface SortableSelectProps {
  options?: Array<Option>;
  defaultValue?: Array<Option>;
  onChange: (values: Array<Option>) => void;
}

const SortableSelect: React.FC<SortableSelectProps> = ({
  options = [],
  onChange,
  defaultValue = []
}) => {
  const [selected, setSelected] = useState<Array<Option>>(defaultValue);

  const handleChange = (selectedOptions) => {
    setSelected(selectedOptions);
    onChange(selectedOptions);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selected, oldIndex, newIndex);
    handleChange(newValue);
    console.log(
      'Values sorted:',
      newValue.map((i) => i.value)
    );
  };

  return (
    <SortableSelectContainer
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions={getHelperDimensions}
      // react-select props:
      isMulti={true}
      options={options}
      value={selected}
      onChange={handleChange}
      components={{
        MultiValue: SortableMultiValue
      }}
      closeMenuOnSelect={false}
      createOptionPosition="last"
    />
  );
};

export default React.memo(SortableSelect);
