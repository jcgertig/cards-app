import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useState } from 'react';

import { passwordSchema } from '../../api/utils/validate-password';
import { H3 } from '../../components/layout/styles';
import { UserContext } from '../../lib/context/users';

const { Item } = Form;

const messageKey = 'account-profile-update';

const AccountPasswordSettings: React.FC = () => {
  const { user } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [formStatus, setFormStatus] = useState(false);

  const onFormChange = () => setFormStatus(true);

  const onSubmit = (values) => {
    setError(null);
    setSubmitting(true);
    message.loading({ content: 'loading ...', key: messageKey });
    axios
      .post(`/api/v1/sessions/change-password`, values, {
        headers: { authorization: `Bearer ${user?.authToken}` }
      })
      .then(() => {
        setFormStatus(false);
        message.success({
          content: 'Updated!',
          key: messageKey,
          duration: 2
        });
      })
      .catch((error) => {
        message.error({
          content: 'Failed to update.',
          key: messageKey,
          duration: 2
        });
        if (error.response) setError(error.response.data.error);
        else setError(['Api Error']);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      {error !== null && Array.isArray(error) && (
        <pre>
          {error
            .map((i) => (typeof i === 'string' ? i : `${i.param}: ${i.error}`))
            .join('\n')}
        </pre>
      )}
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 8 }} sm={{ span: 5 }}></Col>
        <Col
          xs={{ span: 16 }}
          sm={{ span: 17 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <H3>Change Password</H3>
        </Col>
      </Row>

      <Form
        labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 17 } }}
        onValuesChange={onFormChange}
        size="large"
        onFinish={onSubmit}
      >
        <Item
          name="oldPassword"
          label="Old Password"
          rules={[
            {
              required: true,
              message: 'Please enter your old password.'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            size="large"
            placeholder="password"
          />
        </Item>
        <Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: 'Please enter your new password.'
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
        </Item>
        <Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your new password.'
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
            placeholder="password"
          />
        </Item>

        <Item wrapperCol={{ sm: { offset: 5 } }}>
          <Button
            type="primary"
            loading={submitting}
            disabled={submitting || !formStatus}
            htmlType="submit"
          >
            Update Password
          </Button>

          <div style={{ marginTop: 32 }}>
            <Link href="/password-reset">
              <a>Forgot Password?</a>
            </Link>
          </div>
        </Item>
      </Form>
    </>
  );
};

export default AccountPasswordSettings;
