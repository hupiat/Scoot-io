import React from 'react';
import {useMiddlewareContext} from '../commons/middleware/context';
import PageLogin from './PageLogin';
import PageRoadlineView from './PageRoadlineView';

export default function Pages() {
  const {user} = useMiddlewareContext();

  return (
    <>
      {!user && <PageLogin />}
      {user && <PageRoadlineView />}
    </>
  );
}
