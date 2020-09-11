import { Form, Input, Select } from 'antd';
import React from 'react';

import CreateOrEdit from '../../../components/admin-layout/create-or-edit';
import { GameTypesMapping } from '../../../lib/enum-mappings';

const { Item } = Form;

const CreateOrEditGames: React.FC<{ id?: number }> = ({ id }) => {
  return (
    <CreateOrEdit id={id} modelPlural="games" modelSingular="game">
      <Item name="name" label="Name" required>
        <Input />
      </Item>
      <Item name="type" label="Type" required>
        <Select>
          {GameTypesMapping.asOptions.map(({ value, label }) => (
            <Select.Option key={label} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Item>
    </CreateOrEdit>
  );
};

export default CreateOrEditGames;
