import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import AppLayout from '../components/app-layout';
import { UserContext } from '../lib/context/users';
import redirectAfterLogin from '../lib/utils/redirect-after-login';

const ConfirmAccountPage: React.FC = () => {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const { token } = router.query;
  useEffect(() => {
    axios
      .post('/api/v1/sessions/confirm-account', { token })
      .then((response) => {
        setUser(response.data);
        redirectAfterLogin(router);
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  }, [token]);
  return (
    <AppLayout title="Confirm Account">
      {error ? <div>{JSON.stringify(error)}</div> : null}
    </AppLayout>
  );
};

export default ConfirmAccountPage;
