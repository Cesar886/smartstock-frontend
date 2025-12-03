import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { pedidosService } from '../services/api';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPedidos = async () => {
    try {
      const response = await pedidosService.getAll();
      setPedidos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'Rechazado': 'bg-red-100 text-red-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Completado': 'bg-purple-100 text-purple-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className="w-4 h-4" />;
      case 'Aprobado':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rechazado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 rounded-xl shadow-sm p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-700 text-sm font-medium">Pendientes</div>
              <div className="text-3xl font-bold text-yellow-900">
                {pedidos.filter(p => p.estado === 'Pendiente').length}
              </div>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-700 text-sm font-medium">Aprobados</div>
              <div className="text-3xl font-bold text-green-900">
                {pedidos.filter(p => p.estado === 'Aprobado').length}
              </div>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl shadow-sm p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-700 text-sm font-medium">Rechazados</div>
              <div className="text-3xl font-bold text-red-900">
                {pedidos.filter(p => p.estado === 'Rechazado').length}
              </div>
            </div>
            <XCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-700 text-sm font-medium">Total</div>
              <div className="text-3xl font-bold text-purple-900">{pedidos.length}</div>
            </div>
            <Package className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabla de Mis Pedidos - Solo Consulta */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
          <h2 className="text-xl font-semibold text-slate-900">Mis Solicitudes de Pedidos</h2>
          <p className="text-sm text-slate-600 mt-1">Consulta el estado de tus pedidos realizados</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No has realizado ningún pedido aún
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.pedido_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{pedido.pedido_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pedido.cliente_nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{pedido.producto_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{pedido.cantidad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                        {getEstadoIcon(pedido.estado)}
                        {pedido.estado}
                      </span>
                      {pedido.estado === 'Rechazado' && pedido.razon_rechazo && (
                        <div className="text-xs text-red-600 mt-1">
                          Razón: {pedido.razon_rechazo}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Información sobre tus pedidos</h3>
            <p className="text-sm text-blue-700 mt-1">
              Los pedidos en estado "Pendiente" están siendo revisados por el equipo administrativo. 
              Una vez aprobados, podrás ver el cambio de estado aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;
