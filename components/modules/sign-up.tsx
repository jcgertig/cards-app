import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import BadWordsFilter from 'bad-words';
import { words } from 'lodash';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { passwordSchema } from '../../api/utils/validate-password';
import { UserContext } from '../../lib/context/users';
import { device } from '../../lib/theme';
import { H3, Shadow, ShadowDark } from '../layout/styles';

export interface SignUpModuleProps {
  disclaimer?: string;
  darkBackground?: boolean;
}

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
  layout: 'vertical'
};

const SignUpWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii[2]}px;
  box-shadow: ${({ darkBackground }) => (darkBackground ? ShadowDark : Shadow)};
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 0 auto;
  padding: 16px;
  width: 280px;

  @media ${device.mobileS} {
    width: auto;
  }
  .ant-form-item {
    margin-bottom: 12px;
  }
`;

const profaneFilter = new BadWordsFilter();

export const SignUpModule: React.FC<SignUpModuleProps> = ({
  children,
  darkBackground = false,
  disclaimer = 'By clicking Create Account, you agree to our Terms and that you have read our Data Policy, including our Cookie Use.'
}) => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState<any>(null);

  const onSubmit = async (values) => {
    axios
      .post('/api/v1/sessions/sign-up', values)
      .then((response) => {
        setUser(response.data);
        router.push('/settings');
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  return (
    <SignUpWrapper darkBackground={darkBackground}>
      <H3>Get started today, for free.</H3>
      {error !== null && Array.isArray(error) && (
        <pre>{error.map((i) => `${i.param}: ${i.error}`).join('\n')}</pre>
      )}
      <Form
        {...formLayout}
        layout="vertical"
        name="sign_up"
        onFinish={onSubmit}
        style={{ margin: '16px 0' }}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please enter your username!'
            },
            () => ({
              validator(rule, value) {
                if (!value) {
                  return Promise.resolve();
                }
                if (!profaneFilter.isProfane(words(value).join(' '))) {
                  return Promise.resolve();
                }
                return Promise.reject(`Usernames may not contain profanity`);
              }
            })
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            size="large"
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid email!'
            },
            {
              required: true,
              message: 'Please enter your email!'
            }
          ]}
        >
          <Input prefix={<MailOutlined />} size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password.'
            },
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
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" shape="round" htmlType="submit">
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <small>{disclaimer}</small>
      {children}
    </SignUpWrapper>
  );
};

export default SignUpModule;
