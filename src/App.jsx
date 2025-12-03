import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumenGeneral from './components/ResumenGeneral';
import AdminPanel from './pages/AdminPanel';
import PanelPedidos from './pages/PanelPedidos';
import Login from './components/Login';
import RegistroCliente from './components/RegistroCliente';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificacionProvider } from './components/Notificaciones';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <NotificacionProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/clientes/nuevo" element={<RegistroCliente />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <ResumenGeneral />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pedidos/*" 
                  element={
                    <ProtectedRoute>
                      <PanelPedidos />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificacionProvider>
    </AuthProvider>
  );
}

export default App;
