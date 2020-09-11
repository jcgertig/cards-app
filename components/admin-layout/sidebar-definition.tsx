import {
  AppstoreAddOutlined,
  IdcardOutlined,
  MessageOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import React from 'react';

const sidebarDefinition = [
  {
    key: 'dash',
    icon: <PieChartOutlined />,
    to: '/admin/',
    title: 'Dashboard'
  },
  {
    key: 'comments',
    icon: <MessageOutlined />,
    to: '/admin/comments',
    title: 'Comments'
  },
  {
    key: 'games',
    icon: <AppstoreAddOutlined />,
    title: 'Games',
    children: [
      {
        key: 'all-games',
        to: '/admin/games',
        title: 'All Games'
      },
      {
        key: 'add-game',
        to: '/admin/games/add',
        title: 'Add Game'
      }
    ]
  },
  {
    key: 'users',
    icon: <IdcardOutlined />,
    title: 'Users',
    children: [
      {
        key: 'all-users',
        to: '/admin/users',
        title: 'All Users'
      },
      {
        key: 'add-user',
        to: '/admin/users/add',
        title: 'Add User'
      }
    ]
  }
];

export default sidebarDefinition;
