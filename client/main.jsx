import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import '../imports/ui/startup/client/routes'; // Importar rutas configuradas con FlowRouter
import { Session } from 'meteor/session';

Meteor.startup(() => {
  Session.setDefault('userToken', null);
  Session.setDefault('userData', null);
});
