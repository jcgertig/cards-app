import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import AppLayout from '../components/app-layout';
import Header from '../components/layout/header';
import LoginModule from '../components/modules/login';
import { UserContext } from '../lib/context/users';

const LoginPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  if (process.browser && user !== null) {
    router.push('/home');
    return null;
  }
  return (
    <AppLayout title="Login">
      <Header title="Log in to Cards App" />
      <LoginModule />
      <div style={{ textAlign: 'center' }}>
        <Link href="/sign-up">
          <a>Sign up for Cards App</a>
        </Link>
      </div>
    </AppLayout>
  );
};

export default LoginPage;
