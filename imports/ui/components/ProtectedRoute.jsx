import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

export const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Obtener el token de la URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Llamar al método del servidor para validar el token
        const result = await new Promise((resolve, reject) => {
          Meteor.call('auth.validateToken', token, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });

        // Guardar la información del usuario en el estado de la aplicación
        // Puedes usar React Context o Redux para esto
        localStorage.setItem('userInfo', JSON.stringify(result));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error validando token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [location]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};