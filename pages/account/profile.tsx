import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Upload } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { ISession } from '../../api/controllers/session';
import { S3_IMG } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import { getBase64Image } from '../../lib/utils/base-64-image-file';
import { AccountPageProps } from '../settings.page';

const { Item } = Form;

const FormInputNote = styled.p`
  font-size: 10px;
  line-height: 1.2;
  max-width: 500px;
  width: 100%;
  margin: 8px 0 0 !important;
`;

const messageKey = 'account-profile-update';

const stopRemove = () => false;

const uploadFile = (user: ISession, id: number, data: FormData) => {
  return axios({
    method: 'post',
    url: `/api/v1/users/${id}/images`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${user.authToken}`
    }
  });
};

const defaultProfileImage = (user: { id: number; profileImage?: string }) => [
  {
    uid: '-1',
    name: user.profileImage,
    status: 'done',
    url: S3_IMG(
      {
        model: 'user',
        size: 'medium'
      },
      user.id,
      user.profileImage || ''
    )
  }
];

const AccountProfileSettings: React.FC<AccountPageProps> = ({ userData }) => {
  const { user, setUser } = useContext(UserContext);
  const [formStatus, setFormStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileFileUploading, setProfileFileUploading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [profileFileList, setProfileFileList] = useState<Array<any>>(
    defaultProfileImage(userData)
  );
  const onFormChange = () => setFormStatus(true);

  const onSubmit = (values) => {
    setError(null);
    setSubmitting(true);
    message.loading({ content: 'loading ...', key: messageKey });
    axios
      .put(
        `/api/v1/users/${user!.id}`,
        { ...values, pronounId: values.pronoun?.id },
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
      })
      .catch((error) => {
        message.error({
          content: 'Failed to update.',
          key: messageKey,
          duration: 2
        });
        if (error && error.response) setError(error.response.data.error);
        else setError(['Api Error']);
      })
      .finally(() => setSubmitting(false));
  };

  const handleUploadComplete = (data) => {
    setUser({ ...user!, ...data.updates });
  };

  const handleUploadProfileImage = async () => {
    if (userData) {
      setProfileFileUploading(true);
      const formData = new FormData();
      formData.append('profileImage', profileFileList[0]);
      try {
        const res = await uploadFile(user!, userData.id!, formData);
        if (res.data.success === false) {
          message.error('Failed to upload avatar');
        } else {
          setProfileFileList((list) => {
            list[0].uid = '-1';
            return list;
          });
          message.success('Uploaded new avatar');
          handleUploadComplete(res.data);
        }
      } catch (err) {
        message.error('Failed to upload avatar');
      }
      setProfileFileUploading(false);
    }
  };

  const handleProfileBeforeUpload = (file: any) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    if (isImage) {
      getBase64Image(file).then((url) => {
        file.url = url;
        setProfileFileList([file]);
      });
    }
    return false;
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

      <Upload
        fileList={profileFileList}
        openFileDialogOnClick={false}
        onRemove={stopRemove}
        beforeUpload={handleProfileBeforeUpload}
      >
        <Avatar src={profileFileList[0] ? profileFileList[0].url : ''} />
        <Button
          icon={<UploadOutlined />}
          onClick={handleUploadProfileImage}
          shape="round"
          type="dashed"
          disabled={
            !user ||
            (profileFileList.length!! ? profileFileList[0].uid === '-1' : true)
          }
          loading={profileFileUploading}
        >
          Update Avatar
        </Button>
      </Upload>
      <Form
        labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 17 } }}
        size="large"
        initialValues={userData}
        onValuesChange={onFormChange}
        onFinish={onSubmit}
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
              Provide your personal information, even if the account is used for
              a business, event or something else. This won&apos;t be a part of
              your public profile.
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
        <Item wrapperCol={{ sm: { offset: 5 } }}>
          <Button
            type="primary"
            disabled={submitting || !formStatus}
            loading={submitting}
            htmlType="submit"
          >
            Update Account
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default AccountProfileSettings;
