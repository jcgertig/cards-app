import {
  BellOutlined,
  CaretDownOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Col, Drawer, Dropdown, Row } from 'antd';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { H3 } from '../../components/layout/styles';
import { S3_IMG } from '../../lib/constants';
import { UserContext } from '../../lib/context/users';
import { device } from '../../lib/theme';
import GlobalMenu from '../global/menu';
import Logo from '../icons/logo';

export interface HeaderProps {
  preTitle?: string;
  postTitle?: string;
  title?: string | React.ReactNode;
  menu?: any;
  wide?: boolean;
  light?: boolean;
  logo?: boolean;
  sticky?: boolean;
  fixedAt?: number;
}

const HeaderContainer = styled(
  ({ feed: _1, sticky: _2, positionAtTop: _3, ...props }) => <Row {...props} />
)`
  width: 100%;
  margin: 0 !important;
  display: flex;
  height: 70px;
  align-items: center;
  h3 {
    margin-bottom: 0;
  }
  transition: 0.2s all ease-in-out;

  ${({ sticky, positionAtTop }) =>
    sticky && !positionAtTop
      ? `position: fixed; top: 0; z-index: 100; background-color: white;
        box-shadow: 5px 8px 24px 5px rgba(208,216,243,0.6);
      `
      : null}
  ${({ feed }) => (feed ? 'background-color: white' : null)}
`;

const HeaderLeftSide = styled(Col)`
  display: flex;
  padding: 0 16px 0 8px !important;
  > svg {
    display: none;

    @media ${device.mobileL} {
      display: block;
    }
  }
  @media ${device.mobileL} {
    padding: 0 16px !important;
  }
`;

const MenuDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 320px !important;
    @media ${device.mobileM} {
      width: 360px !important;
    }
  }
`;

const TitleContainer = styled(({ lightTheme: _, ...rest }) => <H3 {...rest} />)`
  color: ${({ lightTheme }) => (lightTheme == true ? 'white' : 'inherit')};
  font-size: 18px;
  display: flex;
  flex-flow: column nowrap;
  ${({ logo }) => (!logo ? 'margin-left: 0;' : null)}

  &:after {
    margin: 0;
    border: none;
  }

  @media ${device.mobileL} {
    font-size: 24px;
  }
`;

const RightSideNavigation = styled(Col)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  padding: 0 16px !important;
`;

const HeaderButton = styled(({ avatar: _, ...props }) => <Button {...props} />)`
  margin-left: 16px;
  background-color: ${({ sticky }) => (sticky ? '#eee' : 'white')};
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .anticon.anticon-caret-down {
    margin-top: 4px;
  }
  .anticon.anticon-caret-down > svg {
    width: 28px;
    height: 28px;
  }
  &:hover {
    background-color: ${({ sticky }) => (sticky ? 'white' : '#eee')} !important;
  }

  ${({ avatar }) =>
    avatar
      ? `
    display: none !important;
    @media ${device.tablet} { display: flex !important; }
  `
      : null}
`;

const Header: React.FC<HeaderProps> = ({
  children,
  preTitle = '',
  postTitle = '',
  title = '',
  menu,
  wide = false,
  light = false,
  logo = true,
  sticky = true,
  fixedAt = 340
}) => {
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);
  const [scrollAtTop, setScrollAtTop] = useState<boolean>(() =>
    process.browser ? window.scrollY === 0 : true
  );

  useEffect(() => {
    const handler = () => {
      if (window.scrollY > fixedAt && scrollAtTop) {
        setScrollAtTop(false);
      } else if (window.scrollY <= fixedAt && !scrollAtTop) {
        setScrollAtTop(true);
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [scrollAtTop]);

  const attachedToTop = sticky && !scrollAtTop;

  return (
    <HeaderContainer
      gutter={[16, 16]}
      align="middle"
      justify="space-between"
      sticky={sticky}
      positionAtTop={scrollAtTop}
      feed={fixedAt === 0}
    >
      <HeaderLeftSide
        xs={wide ? { span: 18, offset: 0 } : { span: 17, offset: 1 }}
        sm={wide ? { span: 18, offset: 0 } : { span: 16, offset: 2 }}
        style={{ display: 'flex' }}
      >
        {logo || attachedToTop ? (
          <Link href="/">
            <a>
              <Logo
                width={32}
                style={
                  wide ? { margin: '0 16px 0 0' } : { marginRight: '16px' }
                }
              />
            </a>
          </Link>
        ) : null}

        <TitleContainer lightTheme={light} logo={logo}>
          {preTitle ? (
            <div
              style={{
                color: '#ccc',
                fontSize: '40%',
                fontFamily: 'Roboto',
                fontWeight: 400,
                textTransform: 'uppercase',
                marginBottom: 2
              }}
            >
              {preTitle.toLowerCase()}
            </div>
          ) : null}
          {title}
          {postTitle ? (
            <div
              style={{
                color: '#ccc',
                fontSize: '60%',
                fontFamily: 'Roboto',
                fontWeight: 400
              }}
            >
              {postTitle.toLowerCase()}
            </div>
          ) : null}
        </TitleContainer>
      </HeaderLeftSide>
      <RightSideNavigation
        xs={{ span: 6 }}
        sm={wide ? { span: 6, pull: 0 } : { span: 6, pull: 2 }}
      >
        {user ? (
          <Badge count={23}>
            <HeaderButton
              shape="circle"
              size="large"
              icon={<BellOutlined />}
              onClick={(e) => e.preventDefault()}
              sticky={sticky}
            />
          </Badge>
        ) : null}

        {user && (
          <HeaderButton
            size="large"
            shape="round"
            style={{
              padding: '0 16px 0 8px',
              display: 'flex',
              alignItems: 'center'
            }}
            sticky={sticky}
            icon={
              <Avatar
                style={{ cursor: 'pointer', marginRight: 8 }}
                size={28}
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
            avatar
          >
            {user.fullName} @{user.username}
          </HeaderButton>
        )}

        <Dropdown
          overlay={<GlobalMenu />}
          placement="bottomRight"
          trigger={['click']}
          arrow
        >
          <HeaderButton
            shape="circle"
            size="large"
            icon={<CaretDownOutlined />}
            onClick={(e) => e.preventDefault()}
            sticky={sticky}
            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
          />
        </Dropdown>
      </RightSideNavigation>

      {children}

      {menu ? (
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<MenuFoldOutlined />}
          onClick={showDrawer}
          style={{ marginLeft: 16 }}
        />
      ) : null}

      <MenuDrawer
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
      >
        <Logo width={74} />
        {menu}
      </MenuDrawer>
    </HeaderContainer>
  );
};

export default Header;
