import mysql from 'mysql2';

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
    
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Exportar la conexión para usarla en otras partes de la aplicación
export default connection;



const closeConnection = () => {
    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión: ', err);
      } else {
        console.log('Conexión cerrada');
      }
    });
  };