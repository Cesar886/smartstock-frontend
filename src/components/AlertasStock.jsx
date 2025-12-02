import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { alertasService } from '../services/api';

const AlertasStock = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarAlertas = async () => {
    try {
      const response = await alertasService.getNoResueltas();
      setAlertas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolverAlerta = async (alertaId) => {
    try {
      await alertasService.resolver(alertaId);
      alert('Alerta resuelta exitosamente');
      cargarAlertas();
    } catch (error) {
      alert('Error al resolver alerta: ' + (error.response?.data?.error || error.message));
    }
  };

  const generarAlertas = async () => {
    try {
      const response = await alertasService.generar();
      alert(`Se generaron ${response.data.alertas_creadas} nuevas alertas`);
      cargarAlertas();
    } catch (error) {
      alert('Error al generar alertas: ' + (error.response?.data?.error || error.message));
    }
  };

  const getNivelColor = (nivel) => {
    const colores = {
      'Crítico': 'bg-red-100 text-red-800 border-red-500',
      'Alto': 'bg-orange-100 text-orange-800 border-orange-500',
      'Medio': 'bg-yellow-100 text-yellow-800 border-yellow-500',
      'Bajo': 'bg-blue-100 text-blue-800 border-blue-500'
    };
    return colores[nivel] || 'bg-gray-100 text-gray-800 border-gray-500';
  };

  const getNivelIcon = (nivel) => {
    switch (nivel) {
      case 'Crítico':
        return <AlertCircle className="w-5 h-5" />;
      case 'Alto':
      case 'Medio':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando alertas...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alertas de Stock</h1>
          <p className="text-gray-600 mt-2">Notificaciones de inventario y contratos</p>
        </div>
        <button
          onClick={generarAlertas}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5" />
          Generar Alertas
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-700 text-sm font-medium">Críticas</div>
              <div className="text-3xl font-bold text-red-900">
                {alertas.filter(a => a.nivel === 'Crítico').length}
              </div>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-700 text-sm font-medium">Altas</div>
              <div className="text-3xl font-bold text-orange-900">
                {alertas.filter(a => a.nivel === 'Alto').length}
              </div>
            </div>
            <AlertTriangle className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-700 text-sm font-medium">Medias</div>
              <div className="text-3xl font-bold text-yellow-900">
                {alertas.filter(a => a.nivel === 'Medio').length}
              </div>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-700 text-sm font-medium">Total</div>
              <div className="text-3xl font-bold text-blue-900">{alertas.length}</div>
            </div>
            <AlertTriangle className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertas.length === 0 ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">¡Todo en orden!</h3>
                <p className="text-green-700">No hay alertas pendientes en este momento.</p>
              </div>
            </div>
          </div>
        ) : (
          alertas.map((alerta) => (
            <div
              key={alerta.alerta_id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getNivelColor(alerta.nivel)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getNivelColor(alerta.nivel)}`}>
                    {getNivelIcon(alerta.nivel)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getNivelColor(alerta.nivel)}`}>
                        {alerta.nivel}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(alerta.fecha_alerta).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{alerta.tipo}</h3>
                    <p className="text-gray-700 mb-3">{alerta.mensaje}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        <strong>Cliente:</strong> {alerta.cliente_nombre}
                      </span>
                      <span>
                        <strong>Producto:</strong> {alerta.producto_nombre}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => resolverAlerta(alerta.alerta_id)}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolver
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertasStock;
