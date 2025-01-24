import React from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter';
import { Dashboard } from '../../pages/Dashboard';
import { ActiveSessions } from '../../components/ActiveSessions';
import { PrincipalDashboard } from '../../pages/Dashboard/PrincipalDashboard';
// import { SessionManager } from '../../../../imports/api/client/SessionManager';

// Middleware de autenticación
const requireAuth = (context, redirect) => {
  const userData = Session.get('userData');
  const token = Session.get('userToken');
  
  if (!token || !userData || userData.exp * 1000 < Date.now()) {
    const portalUrl = userData?.portalUrl;
    if (portalUrl) {
      window.location.href = portalUrl;
    } else {
      redirect('/login');
    }
  }
};


FlowRouter.route('/', {
  name: 'Home',
  // triggersEnter: [requireAuth],
  action() {
    mount(Dashboard);
  },
});

FlowRouter.route('/dashboard', {
  name: 'Dashboard',
  // triggersEnter: [requireAuth],
  action() {
    mount(PrincipalDashboard);
  },
});

FlowRouter.route('/login', {
  name: 'Login',
  action() {
    import('../../pages/Login').then(({ Login }) => {
      mount(Login);
    });
  },
});

FlowRouter.notFound = {
  action() {
    import('../../pages/NotFound').then(({ NotFound }) => {
      mount(NotFound);
    });
  },
};

FlowRouter.route('/sessions', {
  name: 'ActiveSessions',
  // triggersEnter: [requireAuth],
  action() {
    mount(ActiveSessions);
  },
});