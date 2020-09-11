import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { passwordSchema } from '../api/utils/validate-password';
import AppLayout from '../components/app-layout';
import Header from '../components/layout/header';
import { H3, H4, Shadow, ShadowDark } from '../components/layout/styles';
import { UserContext } from '../lib/context/users';
import { device } from '../lib/theme';
import redirectAfterLogin from '../lib/utils/redirect-after-login';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
  layout: 'vertical'
};

const PasswordResetWrapper = styled.div`
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

export const PasswordResetPage: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState<any>(null);
  const [requestComplete, setRequestComplete] = useState(false);
  const { token } = router.query;

  const onSubmit = async (values) => {
    setError(null);
    setRequestComplete(false);
    axios
      .post('/api/v1/sessions/password-reset', { ...values, token })
      .then((response) => {
        if (response && response.data && !response.data.success) {
          setUser(response.data);
          redirectAfterLogin(router);
        } else {
          setRequestComplete(true);
        }
      })
      .catch((error) => {
        if (error.response) setError(error.response.data.error);
        else setError('Api Error');
      });
  };

  return (
    <AppLayout title={token ? 'Set New Password' : 'Request Password Reset'}>
      <Header title="Password Reset" />
      <PasswordResetWrapper darkBackground={false}>
        {token ? (
          <H3>Set New Password</H3>
        ) : (
          <>
            <H3>Find your account</H3>
            Enter your email to request password request.
          </>
        )}

        {requestComplete && <H4>Password reset email has been sent</H4>}
        {error !== null && (
          <pre>
            {Array.isArray(error)
              ? error.map((i) => `${i.param}: ${i.error}`).join('\n')
              : error}
          </pre>
        )}
        <Form
          {...formLayout}
          layout="vertical"
          name="password_reset"
          onFinish={onSubmit}
          style={{ margin: '16px 0' }}
        >
          {!token && (
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
              <Input
                prefix={<UserOutlined />}
                size="large"
                placeholder="email"
              />
            </Form.Item>
          )}
          {token && (
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
                placeholder="password"
              />
            </Form.Item>
          )}
          {token && (
            <Form.Item
              name="passwordConfirmation"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      'The two passwords that you entered do not match!'
                    );
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                size="large"
                placeholder="confirm password"
              />
            </Form.Item>
          )}
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" shape="round" htmlType="submit">
              {token ? 'Submit' : 'Search'}
            </Button>
          </Form.Item>
        </Form>
      </PasswordResetWrapper>
    </AppLayout>
  );
};

export default PasswordResetPage;
