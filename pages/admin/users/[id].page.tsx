import { useRouter } from 'next/router';
import React from 'react';

import CreateOrEditUsers from './create-or-edit';

const AdminEditUser: React.FC = () => {
  const router = useRouter();
  return <CreateOrEditUsers id={parseInt(router.query.id as string, 10)} />;
};

export default AdminEditUser;
