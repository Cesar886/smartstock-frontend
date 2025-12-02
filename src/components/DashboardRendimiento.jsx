import React, { useState, useEffect, useCallback } from 'react';
import { contratosService } from '../services/api';
import { TrendingUp, CheckCircle, AlertCircle, XCircle, BarChart3 } from 'lucide-react';

const DashboardRendimiento = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modoAlternativo, setModoAlternativo] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar primero el endpoint de salud
      let response;
      try {
        response = await contratosService.getSaludContratos();
        setContratos(response.data);
        setModoAlternativo(false);
      } catch (saludError) {
        console.warn('Endpoint /salud falló, usando endpoint básico:', saludError);
        
        // Si falla, usar el endpoint básico y calcular la salud en el frontend
        response = await contratosService.getAll();
        const contratosConRendimiento = response.data.map(contrato => {
          const porcentaje_uso = contrato.tarjetas_emitidas > 0 
            ? ((contrato.tarjetas_activas / contrato.tarjetas_emitidas) * 100).toFixed(1)
            : 0;
          
          let nivel_rendimiento = 'Excelente';
          if (porcentaje_uso < 30) nivel_rendimiento = 'Bajo Rendimiento';
          else if (porcentaje_uso < 50) nivel_rendimiento = 'Necesita Atención';
          else if (porcentaje_uso < 70) nivel_rendimiento = 'Rendimiento Medio';
          
          // Calcular tarjetas permitidas (simplificado)
          const tarjetas_permitidas = porcentaje_uso >= 70 
            ? Math.max(0, contrato.limite_contrato - contrato.tarjetas_emitidas)
            : 0;
          
          return {
            contrato_id: contrato.id,
            cliente: contrato.cliente_nombre,
            producto: contrato.producto_nombre,
            tarjetas_emitidas: contrato.tarjetas_emitidas,
            tarjetas_activas: contrato.tarjetas_activas,
            tarjetas_inactivas: contrato.tarjetas_inactivas,
            porcentaje_uso: parseFloat(porcentaje_uso),
            nivel_salud: nivel_rendimiento,
            tarjetas_permitidas: tarjetas_permitidas
          };
        });
        
        setContratos(contratosConRendimiento);
        setModoAlternativo(true);
      }
    } catch (error) {
      console.error('Error al cargar contratos:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error desconocido';
      setError(`Error del servidor: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const contratosFiltrados = contratos
    .filter(c => {
      if (filtro === 'todos') return true;
      return c.nivel_salud.toLowerCase().replace(/\s+/g, '').includes(filtro.toLowerCase().replace(/\s+/g, ''));
    })
    .sort((a, b) => a.contrato_id - b.contrato_id); // Ordenar por ID (orden de la DB)

  const getIconoRendimiento = (nivel) => {
    const normalizedNivel = nivel.toLowerCase().replace(/\s+/g, '');
    switch(normalizedNivel) {
      case 'excelente':
      case 'optimo':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'rendimientomedio':
      case 'aceptable':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'necesitaatencion':
      case 'enriesgo':
        return <TrendingUp className="w-5 h-5 text-amber-500" />;
      case 'bajorendimiento':
      case 'critico':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColorRendimiento = (nivel) => {
    const normalizedNivel = nivel.toLowerCase().replace(/\s+/g, '');
    switch(normalizedNivel) {
      case 'excelente':
      case 'optimo':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'rendimientomedio':
      case 'aceptable':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'necesitaatencion':
      case 'enriesgo':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'bajorendimiento':
      case 'critico':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <div className="text-lg font-medium text-slate-600">Cargando datos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-card p-8 border border-slate-200 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error de Conexión</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={cargarDatos}
            className="w-full bg-brand-primary text-white py-2.5 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const resumen = {
    total: contratos.length,
    bajoRendimiento: contratos.filter(c => c.nivel_salud.toLowerCase().includes('bajo') || c.nivel_salud.toLowerCase().includes('critico')).length,
    necesitaAtencion: contratos.filter(c => c.nivel_salud.toLowerCase().includes('necesita') || c.nivel_salud.toLowerCase().includes('riesgo')).length,
    rendimientoMedio: contratos.filter(c => c.nivel_salud.toLowerCase().includes('medio') || c.nivel_salud.toLowerCase().includes('aceptable')).length,
    excelente: contratos.filter(c => c.nivel_salud.toLowerCase().includes('excelente') || c.nivel_salud.toLowerCase().includes('optimo')).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard de Rendimiento</h1>
          <p className="text-slate-500 mt-1">Monitoreo en tiempo real de contratos y tarjetas</p>
        </div>
        <div className="flex items-center gap-3">
          {modoAlternativo && (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              Modo Cálculo Local
            </span>
          )}
          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all text-sm font-medium shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Contratos</div>
          <div className="text-3xl font-bold text-slate-900">{resumen.total}</div>
          <div className="mt-2 text-xs text-slate-400">Activos en plataforma</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="text-red-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Bajo Rendimiento
          </div>
          <div className="text-3xl font-bold text-slate-900">{resumen.bajoRendimiento}</div>
          <div className="mt-2 text-xs text-red-600/80 font-medium">Requiere acción inmediata</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200">
          <div className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Atención
          </div>
          <div className="text-3xl font-bold text-slate-900">{resumen.necesitaAtencion}</div>
          <div className="mt-2 text-xs text-amber-600/80 font-medium">Riesgo potencial</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200">
          <div className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Medio
          </div>
          <div className="text-3xl font-bold text-slate-900">{resumen.rendimientoMedio}</div>
          <div className="mt-2 text-xs text-blue-600/80 font-medium">Estable</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200">
          <div className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Excelente
          </div>
          <div className="text-3xl font-bold text-slate-900">{resumen.excelente}</div>
          <div className="mt-2 text-xs text-emerald-600/80 font-medium">Objetivo cumplido</div>
        </div>
      </div>

      {/* Filtros y Tabla */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-900">Detalle de Contratos</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'bajo', label: 'Bajo' },
              { id: 'necesita', label: 'Atención' },
              { id: 'medio', label: 'Medio' },
              { id: 'excelente', label: 'Excelente' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filtro === f.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente / Producto</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Emitidas</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Activas</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactivas</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Uso</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Autorización</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {contratosFiltrados.map((contrato) => (
                <tr key={contrato.contrato_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{contrato.cliente}</div>
                    <div className="text-xs text-slate-500">{contrato.producto}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 font-mono">
                    {contrato.tarjetas_emitidas}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-emerald-600 font-mono font-medium">
                    {contrato.tarjetas_activas}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400 font-mono">
                    {contrato.tarjetas_inactivas}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-bold text-slate-900">{contrato.porcentaje_uso}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            contrato.porcentaje_uso < 30 ? 'bg-red-500' :
                            contrato.porcentaje_uso < 50 ? 'bg-amber-500' :
                            contrato.porcentaje_uso < 70 ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, contrato.porcentaje_uso)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getColorRendimiento(contrato.nivel_salud)}`}>
                      {getIconoRendimiento(contrato.nivel_salud)}
                      {contrato.nivel_salud}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {contrato.tarjetas_permitidas > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Autorizado
                        </span>
                        <span className="text-xs text-slate-500">+{contrato.tarjetas_permitidas} tarjetas</span>
                      </div>
                    ) : (
                      <span className="text-red-600 font-medium text-xs flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {contratosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-900 font-medium">No se encontraron resultados</p>
            <p className="text-slate-500 text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRendimiento;
