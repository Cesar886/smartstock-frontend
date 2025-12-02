import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, AlertTriangle, TrendingDown, TrendingUp, XCircle, AlertCircle } from 'lucide-react';

const InventarioCompleto = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarInventario = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventario/estados');
        const data = await response.json();
        setInventario(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar inventario:', error);
        setLoading(false);
      }
    };

    cargarInventario();
  }, []);

  const getTotalStock = () => {
    return inventario.reduce((sum, item) => sum + item.stock_total, 0);
  };

  const getDisponibleTotal = () => {
    return inventario.reduce((sum, item) => sum + item.stock_disponible, 0);
  };

  const getEnTransitoTotal = () => {
    return inventario.reduce((sum, item) => sum + item.stock_en_transito, 0);
  };

  const getRecibidoTotal = () => {
    return inventario.reduce((sum, item) => sum + item.stock_recibido_cliente, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventario Completo</h1>
          <p className="text-slate-500 mt-1">Gestión y monitoreo de stock en tiempo real</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Stock Total</div>
          <div className="text-3xl font-bold text-slate-900">{getTotalStock().toLocaleString()}</div>
          <div className="mt-2 text-xs text-slate-400">Todas las tarjetas</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Disponible
          </div>
          <div className="text-3xl font-bold text-slate-900">{getDisponibleTotal().toLocaleString()}</div>
          <div className="mt-2 text-xs text-emerald-600/80 font-medium">
            {((getDisponibleTotal() / getTotalStock()) * 100).toFixed(1)}% del total
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Truck className="w-3 h-3" /> En Tránsito
          </div>
          <div className="text-3xl font-bold text-slate-900">{getEnTransitoTotal().toLocaleString()}</div>
          <div className="mt-2 text-xs text-blue-600/80 font-medium">Camino al cliente</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-card border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Con Clientes
          </div>
          <div className="text-3xl font-bold text-slate-900">{getRecibidoTotal().toLocaleString()}</div>
          <div className="mt-2 text-xs text-purple-600/80 font-medium">Ya entregadas</div>
        </div>
      </div>

      {/* Tabla Detallada */}
      <div className="bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Detalle por Producto</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/30">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Stock Total
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Disponible
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  En Tránsito
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Con Clientes
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Distribución
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventario.map((item, index) => {
                const disponiblePct = (item.stock_disponible / item.stock_total) * 100;
                const transitoPct = (item.stock_en_transito / item.stock_total) * 100;
                const recibidoPct = (item.stock_recibido_cliente / item.stock_total) * 100;

                return (
                  <tr key={`inventario-${item.producto_id}-${index}`} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <div className="font-semibold text-slate-900">{item.producto_nombre}</div>
                          <div className="text-slate-500 text-xs">ID: {item.producto_id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{item.stock_total.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">unidades</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-emerald-600">{item.stock_disponible.toLocaleString()}</div>
                      <div className="text-xs text-emerald-600/70">{disponiblePct.toFixed(1)}%</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-blue-600">{item.stock_en_transito.toLocaleString()}</div>
                      <div className="text-xs text-blue-600/70">{transitoPct.toFixed(1)}%</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-purple-600">{item.stock_recibido_cliente.toLocaleString()}</div>
                      <div className="text-xs text-purple-600/70">{recibidoPct.toFixed(1)}%</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="flex h-full">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${disponiblePct}%` }}
                            ></div>
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${transitoPct}%` }}
                            ></div>
                            <div
                              className="h-full bg-purple-500"
                              style={{ width: `${recibidoPct}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {item.stock_disponible < item.stock_minimo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" />
                          Bajo
                        </span>
                      ) : item.stock_disponible > item.stock_minimo * 2 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Óptimo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <AlertCircle className="w-3 h-3" />
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-slate-50/50 border border-slate-200 p-6 rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">📊 Interpretación del Inventario</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-900 mb-1">Stock Disponible</div>
              <div>Tarjetas que puedes vender ahora mismo. Están en el almacén.</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Truck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 mb-1">Stock En Tránsito</div>
              <div>Tarjetas vendidas que están en camino al cliente.</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Package className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-purple-900 mb-1">Stock Con Clientes</div>
              <div>Tarjetas ya entregadas a clientes (inactivas hasta que se usen).</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventarioCompleto;
