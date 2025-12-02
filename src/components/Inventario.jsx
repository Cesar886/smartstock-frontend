import React, { useState, useEffect, useCallback } from 'react';
import { productosService } from '../services/api';
import { Package, Search, Filter, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useNotificaciones } from '../hooks/useNotificaciones';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const { error: notificarError } = useNotificaciones();

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productosService.getAll();
      setProductos(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudo cargar el inventario. Verifique la conexión.');
      notificarError('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  }, [notificarError]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const productosFiltrados = productos.filter(producto => 
    producto.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.tipo?.toLowerCase().includes(filtro.toLowerCase())
  );

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { label: 'Agotado', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle };
    if (stock < minStock) return { label: 'Bajo Stock', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertCircle };
    return { label: 'Disponible', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error de Conexión</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={cargarProductos}
          className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-primary" />
            Inventario de Productos
          </h2>
          <p className="text-slate-500 mt-1">Gestión y monitoreo de stock en tiempo real</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none w-full md:w-64 transition-all"
            />
          </div>
          <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto / Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Actual</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Mínimo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Máximo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Resurtido (días)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => {
                  const status = getStockStatus(producto.stock_actual, producto.stock_minimo);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={producto.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg mr-3">
                            {producto.nombre?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{producto.nombre}</div>
                            <div className="text-xs text-slate-500 font-mono">{producto.tipo || 'General'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-slate-800 font-semibold">{producto.stock_actual} un.</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-slate-500">{producto.stock_minimo} un.</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-slate-500">{producto.stock_maximo} un.</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-slate-500">{producto.tiempo_resurtido_dias} días</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-brand-primary hover:text-brand-700 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer de la tabla */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
          <span>Mostrando {productosFiltrados.length} productos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
