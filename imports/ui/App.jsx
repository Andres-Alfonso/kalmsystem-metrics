import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {}
]);

export const App = () => {
  return (
    <RouterProvider router={router}/>    
  );
};