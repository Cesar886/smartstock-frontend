import { useState, useEffect } from 'react';
import { pedidosService, repartidoresService, enviosService } from '../services/api';

export default function GestionEnvios() {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedidosRes, repartidoresRes] = await Promise.all([
        pedidosService.getPendientesEnvio(),
        repartidoresService.getDisponibles()
      ]);
      
      setPedidosPendientes(pedidosRes.data || []);
      setRepartidores(repartidoresRes.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const crearEnvio = async (pedido, repartidorId) => {
    if (!repartidorId) {
      alert('Por favor selecciona un repartidor');
      return;
    }

    setProcesando(pedido.id);
    try {
      const envioData = {
        pedido_id: pedido.id,
        repartidor_id: parseInt(repartidorId),
        direccion_destino: pedido.direccion_entrega || 'Dirección del cliente',
        // Ubicación inicial del almacén (puedes ajustar estos valores)
        ubicacion_actual: {
          lat: -33.4489,
          lng: -70.6693
        }
      };

      await enviosService.crear(envioData);
      
      // Recargar datos después de crear el envío
      await cargarDatos();
      
      alert(`Envío creado exitosamente para pedido #${pedido.id}`);
    } catch (err) {
      console.error('Error al crear envío:', err);
      alert(`Error al crear el envío: ${err.response?.data?.error || err.message}`);
    } finally {
      setProcesando(null);
    }
  };

  const crearEnviosMasivos = async () => {
    if (pedidosPendientes.length === 0) {
      alert('No hay pedidos pendientes para procesar');
      return;
    }

    if (!confirm(`¿Crear envíos para ${pedidosPendientes.length} pedidos pendientes?`)) {
      return;
    }

    setProcesando('masivo');
    let exitosos = 0;
    let fallidos = 0;

    for (const pedido of pedidosPendientes) {
      try {
        // Asignar repartidor de forma rotativa
        const repartidorIndex = exitosos % repartidores.length;
        const repartidorId = repartidores[repartidorIndex]?.id;

        if (!repartidorId) {
          fallidos++;
          continue;
        }

        const envioData = {
          pedido_id: pedido.id,
          repartidor_id: repartidorId,
          direccion_destino: pedido.direccion_entrega || 'Dirección del cliente',
          ubicacion_actual: {
            lat: -33.4489,
            lng: -70.6693
          }
        };

        await enviosService.crear(envioData);
        exitosos++;
      } catch (err) {
        console.error(`Error al crear envío para pedido ${pedido.id}:`, err);
        fallidos++;
      }
    }

    await cargarDatos();
    setProcesando(null);
    
    alert(`Proceso completado:\nExitosos: ${exitosos}\nFallidos: ${fallidos}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={cargarDatos}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Envíos</h2>
          <p className="text-gray-600 mt-1">
            Convierte pedidos pendientes en envíos activos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={cargarDatos}
            disabled={procesando}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium shadow-sm transition-colors"
          >
            Actualizar
          </button>
          {pedidosPendientes.length > 0 && repartidores.length > 0 && (
            <button
              onClick={crearEnviosMasivos}
              disabled={procesando}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium shadow-sm transition-colors"
            >
              {procesando === 'masivo' ? 'Procesando...' : 'Crear Envíos Masivos'}
            </button>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">{pedidosPendientes.length}</div>
          <div className="text-sm text-blue-600">Pedidos Pendientes</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">{repartidores.length}</div>
          <div className="text-sm text-green-600">Repartidores Disponibles</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">
            {pedidosPendientes.length > 0 && repartidores.length > 0 ? 'Activo' : 'Alerta'}
          </div>
          <div className="text-sm text-purple-600">Estado del Sistema</div>
        </div>
      </div>

      {/* Advertencias */}
      {repartidores.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            No hay repartidores disponibles. No se pueden crear envíos.
          </p>
        </div>
      )}

      {pedidosPendientes.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ¡Excelente! No hay pedidos pendientes de envío.
          </p>
        </div>
      )}

      {/* Tabla de Pedidos Pendientes */}
      {pedidosPendientes.length > 0 && repartidores.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Pedidos Pendientes de Envío
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pedido #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Repartidor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosPendientes.map((pedido) => (
                  <PedidoRow
                    key={pedido.id}
                    pedido={pedido}
                    repartidores={repartidores}
                    onCrearEnvio={crearEnvio}
                    procesando={procesando === pedido.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PedidoRow({ pedido, repartidores, onCrearEnvio, procesando }) {
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState('');

  return (
    <tr className={procesando ? 'bg-blue-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{pedido.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {pedido.cliente_nombre || 'Cliente'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {pedido.producto_nombre || 'Producto'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {pedido.cantidad}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {new Date(pedido.fecha_solicitud).toLocaleDateString('es-ES')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <select
          value={repartidorSeleccionado}
          onChange={(e) => setRepartidorSeleccionado(e.target.value)}
          disabled={procesando}
          className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
        >
          <option value="">Seleccionar...</option>
          {repartidores.map((rep) => (
            <option key={rep.id} value={rep.id}>
              {rep.nombre} - {rep.vehiculo}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={() => onCrearEnvio(pedido, repartidorSeleccionado)}
          disabled={procesando || !repartidorSeleccionado}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
        >
          {procesando ? 'Procesando...' : 'Crear Envío'}
        </button>
      </td>
    </tr>
  );
}
