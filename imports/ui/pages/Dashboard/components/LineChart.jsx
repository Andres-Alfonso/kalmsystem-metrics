import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los componentes necesarios para Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ customerId }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llama al método Meteor para obtener los datos
    Meteor.call('getUserAcesAndActiv', customerId, (error, result) => {
      if (error) {
        console.error('Error fetching user metrics:', error);
        setError(error);
      } else {
        const usersActiv = result.usersActiv || []; // Usuarios activos
        const userAces = result.userAces || []; // Accesos de usuarios
        const dates = result.labels || []; // Fechas (etiquetas)

        // Validar que los datos tengan la misma longitud
        if (usersActiv.length !== dates.length || userAces.length !== dates.length) {
          setError(new Error('Los datos proporcionados no coinciden con las etiquetas.'));
          return;
        }

        // Transforma los datos para Chart.js
        const data = {
          labels: dates, // Fechas para el eje X
          datasets: [
            {
              label: 'Usuarios Activos',
              data: usersActiv, // Datos para usuarios activos
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0, // Línea más suave
            },
            {
              label: 'Accesos de Usuarios',
              data: userAces, // Datos para accesos
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0, // Línea más suave
            },
          ],
        };
        setChartData(data);
      }
    });
  }, [customerId]);

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('myChart').getContext('2d');

      // Configura las opciones del gráfico
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Métricas de Usuarios (Últimos 7 días)',
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Fecha',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Eventos',
            },
          },
        },
      };

      // Destruye el gráfico anterior si existe
      if (window.myChart instanceof Chart) {
        window.myChart.destroy();
      }

      // Crea un nuevo gráfico
      window.myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options,
      });
    }
  }, [chartData]);

  // Manejo de errores
  if (error) {
    return <div>Error al cargar los datos: {error.message}</div>;
  }

  // Mostrar un mensaje de carga si no hay datos
  if (!chartData) {
    return <div>Cargando...</div>;
  }

  return <canvas id="myChart"></canvas>;
};

export default LineChart;





