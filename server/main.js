import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import './methods.js';

import jwt from 'jsonwebtoken';

// Configuración
const JWT_SECRET = 'Y747cAInNEcnjcBtyjDr9RterqI7mtZwQBMsMujQKvbMmRxTbEGN3EDgmVp5FvCX';

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });

  Meteor.methods({
    'auth.validateToken'(token) {
      try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Validar que el token no haya expirado
        if (decoded.exp < Date.now() / 1000) {
          throw new Meteor.Error('401', 'Token expirado');
        }
  
        // Retornar la información decodificada
        return {
          userId: decoded.sub,
          clientId: decoded.client_id,
          issuer: decoded.iss
        };
      } catch (error) {
        throw new Meteor.Error('401', 'Token inválido');
      }
    }
  });
});
