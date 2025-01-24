// // server/methods.js
// import { Meteor } from 'meteor/meteor';
// import connection from './mysql-conection.js';
// import { check } from 'meteor/check';

// Meteor.methods({
//   'getUserData': function () {
//     return new Promise((resolve, reject) => {
//       connection.query('SELECT * FROM users WHERE client_id = 2 LIMIT 10', (err, results) => {
//         if (err) {
//           reject(new Meteor.Error('500', 'Error al obtener los datos.'));
//         } else {
//           resolve(results);
//         }
//       });
//     });
//   },

//   // 'getUserChartData': function () {
//   //   return new Promise((resolve, reject) => {
//   //     connection.query(
//   //       'SELECT month, active_users, new_users FROM user_metrics WHERE client_id = 2 ORDER BY month', 
//   //       (err, results) => {
//   //         if (err) {
//   //           reject(new Meteor.Error('500', 'Error al obtener los datos del gráfico.'));
//   //         } else {
//   //           resolve(results);
//   //         }
//   //       }
//   //     );
//   //   });
//   // },
//   'getUserLoginMetrics': function (customerId = '2') {
//     // Validate the customer ID
//     check(customerId, String);

//     return new Promise((resolve, reject) => {
//       const query = `
//         SELECT 
//           u.name, 
//           u.last_name, 
//           u.identification, 
//           u.email, 
//           login_dates
//         FROM users u
//         WHERE u.client_id = ?`;

//       connection.query(query, [customerId], (err, results) => {
//         if (err) {
//           console.error('Database query error:', err);
//           reject(new Meteor.Error('500', 'Error al obtener los datos de inicio de sesión.'));
//         } else {
//           // Procesar los login_dates
//           const processedData = results.map(row => {
//             // Parsear el JSON de login_dates
//             let loginDates = [];
//             try {
//               loginDates = JSON.parse(row.login_dates);
//             } catch (parseError) {
//               console.error('Error parsing login_dates:', parseError);
//               return null;
//             }

//             // Filtrar fechas de los últimos 6 meses
//             const sixMonthsAgo = new Date();
//             sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 1);

//             const filteredDates = loginDates
//               .map(date => new Date(date))
//               .filter(date => date >= sixMonthsAgo);

//             return {
//               name: row.name,
//               last_name: row.last_name,
//               identification: row.identification,
//               email: row.email,
//               login_dates: filteredDates
//             };
//           }).filter(item => item !== null);

//           resolve(processedData);
//         }
//       });
//     });
//   },

//   'getUserLoginAndClubMetrics': function (customerId = '2') {
//     // Validate the customer ID
//     check(customerId, String);

//     return new Promise((resolve, reject) => {
//       const query = `
//         (
//           SELECT 
//             u.name, 
//             u.last_name, 
//             u.identification, 
//             u.email, 
//             login_dates AS date,
//             'login' AS type
//           FROM users u
//           WHERE u.client_id = ?
//         )
//         UNION
//         (
//           SELECT 
//             u.name, 
//             u.last_name, 
//             u.identification, 
//             u.email, 
//             mci.created_at AS date,
//             'club_ingress' AS type
//           FROM metrics_club_ingresses mci
//           JOIN users u ON mci.user_id = u.id
//           JOIN clubs c ON mci.club_id = c.id
//           WHERE c.client_id = ?
//         )
//         ORDER BY date`;

//       connection.query(query, [customerId, customerId], (err, results) => {
//         if (err) {
//           console.error('Database query error:', err);
//           reject(new Meteor.Error('500', 'Error al obtener los datos de métricas.'));
//         } else {
//           // Procesar los resultados
//           const processedData = results.map(row => {
//             let dates = row.date;
            
//             // Si es login_dates (JSON array), parsearlo
//             if (typeof dates === 'string' && dates.startsWith('[')) {
//               try {
//                 dates = JSON.parse(dates);
//               } catch (parseError) {
//                 console.error('Error parsing dates:', parseError);
//                 dates = [];
//               }
//             } else {
//               // Si es un solo timestamp, convertirlo a array
//               dates = [dates];
//             }

//             // Filtrar fechas de los últimos 6 meses
//             const sixMonthsAgo = new Date();
//             sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 1);

//             const filteredDates = dates
//               .map(date => new Date(date))
//               .filter(date => date >= sixMonthsAgo);

//             return {
//               name: row.name,
//               last_name: row.last_name,
//               identification: row.identification,
//               email: row.email,
//               dates: filteredDates,
//               type: row.type
//             };
//           });

//           resolve(processedData);
//         }
//       });
//     });
//   },
// });



// server/methods.js
import { Meteor } from 'meteor/meteor';
import connection from './mysql-conection.js';
import { check } from 'meteor/check';
import moment from 'moment';

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

  'getUserAcesAndActiv': async function () {
    // Rango de fechas (últimos 7 días)
    const lastDate = moment().subtract(7, 'days').startOf('day');
    const nowDate = moment().endOf('day');

    // Inicializar arrays
    const userAces = [];
    const usersActiv = [];
    const dates = []; // Array para las fechas

    try {
      // Obtener usuarios de la base de datos para el cliente actual
      const users = await new Promise((resolve, reject) => {
        const clientId = 2; // Cambiar según sea necesario
        connection.query(
          'SELECT id, login_dates FROM users WHERE client_id = ?',
          [clientId],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
      });

      // Recorrer las fechas día a día
      for (
        let date = lastDate.clone();
        date.isSameOrBefore(nowDate);
        date.add(1, 'day')
      ) {
        const currentDate = date.format('YYYY-MM-DD');
        dates.push(currentDate); // Agregar la fecha al array de fechas

        let dailyAccesses = 0;
        let uniqueUsers = 0;
        const userIds = new Set();

        // Calcular `userAces` y `usersActiv`
        users.forEach((user) => {
          if (user.login_dates) {
            const loginDates = JSON.parse(user.login_dates); // Asegúrate de que `login_dates` sea JSON
            loginDates.forEach((loginDate) => {
              const loginDateFormatted = moment(loginDate).format('YYYY-MM-DD');
              if (loginDateFormatted === currentDate) {
                dailyAccesses++;
                if (!userIds.has(user.id)) {
                  uniqueUsers++;
                  userIds.add(user.id);
                }
              }
            });
          }
        });

        userAces.push(dailyAccesses);
        usersActiv.push(uniqueUsers);
      }

      console.log('userAces:', userAces);
      console.log('dates:', dates);

      // Devolver los datos calculados, incluyendo las fechas
      return {
        userAces,
        usersActiv,
        labels: dates, // Incluir las fechas en la respuesta
      };
    } catch (error) {
      throw new Meteor.Error('500', 'Error al obtener datos: ' + error.message);
    }
}
});

