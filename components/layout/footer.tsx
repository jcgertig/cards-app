import { Col, Row } from 'antd';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

import { device } from '../../lib/theme';

export interface LayoutProps {
  disclaimer?: string;
}

const FooterLinksContainer = styled.ul`
  padding-left: 0;
  list-style: none;
  display: flex;
  > li {
    margin-right: 24px;
  }
  > li:last-child {
    margin-right: 0;
  }
  a {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.dark};
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const FooterLinks = [
  { name: 'Terms', url: '#' },
  { name: 'Privacy', url: '#' },
  { name: 'News', url: '#' },
  { name: 'About', url: '#' }
];

const FooterContent = styled(Col)`
  display: flex;
  flex-direction: column;
  @media ${device.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Footer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Row
      gutter={[16, 16]}
      style={{ width: '100%', margin: 0, padding: '32px 0' }}
    >
      <FooterContent xs={{ span: 22, offset: 1 }} lg={{ span: 22, offset: 1 }}>
        <FooterLinksContainer>
          {FooterLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.url}>
                <a>{link.name}</a>
              </Link>
            </li>
          ))}
        </FooterLinksContainer>

        <p>&copy; Cards App 2020</p>
      </FooterContent>
      {children}
    </Row>
  );
};

export default Footer;
