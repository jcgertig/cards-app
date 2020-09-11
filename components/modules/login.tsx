import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';

import { UserContext } from '../../lib/context/users';
import { device } from '../../lib/theme';
import redirectAfterLogin from '../../lib/utils/redirect-after-login';
import { Shadow, ShadowDark } from '../layout/styles';

export interface LoginModuleProps {
  darkBackground?: boolean;
}

const LoginWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii[2]}px;
  box-shadow: ${({ darkBackground }) => (darkBackground ? ShadowDark : Shadow)};
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 0 auto 32px;
  padding: 16px;
  width: 280px;

  @media ${device.mobileS} {
    width: auto;
  }
  .ant-form-item {
    margin-bottom: 12px;
  }
`;

export const LoginModule: React.FC<LoginModuleProps> = ({
  children,
  darkBackground = false
}) => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState(null);
  const onSubmit = useCallback(
    (values) => {
      axios
        .post('/api/v1/sessions/login', {
          username: values.username,
          password: values.password
        })
        .then((response) => {
          setUser(response.data, values.remember);
          redirectAfterLogin(router);
        })
        .catch((error) => {
          setError(error.response.data.error);
        });
    },
    [setUser, setError]
  );

  return (
    <LoginWrapper darkBackground={darkBackground}>
      {error && <div>{error}</div>}
      <Form name="login" onFinish={onSubmit} initialValues={{ remember: true }}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please enter your email or username.'
            }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            size="large"
            placeholder="Email or Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password.'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            size="large"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link href="/password-reset">
            <a style={{ float: 'right' }}>Forgot password?</a>
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
      {children}
    </LoginWrapper>
  );
};

export default LoginModule;
