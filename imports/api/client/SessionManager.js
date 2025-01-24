import { Meteor } from 'meteor/meteor';
import { jwtDecode } from 'jwt-decode';

export const SessionManager = {
  // Inicializar la sesión con el token
  initSession(token, clientId) {
    if (!token || !clientId) return false;
    
    try {
      const decoded = jwtDecode(token);
      
      // Guardar en la sesión de Meteor
      Session.set('userToken', token);
      Session.set('clientId', clientId);
      Session.set('userData', {
        id: decoded.sub,
        email: decoded.username,
        clientId: decoded.client_id,
        portalUrl: decoded.portal_url,
        exp: decoded.exp
      });
      
      return true;
    } catch (error) {
      console.error('Error al inicializar sesión:', error);
      return false;
    }
  },

  // Verificar si la sesión está activa y válida
  checkSession() {
    const token = Session.get('userToken');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Cerrar sesión
  clearSession() {
    Session.clear();
  },

  // Obtener datos del usuario
  getUserData() {
    return Session.get('userData');
  }
};