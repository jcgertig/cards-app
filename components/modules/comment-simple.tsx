import { Avatar, Button, Form } from 'antd';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { S3_IMG } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import { device } from '../../lib/theme';
import ContentView from '../content-view';
import LoginModule from './login';

export interface CommentSimpleModuleProps {
  type?: 'Reply' | 'Comment' | 'Submit' | 'Edit' | 'Add';
  placeholder?: string;
  value?: any;
  cancel?: boolean;
  onCancel?: Function;
  onSubmit?: (value: any) => void;
  loading?: boolean;
}

const CommentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 280px;

  @media ${device.mobileS} {
    width: auto;
  }
  .ant-form-item {
    margin-bottom: 12px;
  }
`;

const CommentSimpleModule: React.FC<CommentSimpleModuleProps> = ({
  type = 'Comment',
  value = 'test',
  placeholder = 'Have any comments to add?',
  cancel = false,
  onCancel,
  onSubmit,
  loading
}) => {
  const { user } = useContext(UserContext);
  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values.comment);
    }
  };

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
  }, [onCancel]);

  if (!user) return <LoginModule />;

  return (
    <CommentWrapper>
      <Form name="comment" onFinish={handleSubmit}>
        <Form.Item name="comment" style={{ height: 60 }}>
          <ContentView
            placeholder={placeholder}
            readOnly={false}
            value={value}
          />
        </Form.Item>
        <Form.Item>
          <div style={{ justifyContent: 'space-between', display: 'flex' }}>
            <Avatar
              src={S3_IMG(
                {
                  model: 'user',
                  size: 'medium'
                },
                user.id,
                user.profileImage
              )}
              style={{ marginRight: 12 }}
            />
            <div>
              {cancel ? (
                <Button type="text" shape="round" onClick={handleCancel}>
                  Cancel
                </Button>
              ) : null}
              <Button
                loading={loading}
                disabled={loading}
                type="primary"
                shape="round"
                htmlType="submit"
              >
                {type}
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </CommentWrapper>
  );
};

export default CommentSimpleModule;
