import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumenGeneral from './components/ResumenGeneral';
import DashboardRendimiento from './components/DashboardRendimiento';
import SolicitudPedido from './components/SolicitudPedido';
import SolicitudPedidoConValidacion from './components/SolicitudPedidoConValidacion';
import ListaPedidos from './components/ListaPedidos';
import AlertasStock from './components/AlertasStock';
import TrackingCliente from './components/TrackingCliente';
import DashboardEnvios from './components/DashboardEnvios';
import GestionEnvios from './components/GestionEnvios';
import InventarioCompleto from './components/InventarioCompleto';
import SistemaTickets from './components/SistemaTickets';
import EstadoConexion from './components/EstadoConexion';
import { NotificacionProvider } from './components/Notificaciones';

function App() {
  return (
    <NotificacionProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<ResumenGeneral />} />
              <Route path="/dashboard" element={<DashboardRendimiento />} />
              <Route path="/solicitar" element={<SolicitudPedido />} />
              <Route path="/solicitar-validado" element={<SolicitudPedidoConValidacion />} />
              <Route path="/pedidos" element={<ListaPedidos />} />
              <Route path="/alertas" element={<AlertasStock />} />
              <Route path="/tracking" element={<TrackingCliente />} />
              <Route path="/envios" element={<DashboardEnvios />} />
              <Route path="/gestion-envios" element={<GestionEnvios />} />
              <Route path="/inventario" element={<InventarioCompleto />} />
              <Route path="/tickets" element={<SistemaTickets clienteId={1} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NotificacionProvider>
  );
}

export default App;
