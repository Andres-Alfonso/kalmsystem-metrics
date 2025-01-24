// imports/ui/components/ActiveSessions.jsx
import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

export const ActiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = () => {
      Meteor.call('auth.getActiveSessions', (error, result) => {
        setLoading(false);
        if (error) {
          setError(error.message);
        } else {
          setSessions(result);
        }
      });
    };

    fetchSessions();
    // Actualizar cada minuto
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4">Cargando sesiones...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sesiones Activas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Sesión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expira</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Huella Digital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {session.jti}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.clientId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.expiresAt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {session.fingerprint}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hay sesiones activas
          </div>
        )}
      </div>
    </div>
  );
};