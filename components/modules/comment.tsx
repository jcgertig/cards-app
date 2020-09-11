import { CheckCircleTwoTone } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Row } from 'antd';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { S3_IMG } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import { device } from '../../lib/theme';
import ContentView from '../content-view';
import { Shadow, ShadowDark } from '../layout/styles';
import LoginModule from './login';

export interface CommentModuleProps {
  type?: 'Tip' | 'Reply' | 'Comment' | 'Submit';
  darkBackground?: boolean;
  value?: any;
  onSubmit?: (value: any) => void;
  loading?: boolean;
}

const CommentWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii[2]}px;
  box-shadow: ${({ darkBackground }) => (darkBackground ? ShadowDark : Shadow)};
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 32px auto;
  padding: 16px;
  width: 280px;

  @media ${device.mobileS} {
    width: auto;
  }
  .ant-form-item {
    margin-bottom: 12px;
  }
`;

const CommentHeader = styled(Row)`
  margin-bottom: 8px;
  width: 100%;
  margin: 0;
`;

const CommentModule: React.FC<CommentModuleProps> = ({
  type = 'Comment',
  darkBackground = false,
  value,
  onSubmit,
  loading
}) => {
  const { user } = useContext(UserContext);
  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values.comment);
    }
  };

  if (!user) return <LoginModule />;

  return (
    <CommentWrapper darkBackground={darkBackground}>
      <Form onFinish={handleSubmit}>
        <CommentHeader gutter={[16, 16]}>
          <Col>
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
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ margin: '0 8px 0 4px' }}
            />
            @{user.username}
          </Col>
        </CommentHeader>
        <Form.Item name="comment">
          <ContentView
            placeholder="Comments or tips to add publicly?"
            value={value}
            readOnly={false}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {type}
          </Button>
        </Form.Item>
      </Form>
    </CommentWrapper>
  );
};

export default CommentModule;
