import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Badge, Layout, Menu } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { S3_IMG } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import Logo from '../icons/logo';
import sidebarDefinition from './sidebar-definition';

const AdminNavigation = styled(Layout.Sider)`
  height: 100vh;
  overflow: auto;

  .ant-layout-sider-children {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
`;

const reduceSidebar = (res, i) => {
  if (i.to) {
    res.push(i);
  }
  if (i.children) {
    return [...res, ...i.children.reduce(reduceSidebar, [])];
  }
  return res;
};
const flatSidebarDef = sidebarDefinition.reduce(reduceSidebar, []);

const renderMenuItem = (menuItem) => {
  const content = menuItem.to ? (
    <Link href={menuItem.to}>
      <a>{menuItem.title}</a>
    </Link>
  ) : (
    <React.Fragment>{menuItem.title}</React.Fragment>
  );
  return (
    <Menu.Item key={menuItem.key} icon={menuItem.icon}>
      {content}
    </Menu.Item>
  );
};
const mapToSidebar = (item) => {
  if (item.children) {
    return (
      <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
        {item.children.map(renderMenuItem)}
      </Menu.SubMenu>
    );
  }
  return renderMenuItem(item);
};

export interface AdminLayoutProps {
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [collapsed, setCollapse] = useState(false);
  const toggleCollapse = () => setCollapse(!collapsed);

  const selected = flatSidebarDef.find((i) => i.to === router.pathname) || {
    key: 'dash'
  };

  return (
    <Layout style={{ height: '100vh', maxWidth: '100vw' }}>
      <Head>
        <title>Cards Admin{title ? ` :: ${title}` : ''}</title>
      </Head>
      <AdminNavigation trigger={null} collapsible collapsed={collapsed}>
        <div>
          <Logo width={32} style={{ margin: '24px' }} />
          <Menu theme="dark" defaultSelectedKeys={[selected.key]} mode="inline">
            {sidebarDefinition.map(mapToSidebar)}
            <Menu.Item
              key="toggleMenu"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapse}
            >
              {!collapsed ? 'Collapse' : ''}
            </Menu.Item>
          </Menu>
        </div>

        {user && (
          <div style={{ margin: 24 }}>
            <Badge>
              <Avatar
                size={40}
                src={S3_IMG(
                  {
                    model: 'user',
                    size: 'medium'
                  },
                  user.id,
                  user.profileImage
                )}
              />
            </Badge>
          </div>
        )}
      </AdminNavigation>
      <Layout>
        <Layout.Content style={{ margin: '30px' }}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
