import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { pedidosService } from '../services/api';

const ListaPedidos = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aprobarPedido = async (pedidoId) => {
    try {
      await pedidosService.aprobar(pedidoId, 1); // Usuario ID hardcodeado
      alert('Pedido aprobado exitosamente');
      cargarPedidos();
    } catch (error) {
      alert('Error al aprobar pedido: ' + (error.response?.data?.error || error.message));
    }
  };

  const rechazarPedido = async (pedidoId) => {
    const razon = prompt('Ingrese la razón del rechazo:');
    if (!razon) return;

    try {
      await pedidosService.rechazar(pedidoId, razon);
      alert('Pedido rechazado');
      cargarPedidos();
    } catch (error) {
      alert('Error al rechazar pedido: ' + (error.response?.data?.error || error.message));
    }
  };

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
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lista de Pedidos</h1>
        <p className="text-gray-600 mt-2">Gestión y seguimiento de pedidos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
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

        <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
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

        <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
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

        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-700 text-sm font-medium">Total</div>
              <div className="text-3xl font-bold text-blue-900">{pedidos.length}</div>
            </div>
            <Package className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pedidos Registrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidos.map((pedido) => (
                <tr key={pedido.pedido_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{pedido.pedido_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pedido.cliente_nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pedido.producto_nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{pedido.cantidad}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(pedido.fecha_pedido).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                      {getEstadoIcon(pedido.estado)}
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {pedido.estado === 'Pendiente' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => aprobarPedido(pedido.pedido_id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => rechazarPedido(pedido.pedido_id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaPedidos;
