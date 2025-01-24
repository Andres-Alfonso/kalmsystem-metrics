// server/methods.js
import { Meteor } from 'meteor/meteor';
// import { HTTP } from 'meteor/http';
import connection from './mysql-conection.js';

Meteor.methods({
  // 'validateToken'(token) {
  //   try {
  //     // Verificar el token
  //     const decoded = jwt.verify(token, JWT_SECRET);
      
  //     // Verificar si el token ha expirado
  //     if (decoded.exp < Date.now() / 1000) {
  //       throw new Meteor.Error('token-expired', 'El token ha expirado');
  //     }

  //     // Retornar la información decodificada
  //     return {
  //       userId: decoded.sub,
  //       clientId: decoded.client_id,
  //       isValid: true
  //     };
  //   } catch (error) {
  //     throw new Meteor.Error('invalid-token', 'Token inválido o expirado');
  //   }
  // },

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

