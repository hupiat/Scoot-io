import React from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';

export default function Pages() {
  const {user} = useMiddlewareContext();

  return <>{!user && <PageLogin />}</>;
}
