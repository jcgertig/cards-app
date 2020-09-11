import { Button, Form, message, Select } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';

import { CARD_SORT_DIRECTIONS } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import { AccountPageProps } from '../settings.page';

const { Item } = Form;

const messageKey = 'account-profile-update';

const AccountConfigurationSettings: React.FC<AccountPageProps> = () => {
  const { user, setUser } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [formStatus, setFormStatus] = useState(false);

  const onFormChange = () => setFormStatus(true);

  const onSubmit = (values) => {
    setError(null);
    setSubmitting(true);
    message.loading({ content: 'loading ...', key: messageKey });
    axios
      .put(
        `/api/v1/users/${user!.id}`,
        { preferences: values },
        {
          headers: { authorization: `Bearer ${user?.authToken}` }
        }
      )
      .then(() => {
        setFormStatus(false);
        message.success({
          content: 'Updated!',
          key: messageKey,
          duration: 2
        });
        setUser({ ...user!, preferences: values });
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

  const initValues = user?.preferences || {
    deucesSortDir: 0
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
      <Form
        labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 17 } }}
        name="settings"
        size="large"
        onValuesChange={onFormChange}
        initialValues={initValues}
        onFinish={onSubmit}
      >
        <Item name="deucesSortDir" label="Deuces Card Sort Direction">
          <Select>
            {CARD_SORT_DIRECTIONS.map(({ value, label }) => (
              <Select.Option value={value} key={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Item>

        <Item wrapperCol={{ sm: { offset: 5 } }}>
          <Button
            type="primary"
            disabled={submitting || !formStatus}
            loading={submitting}
            htmlType="submit"
          >
            Update Preferences
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default AccountConfigurationSettings;
