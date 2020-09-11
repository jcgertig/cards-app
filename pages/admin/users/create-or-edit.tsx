import { LockOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { passwordSchema } from '../../../api/utils/validate-password';
import CreateOrEdit from '../../../components/admin-layout/create-or-edit';
import { UserRolesMapping } from '../../../lib/enum-mappings';

const { Item } = Form;

const FormInputNote = styled.p`
  font-size: 10px;
  line-height: 1.2;
  max-width: 500px;
  width: 100%;
  margin: 8px 0 0 !important;
`;

const CreateOrEditUsers: React.FC<{ id?: number }> = ({ id }) => {
  return (
    <CreateOrEdit
      id={id}
      modelPlural="users"
      modelSingular="user"
      preFormContent={
        <div style={{ margin: '12px 0 32px' }}>
          <Button icon={<UploadOutlined />} shape="round" type="dashed">
            Update Avatar
          </Button>
          <Button shape="round" type="primary">
            Send Password Reset Email
          </Button>
        </div>
      }
    >
      <Item name="firstName" label="First Name">
        <Input />
      </Item>
      <Item name="lastName" label="Last Name">
        <Input />
      </Item>
      <Item name="username" label="Username">
        <Input />
      </Item>

      <Row style={{ margin: '0 0 16px' }}>
        <Col span={18} sm={{ offset: 5 }}>
          Personal Information
          <FormInputNote>
            Provide your personal information, even if the account is used for a
            business, event or something else. This won&apos;t be a part of your
            public profile.
          </FormInputNote>
        </Col>
      </Row>
      <Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail'
          },
          { required: true, message: 'Please input your E-mail' }
        ]}
      >
        <Input />
      </Item>
      {id ? (
        <Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password.' },
            () => ({
              validator(rule, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const issues = passwordSchema.validate(value, {
                  list: true
                }) as string[];
                if (issues.length === 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  `The password does not match ${issues.join(
                    ', '
                  )} requirements`
                );
              }
            })
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            size="large"
            placeholder="password"
            autoComplete="new-password"
          />
        </Item>
      ) : null}
      <Select>
        {UserRolesMapping.asOptions.map(({ value, label }) => (
          <Select.Option key={label} value={value}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </CreateOrEdit>
  );
};

export default CreateOrEditUsers;
