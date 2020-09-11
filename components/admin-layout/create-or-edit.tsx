import { Button, Form, message, PageHeader, Result } from 'antd';
import axios from 'axios';
import { capitalize } from 'lodash';
import Router, { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../lib/context/users';
import Loader from '../loader';
import AdminLayout from './index';

const { Item } = Form;

const messageKey = 'admin-creation-or-edit';

interface CreateOrEditProps {
  id?: number;
  modelSingular: string;
  modelPlural: string;
  preFormContent?: any;
  onData?: (data: any) => void;
}

const CreateOrEdit: React.FC<CreateOrEditProps> = ({
  id,
  modelSingular,
  modelPlural,
  children,
  preFormContent,
  onData
}) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [error, setError] = useState<any>(null);
  const [modelData, setModelData] = useState<any>();
  const [formDirty, setFormDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const capsSingular = capitalize(modelSingular);
  const singular = modelSingular.toLocaleLowerCase();
  const plural = modelPlural.toLocaleLowerCase();

  const handleSubmit = async (values) => {
    message.loading({ content: 'loading ...', key: messageKey, duration: 2 });
    setSubmitting(true);
    if (modelData) {
      axios
        .put(`/api/v1/${plural}/${modelData.id}`, values, {
          headers: { authorization: `Bearer ${user?.authToken}` }
        })
        .then(() => {
          message.success({
            content: `${capsSingular} updated!`,
            key: messageKey,
            duration: 2
          });
          setFormDirty(false);
        })
        .catch((error) => {
          message.error({
            content: `Failed to update ${singular}`,
            key: messageKey,
            duration: 2
          });
          setError(error.response.data.error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      axios
        .post(`/api/v1/${plural}`, values, {
          headers: { authorization: `Bearer ${user?.authToken}` }
        })
        .then((res) => {
          message.success({
            content: `${capsSingular} created!`,
            key: messageKey,
            duration: 2
          });

          router.push(`/admin/${plural}/${res.data.id}`);
        })
        .catch((error) => {
          message.error({
            content: `Failed to create ${singular}.`,
            key: messageKey,
            duration: 2
          });
          setError(error.response.data.error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`/api/v1/${plural}/${id}`);
      if (response) {
        if (onData) {
          onData({ ...response.data });
        }
        setModelData(response.data);
      } else {
        setError(true);
      }
    };

    if (id && !modelData) fetchData();
  }, [id, modelData]);

  if (id && !modelData) {
    return (
      <AdminLayout>
        {error === true ? (
          <Result
            status="500"
            title={`Failed to load the ${singular}`}
            subTitle="Sorry, something went wrong. Please reload to try again."
          />
        ) : (
          <Loader />
        )}
      </AdminLayout>
    );
  }

  const onFormChange = () => setFormDirty(true);

  return (
    <AdminLayout>
      <PageHeader
        onBack={() => Router.back()}
        title={modelData?.name || `New ${capsSingular}`}
        subTitle={`ID: ${modelData?.id || 'NEW'}`}
        style={{ padding: 0, marginBottom: '32px' }}
      />
      {modelData && (
        <div style={{ marginBottom: 10 }}>
          <pre>
            created: {modelData.createdAt} / updated: {modelData.updatedAt}
          </pre>
        </div>
      )}

      {preFormContent}

      {error !== null && Array.isArray(error) && (
        <pre>{error.map((i) => `${i.param}: ${i.error}`).join('\n')}</pre>
      )}

      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onFinish={handleSubmit}
        onValuesChange={onFormChange}
        size="large"
        key={modelData ? modelData.id : ''}
        initialValues={modelData}
      >
        {children}
        <Item wrapperCol={{ sm: { offset: 5 } }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting || !formDirty}
          >
            {id ? `Update ${capsSingular}` : `Create ${capsSingular}`}
          </Button>
        </Item>
      </Form>
    </AdminLayout>
  );
};

export default CreateOrEdit;
