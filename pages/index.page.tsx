import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import AppLayout from '../components/app-layout';
import Footer from '../components/layout/footer';
import Header from '../components/layout/header';
import SignUpModule from '../components/modules/sign-up';
import { UserContext } from '../lib/context/users';

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  if (process.browser && user !== null) {
    router.push('/home');
    return null;
  }
  return (
    <AppLayout title="Sign Up">
      <Header title="Create your account" />
      <SignUpModule />
      <Footer />
    </AppLayout>
  );
}
