import { Result } from 'antd';
import { NextPageContext } from 'next';
import React from 'react';

const codeMessages = {
  404: 'Sorry, the page you visited does not exist.'
};

const Error = ({ statusCode }) => {
  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh'
      }}
    >
      <Result
        status={statusCode}
        title={statusCode || 'Error'}
        subTitle={codeMessages[statusCode] || 'Sorry, something went wrong.'}
      />
    </section>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
