import { PlusOutlined } from '@ant-design/icons';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button, PageHeader } from 'antd';
import axios from 'axios';
import { capitalize } from 'lodash';
import Link from 'next/link';
import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../lib/context/users';
import AdminLayout from './index';

interface ListingDashboardProps {
  modelSingular: string;
  modelPlural: string;
  columnDefs?: Array<ColDef | ColGroupDef>;
  addAction?: boolean;
  gridProps?: GridOptions;
}

const ListingDashboard: React.FC<ListingDashboardProps> = ({
  modelPlural,
  modelSingular,
  columnDefs = [],
  addAction = true,
  gridProps = {}
}) => {
  const { user } = useContext(UserContext);
  const [dataList, setDataList] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const capsSingular = capitalize(modelSingular);
  const plural = modelPlural.toLocaleLowerCase();
  const capsPlural = capitalize(modelPlural);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`/api/v1/${plural}`, {
          headers: { authorization: `Bearer ${user?.authToken}` }
        });
        setDataList(response.data);
      } catch (error) {
        console.error(`Failed to load list for ${plural}: `, error);
        setError(true);
      }
    };

    if (dataList === null && error !== true) fetchData();
  }, [dataList, error]);

  return (
    <AdminLayout title={capsPlural}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader
          onBack={() => Router.back()}
          title={`${capsPlural} Dashboard`}
          style={{ padding: 0, marginBottom: '16px' }}
          extra={
            addAction ? (
              <Link href={`/admin/${plural}/add`}>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<PlusOutlined />}
                >
                  New {capsSingular}
                </Button>
              </Link>
            ) : (
              undefined
            )
          }
        />
        <div style={{ flex: 1 }}>
          <div
            className="ag-theme-balham"
            style={{
              position: 'relative',
              width: '100%',
              height: 'calc(100vh - 130px)'
            }}
          >
            <AgGridReact
              rowHeight={50}
              {...gridProps}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
              columnDefs={[
                ...columnDefs,
                { field: 'id', width: 70 },
                { field: 'createdAt' },
                { field: 'updatedAt' }
              ]}
              rowData={dataList}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListingDashboard;
