import {
  AppstoreOutlined,
  BugOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { S3_IMG } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import theme from '../../lib/theme';
import LoginModule from '../modules/login';

const MenuLink = styled.a`
  width: 90%;
  display: inline-block;

  &:hover {
    color: ${theme.colors.accent} !important;
  }
`;

const GlobalMenu: React.FC<any> = (props) => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => setUser(null);

  return (
    <Menu {...props} mode="vertical" style={{ width: 280 }}>
      {user ? (
        <Menu.Item
          key="profile"
          title="Profile"
          icon={
            <Avatar
              style={{
                cursor: 'pointer',
                marginRight: 12,
                border: '1px solid #eee'
              }}
              size={58}
              src={S3_IMG(
                {
                  model: 'user',
                  size: 'medium'
                },
                user.id,
                user.profileImage
              )}
            />
          }
          style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <p style={{ marginBottom: 0, fontWeight: 700, lineHeight: 1 }}>
            {user.fullName} @{user.username}
          </p>
        </Menu.Item>
      ) : (
        <div style={{ marginTop: 5 }}>
          <LoginModule />
          <Link href="/sign-up">
            <a>Or create account.</a>
          </Link>
        </div>
      )}

      <Menu.Divider />

      <Menu.Item
        key="feedback"
        title="Feed"
        icon={<BugOutlined />}
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Link href="/">
          <a>
            <p style={{ marginBottom: 0, fontWeight: 700, lineHeight: 1 }}>
              Give Feedback
            </p>
            <span style={{ fontSize: 12, color: theme.colors.light }}>
              Help us improve the new Cards App.
            </span>
          </a>
        </Link>
      </Menu.Item>

      {user ? <Menu.Divider /> : null}

      {user ? (
        <Menu.Item key="games" title="Games" icon={<AppstoreOutlined />}>
          <Link href="/home">
            <MenuLink>Games</MenuLink>
          </Link>
        </Menu.Item>
      ) : null}

      {user ? <Menu.Divider /> : null}

      {user ? (
        <Menu.Item key="settings" title="Settings" icon={<SettingOutlined />}>
          <Link href="/settings">
            <MenuLink>Settings</MenuLink>
          </Link>
        </Menu.Item>
      ) : null}

      {user ? (
        <Menu.Item
          key="signout"
          title="Sign Out"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          <MenuLink>Sign Out</MenuLink>
        </Menu.Item>
      ) : null}
    </Menu>
  );
};

export default React.memo(GlobalMenu);