// // LineChart.jsx
// import React, { useState, useEffect } from 'react';
// import { Meteor } from 'meteor/meteor';
// import {
//   Chart,
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Registra los componentes necesarios para Chart.js
// Chart.register(
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineChart = ({ customerId = '2' }) => {
//   const [chartData, setChartData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Llama al método Meteor para obtener los datos
//     Meteor.call('getUserLoginAndClubMetrics', customerId, (error, result) => {
//       if (error) {
//         console.error('Error fetching user metrics:', error);
//         setError(error);
//       } else {
//         // Agregar todos los dates de todos los usuarios
//         const allDates = result.flatMap(user => 
//           user.dates.map(date => ({
//             date: new Date(date).toLocaleDateString(),
//             type: user.type
//           }))
//         );

//         // Transforma los datos para Chart.js
//         const groupedData = allDates.reduce((acc, item) => {
//           if (!acc[item.date]) {
//             acc[item.date] = { 
//               login: 0, 
//               club_ingress: 0 
//             };
//           }
//           acc[item.date][item.type]++;
//           return acc;
//         }, {});

//         // Ordenar las fechas
//         const sortedDates = Object.keys(groupedData).sort((a, b) => {
//           return new Date(a) - new Date(b);
//         });

//         const data = {
//           labels: sortedDates,
//           datasets: [
//             {
//               label: 'Inicios de Sesión',
//               data: sortedDates.map(date => groupedData[date].login),
//               borderColor: 'rgba(75, 192, 192, 1)',
//               backgroundColor: 'rgba(75, 192, 192, 0.2)',
//               tension: 0,
//             },
//             {
//               label: 'Ingresos a Clubes',
//               data: sortedDates.map(date => groupedData[date].club_ingress),
//               borderColor: 'rgba(255, 99, 132, 1)',
//               backgroundColor: 'rgba(255, 99, 132, 0.2)',
//               tension: 0,
//             }
//           ],
//         };
//         setChartData(data);
//       }
//     });
//   }, [customerId]);

//   useEffect(() => {
//     if (chartData) {
//       const ctx = document.getElementById('myChart').getContext('2d');

//       // Configura las opciones del gráfico
//       const options = {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//           title: {
//             display: true,
//             text: 'Métricas de Usuarios (Últimos 6 meses)',
//           },
//         },
//         scales: {
//           x: {
//             type: 'category',
//             title: {
//               display: true,
//               text: 'Fecha'
//             }
//           },
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: 'Número de Eventos'
//             }
//           },
//         },
//       };

//       // Destruye el gráfico anterior si existe
//       if (window.myChart instanceof Chart) {
//         window.myChart.destroy();
//       }

//       // Crea un nuevo gráfico
//       window.myChart = new Chart(ctx, {
//         type: 'line',
//         data: chartData,
//         options,
//       });
//     }
//   }, [chartData]);

//   // Manejo de errores
//   if (error) {
//     return <div>Error al cargar los datos: {error.message}</div>;
//   }

//   // Mostrar un mensaje de carga si no hay datos
//   if (!chartData) {
//     return <div>Cargando...</div>;
//   }

//   return <canvas id="myChart"></canvas>;
// };

// export default LineChart;



// import React, { useEffect, useRef } from 'react';
// import {
//   Chart,
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Registra los componentes necesarios
// Chart.register(
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineChart = () => {
//   const chartRef = useRef(null);
//   const chartInstanceRef = useRef(null);

//   useEffect(() => {
//     const ctx = chartRef.current.getContext('2d');

//     // Datos simulados
//     const data = {
//       labels: ['January', 'February', 'March', 'April', 'May'],
//       datasets: [
//         {
//           label: 'Usuarios Activos',
//           data: [50, 60, 70, 80, 90],
//           borderColor: 'rgba(75, 192, 192, 1)',
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           tension: 0.4, // Suaviza las líneas
//         },
//         {
//           label: 'Nuevos Usuarios',
//           data: [30, 40, 50, 60, 70],
//           borderColor: 'rgba(153, 102, 255, 1)',
//           backgroundColor: 'rgba(153, 102, 255, 0.2)',
//           tension: 0.4,
//         },
//       ],
//     };

//     const options = {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: 'Usuarios Activos y Nuevos',
//         },
//       },
//       scales: {
//         x: {
//           type: 'category', // Escala categórica
//         },
//         y: {
//           beginAtZero: true,
//         },
//       },
//     };

//     // Inicializa el gráfico y guarda la instancia
//     chartInstanceRef.current = new Chart(ctx, {
//       type: 'line',
//       data,
//       options,
//     });
//   }, []);

//   // Descargar el gráfico como imagen PNG
//   const downloadChartAsImage = () => {
//     const canvas = chartRef.current;
//     const link = document.createElement('a');
//     link.href = canvas.toDataURL('image/png'); // Convierte el canvas a imagen
//     link.download = 'chart.png'; // Nombre del archivo
//     link.click(); // Dispara la descarga
//   };

//   // Descargar los datos del gráfico como CSV
//   const downloadChartDataAsCSV = () => {
//     const chartInstance = chartInstanceRef.current;
//     if (!chartInstance) return;

//     const labels = chartInstance.data.labels; // Etiquetas (meses)
//     const datasets = chartInstance.data.datasets; // Conjuntos de datos

//     // Construye el contenido del archivo CSV
//     let csvContent = 'Etiqueta,' + datasets.map(ds => ds.label).join(',') + '\n';
//     labels.forEach((label, index) => {
//       const row = [label, ...datasets.map(ds => ds.data[index])];
//       csvContent += row.join(',') + '\n';
//     });

//     // Crea y descarga el archivo CSV
//     const link = document.createElement('a');
//     link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
//     link.download = 'chart-data.csv';
//     link.click();
//   };

//   return (
//     <div>
//       <canvas ref={chartRef}></canvas>
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={downloadChartAsImage} style={{ marginRight: '10px' }}>
//           Descargar Gráfico (PNG)
//         </button>
//         <button onClick={downloadChartDataAsCSV}>Descargar Datos (CSV)</button>
//       </div>
//     </div>
//   );
// };

// export default LineChart;
