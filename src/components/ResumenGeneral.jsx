import React, { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, Truck } from 'lucide-react';
import { inventarioService, contratosService, pedidosService, alertasService } from '../services/api';

const ResumenGeneral = () => {
  const [stats, setStats] = useState({
    inventario: { total: 0, disponible: 0, transito: 0 },
    contratos: { activos: 0, proximos_vencer: 0 },
    pedidos: { pendientes: 0, aprobados: 0 },
    alertas: { criticas: 0, total: 0 }
  });
  const [loading, setLoading] = useState(true);

  const cargarResumen = async () => {
    try {
      const [inventarioRes, contratosRes, pedidosRes, alertasRes] = await Promise.all([
        inventarioService.getResumen(),
        contratosService.getResumen(),
        pedidosService.getAll(),
        alertasService.getNoResueltas()
      ]);

      console.log('Datos recibidos:', {
        inventario: inventarioRes.data,
        contratos: contratosRes.data,
        pedidos: pedidosRes.data,
        alertas: alertasRes.data
      });

      const pedidosPendientes = pedidosRes.data.filter(p => p.estado === 'Pendiente').length;
      const pedidosAprobados = pedidosRes.data.filter(p => p.estado === 'Aprobado').length;
      const alertasCriticas = alertasRes.data.filter(a => a.nivel === 'Crítico').length;

      setStats({
        inventario: {
          total: parseInt(inventarioRes.data.total_disponible) + parseInt(inventarioRes.data.total_en_transito),
          disponible: parseInt(inventarioRes.data.total_disponible),
          transito: parseInt(inventarioRes.data.total_en_transito)
        },
        contratos: {
          activos: parseInt(contratosRes.data.total_contratos),
          proximos_vencer: parseInt(contratosRes.data.total_activos) || 0
        },
        pedidos: { pendientes: pedidosPendientes, aprobados: pedidosAprobados },
        alertas: { criticas: alertasCriticas, total: alertasRes.data.length }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar resumen:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResumen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando resumen...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-600 mt-2">Resumen general del sistema SmartStock</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Inventario */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">INVENTARIO</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.inventario.total?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Disponible:</span>
              <span className="font-semibold text-green-600">
                {stats.inventario.disponible?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>En Tránsito:</span>
              <span className="font-semibold text-blue-600">
                {stats.inventario.transito?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Contratos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 text-green-500" />
            <span className="text-sm font-medium text-gray-500">CONTRATOS</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.contratos.activos || '0'}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>{stats.contratos.proximos_vencer || '0'} próximos a vencer</span>
            </div>
          </div>
        </div>

        {/* Pedidos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <Truck className="w-10 h-10 text-purple-500" />
            <span className="text-sm font-medium text-gray-500">PEDIDOS</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.pedidos.pendientes || '0'}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Pendientes:</span>
              <span className="font-semibold text-orange-600">
                {stats.pedidos.pendientes || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Aprobados:</span>
              <span className="font-semibold text-green-600">
                {stats.pedidos.aprobados || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <span className="text-sm font-medium text-gray-500">ALERTAS</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.alertas.total || '0'}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>{stats.alertas.criticas || '0'} críticas sin resolver</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/solicitar"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
          >
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900">Nuevo Pedido</div>
              <div className="text-sm text-gray-600">Solicitar productos</div>
            </div>
          </a>

          <a
            href="/inventario"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
          >
            <TrendingUp className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-semibold text-gray-900">Ver Inventario</div>
              <div className="text-sm text-gray-600">Stock disponible</div>
            </div>
          </a>

          <a
            href="/tracking"
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
          >
            <Truck className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-semibold text-gray-900">Rastrear Envío</div>
              <div className="text-sm text-gray-600">Ubicación en tiempo real</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumenGeneral;
