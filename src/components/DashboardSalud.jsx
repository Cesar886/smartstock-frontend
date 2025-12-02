import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import { contratosService } from '../services/api';

const DashboardSalud = () => {
  const [salud, setSalud] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarSalud = async () => {
    try {
      const response = await contratosService.getSaludContratos();
      setSalud(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar salud de contratos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSalud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEstadoColor = (estado) => {
    const colores = {
      'Excelente': 'text-green-600 bg-green-100',
      'Bueno': 'text-blue-600 bg-blue-100',
      'Advertencia': 'text-yellow-600 bg-yellow-100',
      'Crítico': 'text-red-600 bg-red-100'
    };
    return colores[estado] || 'text-gray-600 bg-gray-100';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Excelente':
        return <CheckCircle className="w-5 h-5" />;
      case 'Bueno':
        return <TrendingUp className="w-5 h-5" />;
      case 'Advertencia':
        return <Clock className="w-5 h-5" />;
      case 'Crítico':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando estado de contratos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Estado de Salud de Contratos</h1>
        <p className="text-gray-600 mt-2">Monitoreo del cumplimiento y estado de los contratos</p>
      </div>

      {/* Resumen de Estados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-700 text-sm font-medium">Excelentes</div>
              <div className="text-3xl font-bold text-green-900">
                {salud.filter(c => c.estado_salud === 'Excelente').length}
              </div>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-700 text-sm font-medium">Buenos</div>
              <div className="text-3xl font-bold text-blue-900">
                {salud.filter(c => c.estado_salud === 'Bueno').length}
              </div>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-700 text-sm font-medium">Advertencia</div>
              <div className="text-3xl font-bold text-yellow-900">
                {salud.filter(c => c.estado_salud === 'Advertencia').length}
              </div>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-700 text-sm font-medium">Críticos</div>
              <div className="text-3xl font-bold text-red-900">
                {salud.filter(c => c.estado_salud === 'Crítico').length}
              </div>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabla de Contratos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detalle de Contratos</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días Restantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salud.map((contrato) => (
                <tr key={contrato.contrato_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contrato.cliente_nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contrato.producto_nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contrato.cantidad_consumida} / {contrato.cantidad_total}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          contrato.porcentaje_consumo > 80 ? 'bg-red-500' : 
                          contrato.porcentaje_consumo > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${contrato.porcentaje_consumo}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contrato.dias_restantes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(contrato.estado_salud)}`}>
                      {getEstadoIcon(contrato.estado_salud)}
                      {contrato.estado_salud}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{contrato.observaciones}</div>
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

export default DashboardSalud;
