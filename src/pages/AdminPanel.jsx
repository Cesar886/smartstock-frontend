import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Truck, MapPin, AlertTriangle, FileCheck } from 'lucide-react';
import DashboardRendimiento from '../components/DashboardRendimiento';
import Inventario from '../components/Inventario';
import DashboardEnvios from '../components/DashboardEnvios';
import GestionEnvios from '../components/GestionEnvios';
import TrackingCliente from '../components/TrackingCliente';
import AlertasStock from '../components/AlertasStock';
import ListaPedidos from '../components/ListaPedidos';

const AdminPanel = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="space-y-6">
      {/* Header del Panel de Administración */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-600 mt-1">Gestión completa del sistema SmartStock</p>
          </div>
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
            Admin
          </div>
        </div>
      </div>

      {/* Menú de navegación del Admin */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/rendimiento"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/rendimiento') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Rendimiento</span>
          </Link>

          <Link
            to="/admin/inventario"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/inventario') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventario</span>
          </Link>

          <Link
            to="/admin/envios"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/envios') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Dashboard Envíos</span>
          </Link>

          <Link
            to="/admin/gestion-envios"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/gestion-envios') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Gestión Pedidos</span>
          </Link>

          <Link
            to="/admin/tracking"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/tracking') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Tracking</span>
          </Link>

          <Link
            to="/admin/alertas"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/alertas') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alertas</span>
          </Link>

          <Link
            to="/admin/gestion-pedidos"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/admin/gestion-pedidos') 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Aprobar Pedidos</span>
          </Link>
        </div>
      </div>

      {/* Contenido de las rutas */}
      <div>
        <Routes>
          <Route path="rendimiento" element={<DashboardRendimiento />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="envios" element={<DashboardEnvios />} />
          <Route path="gestion-envios" element={<GestionEnvios />} />
          <Route path="tracking" element={<TrackingCliente />} />
          <Route path="alertas" element={<AlertasStock />} />
          <Route path="gestion-pedidos" element={<ListaPedidos />} />
          <Route path="/" element={<DashboardRendimiento />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
