import React from 'react';

import AppLayout from '../components/app-layout';
import Header from '../components/layout/header';
import SignUpModule from '../components/modules/sign-up';

const SignUpPage: React.FC = () => {
  return (
    <AppLayout title="Sign Up">
      <Header title="Create your account" />
      <SignUpModule />
    </AppLayout>
  );
};

export default SignUpPage;
