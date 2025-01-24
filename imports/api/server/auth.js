import { Meteor } from 'meteor/meteor';
import jwt from 'jsonwebtoken';

// Colección para almacenar las sesiones activas
export const ActiveSessions = new Mongo.Collection('active_sessions');

const JWT_SECRET = '';

Meteor.methods({
  'auth.validateToken': async function(token) {
    try {
      // Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256']
      });
      
      // Verificar si el token ya fue usado
      const existingSession = await ActiveSessions.findOneAsync({
        jti: decoded.jti
      });

      if (existingSession) {
        throw new Meteor.Error('token-used', 'Token ya utilizado');
      }

      // Guardar la sesión activa
      ActiveSessions.insertAsync({
        jti: decoded.jti,
        userId: decoded.sub,
        clientId: decoded.client_id,
        fingerprint: decoded.fingerprint,
        createdAt: new Date(),
        expiresAt: new Date(decoded.exp * 1000)
      });

      return {
        userId: decoded.sub,
        email: decoded.username,
        clientId: decoded.client_id,
        portalUrl: decoded.iss,
        exp: decoded.exp
      };
    } catch (error) {
      throw new Meteor.Error('invalid-token', error.message);
    }
  },

  async 'auth.logout'(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.jti) {
        await ActiveSessions.removeAsync({ jti: decoded.jti });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

    async 'auth.getActiveSessions'() {
        try {
        const sessions = await ActiveSessions.find({}, {
            sort: { createdAt: -1 }
        }).fetchAsync();
        
        return sessions.map(session => ({
            ...session,
            createdAt: session.createdAt.toLocaleString(),
            expiresAt: session.expiresAt.toLocaleString()
        }));
        } catch (error) {
        throw new Meteor.Error('fetch-error', 'Error al obtener las sesiones activas');
        }
    }
});

// Limpiar sesiones expiradas periódicamente
Meteor.setInterval(async () => {
  try {
    await ActiveSessions.removeAsync({
      expiresAt: { $lt: new Date() }
    });
  } catch (error) {
    console.error('Error al limpiar sesiones expiradas:', error);
  }
}, 60000);

// Publicación de sesiones activas (si necesitas acceder desde el cliente)
Meteor.publish('activeSessions', function() {
  if (!this.userId) return this.ready();
  
  return ActiveSessions.find({
    userId: this.userId
  });
});