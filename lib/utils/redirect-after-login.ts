import { NextRouter } from 'next/router';

export default function redirectAfterLogin(router: NextRouter) {
  router.push('/home');
}
