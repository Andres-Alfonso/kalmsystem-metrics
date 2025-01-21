// server/methods.js
import { Meteor } from 'meteor/meteor';
// import { HTTP } from 'meteor/http';
import connection from './mysql-conection.js';

Meteor.methods({

  'getUserData': function () {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE client_id = 2 LIMIT 10', (err, results) => {
        if (err) {
          reject(new Meteor.Error('500', 'Error al obtener los datos.'));
        } else {
          resolve(results);
        }
      });
    });
  },
});

