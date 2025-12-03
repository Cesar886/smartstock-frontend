import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileText, ClipboardList } from 'lucide-react';
import SolicitudPedido from '../components/SolicitudPedido';
import MisPedidos from '../components/MisPedidos';

const PanelPedidos = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="space-y-6">
      {/* Header del Panel de Pedidos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Pedidos</h1>
            <p className="text-slate-600 mt-1">Gestiona y solicita tarjetas OneCard</p>
          </div>
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
            Pedidos
          </div>
        </div>
      </div>

      {/* Menú de navegación de Pedidos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/pedidos/solicitar"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/pedidos/solicitar') 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </Link>

          <Link
            to="/pedidos/lista"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
              isActive('/pedidos/lista') 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Mis Pedidos</span>
          </Link>
        </div>
      </div>

      {/* Contenido de las rutas */}
      <div>
        <Routes>
          <Route path="solicitar" element={<SolicitudPedido />} />
          <Route path="lista" element={<MisPedidos />} />
          <Route path="/" element={<SolicitudPedido />} />
        </Routes>
      </div>
    </div>
  );
};

export default PanelPedidos;
