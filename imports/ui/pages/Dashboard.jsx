import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Dashboard = () => {
  const { isLoading, isValidToken, userData, error, logout } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => {
          // Redirigir al portal del cliente
          if (userData?.portalUrl) {
            window.location.href = userData.portalUrl;
          } else {
            window.location.reload();
          }
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {isValidToken ? `Bienvenido, ${userData?.email || 'Usuario'}` : 'Acceso no autorizado'}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {isValidToken ? 'Sesión verificada correctamente' : 'Por favor, inicie sesión'}
                  </p>
                </div>
                {isValidToken && (
                  <div className="mt-5 sm:mt-0 sm:ml-6">
                    <button
                      onClick={logout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Volver al Portal
                    </button>
                  </div>
                )}
              </div>
              {isValidToken && userData && (
                <div className="mt-6">
                  <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        ID de Cliente
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {userData.clientId}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Email
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {userData.email}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Expira en
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {new Date(userData.exp * 1000).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};