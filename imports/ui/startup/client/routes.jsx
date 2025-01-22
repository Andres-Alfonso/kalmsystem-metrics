import React from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter'; // Herramienta para montar React en las rutas
import { Dashboard } from '../../pages/Dashboard';
// import Login from './pages/Login';

// Definir rutas
FlowRouter.route('/', {
  name: 'Dashboard',
  action() {
    mount(Dashboard); // Montar el componente de React
  },
});

// FlowRouter.notFound = {
//     action() {
//       import('./pages/NotFound').then(({ default: NotFound }) => {
//         mount(NotFound);
//       });
//     },
//   };