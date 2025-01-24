import React from 'react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Página no encontrada</p>
        <p className="text-gray-500 mb-6">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};
