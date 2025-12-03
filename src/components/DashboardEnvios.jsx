import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

const DashboardEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState('');

  const cargarDatos = async () => {
    try {
      // Cargar envíos activos
      const resEnvios = await fetch('http://localhost:3001/api/envios/activos');
      const dataEnvios = await resEnvios.json();
      setEnvios(dataEnvios);

      // Cargar repartidores
      const resRepartidores = await fetch('http://localhost:3001/api/repartidores');
      const dataRepartidores = await resRepartidores.json();
      setRepartidores(dataRepartidores);

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    cargarDatos();
  }, []);

  const crearEnvio = async () => {
    if (!pedidoSeleccionado || !repartidorSeleccionado) {
      alert('Selecciona un pedido y un repartidor');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/envios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedidoSeleccionado,
          repartidor_id: parseInt(repartidorSeleccionado)
        })
      });

      if (response.ok) {
        alert('✅ Envío creado exitosamente');
        setMostrarModal(false);
        setPedidoSeleccionado(null);
        setRepartidorSeleccionado('');
        cargarDatos();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al crear envío:', error);
      alert('Error al crear envío');
    }
  };

  const getEstadoBadge = (status) => {
    switch(status) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
      case 'en_transito':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            En Tránsito
          </span>
        );
      case 'entregado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Entregado
          </span>
        );
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando envíos...</div>
      </div>
    );
  }

  const enviosEntregados = envios.filter(e => e.status === 'entregado');

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Envíos</h1>
          <p className="text-slate-600 mt-1">Monitoreo y control de entregas</p>
        </div>
      </div>

      {/* Resumen de Estados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm font-semibold mb-1">
                Pendientes
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {envios.filter(e => e.status === 'pendiente').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                En preparación
              </div>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm font-semibold mb-1">
                En Tránsito
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {envios.filter(e => e.status === 'en_transito').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                En ruta
              </div>
            </div>
            <Truck className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-600 text-sm font-semibold mb-1">
                Entregados
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {enviosEntregados.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Completados
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabla de Envíos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Listado de Envíos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Repartidor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {envios.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <div className="text-lg font-semibold text-slate-400 mb-1">No hay envíos registrados</div>
                  <div className="text-sm text-slate-500">Cree un nuevo envío para comenzar</div>
                </td>
              </tr>
            ) : (
              envios.map((envio) => (
                <tr key={envio.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-blue-600">
                      {envio.tracking_code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {envio.cliente_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {envio.producto_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    {envio.cantidad.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {envio.repartidor_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(envio.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(envio.fecha_salida).toLocaleDateString('es-MX')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal Crear Envío - Súper Amigable */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-blue-300 animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">📦</div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Crear Envío Nuevo</h2>
              <p className="text-gray-600 font-medium">Llena estos datos para enviar el paquete</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-300">
                <label className="flex items-center gap-2 text-base font-black text-purple-900 mb-3">
                  <span className="text-2xl">🔢</span>
                  Número del Pedido
                </label>
                <input
                  type="number"
                  value={pedidoSeleccionado || ''}
                  onChange={(e) => setPedidoSeleccionado(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-500 text-lg font-bold"
                  placeholder="Ej: 10"
                />
                <div className="text-xs text-purple-700 mt-2 font-medium">
                  💡 Es el ID del pedido que quieres enviar
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
                <label className="flex items-center gap-2 text-base font-black text-blue-900 mb-3">
                  <span className="text-2xl">🚚</span>
                  ¿Quién lo va a llevar?
                </label>
                <select
                  value={repartidorSeleccionado}
                  onChange={(e) => setRepartidorSeleccionado(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg font-bold"
                >
                  <option value="">-- Elige un repartidor --</option>
                  {repartidores.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} - {r.vehiculo}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-blue-700 mt-2 font-medium">
                  💡 Escoge la persona que llevará el paquete
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-bold text-lg transition-all"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={crearEnvio}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 font-black text-lg transition-all hover:scale-105 shadow-lg"
              >
                ✅ ¡Crear!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEnvios;
