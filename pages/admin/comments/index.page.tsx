import React from 'react';

import ListingDashboard from '../../../components/admin-layout/listing-dashboard';
import CommentCellRenderer from '../../../components/cell-renders/comment-renderer';

const CommentsDashboard = () => {
  return (
    <ListingDashboard
      modelPlural="comments"
      modelSingular="comment"
      gridProps={{
        frameworkComponents: {
          commentCellRenderer: CommentCellRenderer
        }
      }}
      columnDefs={[
        {
          field: 'body',
          width: 600,
          cellRenderer: 'commentCellRenderer',
          sortable: false,
          filter: false
        },
        { field: 'gameId', width: 70 },
        { field: 'userId', width: 70 }
      ]}
      addAction={false}
    />
  );
};

export default CommentsDashboard;
