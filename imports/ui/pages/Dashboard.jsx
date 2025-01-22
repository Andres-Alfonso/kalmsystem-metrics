import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

export const Dashboard = () => {
  const [authState, setAuthState] = useState({
    isValidToken: false,
    userData: null,
    error: null
  });

  useEffect(() => {
    const validateToken = () => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
          const clientId = urlParams.get('client_id');
      
          if (!token || !clientId) {
            throw new Error('Token o client_id faltantes');
          }
      
          // Usa la misma clave secreta que en Laravel
          const secretKey = 'Y747cAInNEcnjcBtyjDr9RterqI7mtZwQBMsMujQKvbMmRxTbEGN3EDgmVp5FvCX';
          
          // Verifica el token
          let decoded;
          try {
            decoded = jwt.verify(token, secretKey);
          } catch (verifyError) {
            console.error("Error al verificar el token:", verifyError);
            throw new Error('Token inválido o expirado');
          }
          
          console.log('Token decodificado:', decoded); // Para debugging
      
          if (!decoded || !decoded.client_id) {
            throw new Error('El token no contiene información válida del cliente');
          }
      
          // Validar el client_id
          if (decoded.client_id !== clientId) {
            throw new Error('Client ID no coincide');
          }
      
          setAuthState({
            isValidToken: true,
            userData: decoded,
            error: null
          });
      
        } catch (error) {
          console.error('Error completo:', error);
          setAuthState({
            isValidToken: false,
            userData: null,
            error: error.message || 'Error al validar el token'
          });
        }
      };      

    validateToken();
  }, []);

  // Renderizado cuando hay error
  if (authState.error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error de autenticación: {authState.error}</p>
        <p className="text-sm text-red-600">Por favor, intente iniciar sesión nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          {authState.isValidToken ? (
            <div>
              <h3 className="text-3xl text-gray-900 font-bold">
                Bienvenido, Usuario {authState.userData?.sub}
              </h3>
              <p className="mt-2 text-gray-600">
                Sesión verificada correctamente
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-3xl text-gray-900 font-bold">
                Validando autenticación...
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};