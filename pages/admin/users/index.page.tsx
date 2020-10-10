import { useRouter } from 'next/router';
import React from 'react';

import ListingDashboard from '../../../components/admin-layout/listing-dashboard';
import ImageCellRenderer from '../../../components/cell-renders/image-renderer';

const UsersDashboard = () => {
  const router = useRouter();

  return (
    <ListingDashboard
      modelPlural="users"
      modelSingular="user"
      gridProps={{
        context: { router },
        frameworkComponents: {
          imageCellRenderer: ImageCellRenderer
        }
      }}
      columnDefs={[
        {
          field: 'profileImage',
          width: 50,
          headerName: '',
          cellRenderer: 'imageCellRenderer',
          cellRendererParams: {
            model: 'user',
            to: ({ id }) => `/admin/users/${id}`
          },
          sortable: false,
          filter: false,
          cellStyle: { padding: 0 }
        },
        { field: 'firstName' },
        { field: 'lastName' },
        { field: 'username' },
        { field: 'signInCount' },
        { field: 'lastSignInAt' },
        { field: 'role' },
        { field: 'active' },
        { field: 'resetPasswordToken' },
        { field: 'resetPasswordSentAt' },
        { field: 'confirmedAt' },
        { field: 'confirmationSentAt' }
      ]}
    />
  );
};

export default UsersDashboard;
