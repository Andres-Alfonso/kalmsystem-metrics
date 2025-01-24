import { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isValidToken: false,
    userData: null,
    error: null
  });

  const validateToken = async () => {
    try {
      // Verificar si hay una sesión existente
      const storedToken = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');

      if (storedToken && storedUserData) {
        const userData = JSON.parse(storedUserData);
        // Verificar si el token no ha expirado
        if (userData.exp * 1000 > Date.now()) {
          setAuthState({
            isLoading: false,
            isValidToken: true,
            userData,
            error: null
          });
          return;
        }
      }

      // Si no hay sesión válida, buscar token en URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const clientId = Number(urlParams.get('client_id'));

      if (!token || !clientId) {
        window.location.href = 'login';
        // throw new Error('Se requieren token y client_id para la autenticación');
      }

      // Validar el token con el servidor
      Meteor.call('auth.validateToken', token, (error, result) => {
        if (error) {
          setAuthState({
            isLoading: false,
            isValidToken: false,
            userData: null,
            error: error.message
          });
        } else {
          // Guardar datos en localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(result));

          setAuthState({
            isLoading: false,
            isValidToken: true,
            userData: result,
            error: null
          });

          // Limpiar URL después de procesar el token
          window.history.replaceState({}, '', window.location.pathname);
        }
      });

    } catch (error) {
      console.error('Error de autenticación:', error);
      setAuthState({
        isLoading: false,
        isValidToken: false,
        userData: null,
        error: error.message
      });
    }
  };

  const logout = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      Meteor.call('auth.logout', token);
    }
    
    // Limpiar almacenamiento local
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    setAuthState({
      isLoading: false,
      isValidToken: false,
      userData: null,
      error: null
    });

    // Redirigir al portal del cliente
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (storedUserData?.portalUrl) {
      window.location.href = storedUserData.portalUrl;
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return { ...authState, logout };
};