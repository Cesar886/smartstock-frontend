import React, { useState } from 'react';
import { MapPin, Package, Truck, CheckCircle, Phone, User, Clock } from 'lucide-react';

const TrackingCliente = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarEnvio = async () => {
    if (!trackingCode.trim()) {
      alert('Ingresa un código de tracking');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/envios/tracking/${trackingCode}`);
      
      if (!response.ok) {
        throw new Error('Código de tracking no encontrado');
      }
      
      const data = await response.json();
      setEnvio(data);
    } catch (err) {
      setError(err.message);
      setEnvio(null);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoInfo = (status) => {
    switch(status) {
      case 'pendiente':
        return {
          icon: <Clock className="w-8 h-8" />,
          color: 'bg-yellow-50 border-yellow-500',
          textColor: 'text-yellow-900',
          bgIcon: 'bg-yellow-100',
          label: 'Preparando Envío',
          description: 'Su pedido está siendo preparado en nuestro centro de distribución'
        };
      case 'en_transito':
        return {
          icon: <Truck className="w-8 h-8" />,
          color: 'bg-blue-50 border-blue-500',
          textColor: 'text-blue-900',
          bgIcon: 'bg-blue-100',
          label: 'En Tránsito',
          description: 'El envío está en camino hacia su destino'
        };
      case 'entregado':
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          color: 'bg-green-50 border-green-500',
          textColor: 'text-green-900',
          bgIcon: 'bg-green-100',
          label: 'Entregado',
          description: 'El pedido ha sido entregado exitosamente'
        };
      default:
        return {
          icon: <Package className="w-8 h-8" />,
          color: 'bg-slate-50 border-slate-500',
          textColor: 'text-slate-900',
          bgIcon: 'bg-slate-100',
          label: 'Estado Desconocido',
          description: ''
        };
    }
  };

  const estadoInfo = envio ? getEstadoInfo(envio.status) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Profesional */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Seguimiento de Envío
              </h1>
              <p className="text-slate-600">
                Rastrea tu pedido en tiempo real
              </p>
            </div>
          </div>
        </div>

        {/* Buscador Profesional */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Código de Seguimiento
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && buscarEnvio()}
              placeholder="Ej: TRACK-1234567890-ABC"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-mono"
            />
            <button
              onClick={buscarEnvio}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5" />
                  Rastrear Envío
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Profesional */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-900 mb-1">Código no encontrado</h3>
                <p className="text-sm text-red-700 mb-2">{error}</p>
                <p className="text-xs text-red-600">Verifique que el código de seguimiento sea correcto.</p>
              </div>
            </div>
          </div>
        )}

        {/* Información del Envío */}
        {envio && (
          <div className="space-y-6">
            {/* Estado Principal */}
            <div className={`${estadoInfo.color} border-l-4 rounded-lg p-6 shadow-md mb-6`}>
              <div className="flex items-center gap-4">
                <div className={`${estadoInfo.bgIcon} ${estadoInfo.textColor} p-4 rounded-lg`}>
                  {estadoInfo.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-2xl font-bold ${estadoInfo.textColor} mb-1`}>
                    {estadoInfo.label}
                  </div>
                  <div className="text-base text-slate-700">{estadoInfo.description}</div>
                </div>
              </div>
            </div>

            {/* Timeline de Seguimiento */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Historial del Envío
              </h3>
              
              <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                
                {/* Paso 1: Preparando */}
                <div className="relative flex items-start gap-4 mb-8 pl-8">
                  <div className={`absolute left-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    envio.status !== 'pendiente' ? 'bg-green-500' : 'bg-yellow-500'
                  } shadow-md`}>
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">Pedido Recibido</div>
                    <div className="text-sm text-slate-600">
                      {new Date(envio.fecha_salida).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">El pedido está en preparación</div>
                  </div>
                </div>

                {/* Paso 2: En Tránsito */}
                <div className="relative flex items-start gap-4 mb-8 pl-8">
                  <div className={`absolute left-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    envio.status === 'entregado' ? 'bg-green-500' : 
                    envio.status === 'en_transito' ? 'bg-blue-500' : 'bg-slate-300'
                  } shadow-md`}>
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">En Tránsito</div>
                    {envio.status === 'en_transito' && (
                      <>
                        <div className="text-sm text-blue-600 font-medium">En curso</div>
                        <div className="text-xs text-slate-500 mt-1">El envío está en camino</div>
                      </>
                    )}
                    {envio.status === 'pendiente' && (
                      <div className="text-xs text-slate-400">Pendiente</div>
                    )}
                  </div>
                </div>

                {/* Paso 3: Entregado */}
                <div className="relative flex items-start gap-4 pl-8">
                  <div className={`absolute left-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    envio.status === 'entregado' ? 'bg-green-500' : 'bg-slate-300'
                  } shadow-md`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">Entregado</div>
                    {envio.fecha_entrega ? (
                      <>
                        <div className="text-sm text-slate-600">
                          {new Date(envio.fecha_entrega).toLocaleString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-xs text-green-600 mt-1">Entrega confirmada</div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400">Pendiente de entrega</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles del Pedido */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Detalles del Pedido
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Código de Seguimiento</div>
                  <div className="text-sm font-mono font-semibold text-slate-900 break-all">
                    {envio.tracking_code}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Producto</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {envio.cantidad.toLocaleString()} unidades
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{envio.producto_nombre}</div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Destinatario</div>
                  <div className="text-sm font-semibold text-slate-900">{envio.cliente_nombre}</div>
                  {envio.cliente_direccion && (
                    <div className="text-xs text-slate-600 mt-1">{envio.cliente_direccion}</div>
                  )}
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Estado del Pedido</div>
                  <div className="text-sm font-semibold text-slate-900 capitalize">
                    {envio.pedido_estado.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Repartidor */}
            {envio.status === 'en_transito' && (
              <div className="bg-blue-50 rounded-xl border-l-4 border-blue-500 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Información del Repartidor
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Nombre</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {envio.repartidor_nombre}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Teléfono</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {envio.repartidor_telefono}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Vehículo</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {envio.repartidor_vehiculo}
                    </div>
                  </div>
                </div>                {/* Ubicación en tiempo real */}
                {envio.ubicacion_actual_lat && envio.ubicacion_actual_lng && (
                  <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div className="font-semibold text-slate-900">Ubicación en Tiempo Real</div>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${envio.ubicacion_actual_lat},${envio.ubicacion_actual_lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver en Google Maps
                    </a>
                    <div className="mt-2 text-xs text-slate-500">
                      Coordenadas: {envio.ubicacion_actual_lat}, {envio.ubicacion_actual_lng}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Evidencia de Entrega */}
            {envio.status === 'entregado' && envio.evidencia_foto_url && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Evidencia de Entrega
                </h3>
                <div className="bg-slate-50 rounded-lg p-3">
                  <img
                    src={envio.evidencia_foto_url}
                    alt="Evidencia de entrega"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Entrega confirmada con evidencia fotográfica</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingCliente;
