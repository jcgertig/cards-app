import { Card, Col, Row, Tag } from 'antd';
import axios from 'axios';
import dynamic from 'next/dynamic';
import DefaultErrorPage from 'next/error';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { IUser } from '../api/controllers/user';
import AppLayout from '../components/app-layout';
import Footer from '../components/layout/footer';
import Header from '../components/layout/header';
import { H3 } from '../components/layout/styles';
import Loader from '../components/loader';
import { UserContext } from '../lib/context/users';
import { UserRolesMapping } from '../lib/enum-mappings';
import { device } from '../lib/theme';

const AccountProfileSettings = dynamic(() => import('./account/profile'), {
  ssr: false
});

const AccountPasswordSettings = dynamic(() => import('./account/password'), {
  ssr: false
});

const AccountPreferences = dynamic(() => import('./account/preferences'), {
  ssr: false
});

const tabList = [
  { key: 'profile', tab: 'Edit Profile' },
  { key: 'preferences', tab: 'Preferences' },
  { key: 'password', tab: 'Password' },
  { key: 'logout', tab: 'Log Out' }
];

const Logout: React.FC<any> = () => {
  const { setUser } = useContext(UserContext);
  setUser(null);
  return <div></div>;
};

const contentList = {
  profile: AccountProfileSettings,
  password: AccountPasswordSettings,
  preferences: AccountPreferences,
  logout: Logout
};

const UserExtraProperties = styled.p`
  display: none;
  @media ${device.mobileL} {
    display: flex;
  }
`;

export interface AccountPageProps {
  userData: IUser;
}

const SettingsPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const [current, setCurrent] = useState('profile');
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`/api/v1/users/${user?.id}`, {
        headers: { authentication: `Bearer ${user?.authToken}` }
      });
      setUserData(response.data);
    }
    if (user !== null) {
      getData();
    }
  }, [user]);

  if (user === null) {
    if (process.browser) {
      return (
        <AppLayout title="404">
          <DefaultErrorPage statusCode={404} />
        </AppLayout>
      );
    }
    return null;
  }

  if (!userData) {
    return <Loader />;
  }

  const onTabChange = (key: any) => {
    setCurrent(key);
  };

  const Content = contentList[current];

  return (
    <AppLayout title="Settings">
      <Header wide title="Settings" />

      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col xs={{ span: 22, offset: 1 }}>
          <Card
            style={{ width: '100%' }}
            title={
              <>
                <H3 vMargin={0}>{`@${userData.username}`}</H3>
                <small>
                  {userData.firstName} {userData.lastName}
                </small>
              </>
            }
            extra={
              <UserExtraProperties>
                {userData.role !== 0 && (
                  <Tag style={{ marginRight: 0 }}>
                    {(UserRolesMapping as any)[user.role]}
                  </Tag>
                )}
              </UserExtraProperties>
            }
            tabList={tabList}
            activeTabKey={current}
            onTabChange={onTabChange}
            hoverable
          >
            <Content userData={userData} />
          </Card>
        </Col>
      </Row>

      <Footer />
    </AppLayout>
  );
};

export default SettingsPage;
