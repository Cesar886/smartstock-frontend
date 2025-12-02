import React, { useState, useEffect, useCallback } from 'react';
import { clientesService, productosService, contratosService, pedidosService } from '../services/api';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { AlertCircle, CheckCircle, XCircle, Package, ArrowRight, CreditCard, Activity, Users, Box } from 'lucide-react';

const SolicitudPedido = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [contratosCliente, setContratosCliente] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [validaciones, setValidaciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [rfc, setRfc] = useState('');
  const [rfcValidado, setRfcValidado] = useState(false);
  const [errorRfc, setErrorRfc] = useState('');
  const { error: mostrarError, exito: mostrarExito } = useNotificaciones();

  // Cargar clientes al inicio
  const cargarClientes = useCallback(async () => {
    try {
      const response = await clientesService.getAll();
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      mostrarError('Error al cargar clientes');
    }
  }, [mostrarError]);

  // Cargar productos al inicio
  const cargarProductos = useCallback(async () => {
    try {
      const response = await productosService.getAll();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      mostrarError('Error al cargar productos');
    }
  }, [mostrarError]);

  // Cargar productos disponibles para el cliente seleccionado
  const cargarProductosCliente = useCallback(async (clienteId) => {
    setLoadingProductos(true);
    try {
      // Obtener todos los contratos del cliente
      const responseContratos = await contratosService.getAll();
      const contratosDelCliente = responseContratos.data.filter(
        c => c.cliente_id === parseInt(clienteId)
      );

      setContratosCliente(contratosDelCliente);

      if (contratosDelCliente.length === 0) {
        setProductosDisponibles([]);
        mostrarError('Este cliente no tiene contratos activos');
        return;
      }

      // Obtener los IDs de productos que tienen contrato con este cliente
      const productosConContrato = contratosDelCliente.map(c => c.producto_id);

      // Filtrar productos que tienen contrato
      const productosValidos = productos.filter(p => 
        productosConContrato.includes(p.id)
      );

      setProductosDisponibles(productosValidos);
    } catch (error) {
      console.error('Error al cargar productos del cliente:', error);
      mostrarError('Error al cargar productos disponibles');
      setProductosDisponibles([]);
    } finally {
      setLoadingProductos(false);
    }
  }, [productos, mostrarError]);

  // Obtener información de contrato para un producto específico
  const obtenerContratoInfo = useCallback((productoId) => {
    const contrato = contratosCliente.find(c => c.producto_id === parseInt(productoId));
    if (!contrato) return null;

    const porcentaje_uso = contrato.tarjetas_emitidas > 0 
      ? ((contrato.tarjetas_activas / contrato.tarjetas_emitidas) * 100).toFixed(1)
      : 0;
    
    return {
      contrato_id: contrato.id,
      cliente_id: contrato.cliente_id,
      producto_id: contrato.producto_id,
      tarjetas_emitidas: contrato.tarjetas_emitidas,
      tarjetas_activas: contrato.tarjetas_activas,
      tarjetas_inactivas: contrato.tarjetas_inactivas,
      porcentaje_uso: parseFloat(porcentaje_uso),
      limite_contrato: contrato.limite_contrato
    };
  }, [contratosCliente]);

  useEffect(() => {
    cargarClientes();
    cargarProductos();
  }, [cargarClientes, cargarProductos]);

  // Cuando se selecciona un cliente, cargar sus productos disponibles
  useEffect(() => {
    if (clienteSeleccionado) {
      cargarProductosCliente(clienteSeleccionado);
      setProductosSeleccionados([]);
      setCantidades({});
      setValidaciones({});
      setRfc('');
      setRfcValidado(false);
      setErrorRfc('');
    } else {
      setProductosDisponibles([]);
      setContratosCliente([]);
    }
  }, [clienteSeleccionado, cargarProductosCliente]);

  // Validar formato RFC
  const validarFormatoRFC = (rfcInput) => {
    const rfcClean = rfcInput.toUpperCase().trim();
    // RFC Persona Física: 13 caracteres (4 letras + 6 números + 3 alfanuméricos)
    // RFC Persona Moral: 12 caracteres (3 letras + 6 números + 3 alfanuméricos)
    const regexRFC = /^([A-ZÑ&]{3,4})?(\d{6})?([A-Z0-9]{3})?$/;
    return regexRFC.test(rfcClean) && (rfcClean.length === 12 || rfcClean.length === 13);
  };

  // Manejar cambio de RFC
  const handleRfcChange = (e) => {
    const valor = e.target.value.toUpperCase();
    setRfc(valor);
    setErrorRfc('');
    
    if (valor.length === 0) {
      setRfcValidado(false);
      setErrorRfc('');
    } else if (validarFormatoRFC(valor)) {
      setRfcValidado(true);
      setErrorRfc('');
    } else {
      setRfcValidado(false);
      if (valor.length > 0) {
        setErrorRfc('Formato de RFC inválido (debe tener 12 o 13 caracteres)');
      }
    }
  };

  // Manejar selección/deselección de producto
  const toggleProducto = (productoId) => {
    setProductosSeleccionados(prev => {
      if (prev.includes(productoId)) {
        // Deseleccionar
        const nuevasCantidades = { ...cantidades };
        const nuevasValidaciones = { ...validaciones };
        delete nuevasCantidades[productoId];
        delete nuevasValidaciones[productoId];
        setCantidades(nuevasCantidades);
        setValidaciones(nuevasValidaciones);
        return prev.filter(id => id !== productoId);
      } else {
        // Seleccionar
        return [...prev, productoId];
      }
    });
  };

  // Actualizar cantidad para un producto específico
  const actualizarCantidad = (productoId, valor) => {
    setCantidades(prev => ({
      ...prev,
      [productoId]: valor
    }));
    // Limpiar validación cuando cambia la cantidad
    setValidaciones(prev => {
      const nuevas = { ...prev };
      delete nuevas[productoId];
      return nuevas;
    });
  };

  // Validar un producto específico
  const handleValidarProducto = async (productoId) => {
    const cantidad = cantidades[productoId];
    if (!cantidad) {
      mostrarError('Por favor ingresa una cantidad');
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      mostrarError('La cantidad debe ser un número mayor a 0');
      return;
    }

    const contratoInfo = obtenerContratoInfo(productoId);
    if (!contratoInfo) {
      mostrarError('No se encontró información del contrato');
      return;
    }

    setLoading(true);
    try {
      const response = await pedidosService.validar(
        contratoInfo.contrato_id,
        cantidadNum
      );
      setValidaciones(prev => ({
        ...prev,
        [productoId]: response.data
      }));
    } catch (error) {
      console.error('Error al validar pedido:', error);
      const errorMsg = error.response?.data?.error || 'Error al validar el pedido';
      mostrarError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar todos los pedidos validados
  const handleConfirmarTodos = async () => {
    // Validar RFC antes de confirmar
    if (!rfcValidado || !rfc) {
      mostrarError('Debes ingresar un RFC válido para cerrar el contrato');
      setErrorRfc('RFC requerido para confirmar el pedido');
      return;
    }

    const pedidosAprobados = productosSeleccionados.filter(
      prodId => validaciones[prodId]?.puede_aprobar
    );

    if (pedidosAprobados.length === 0) {
      mostrarError('No hay pedidos aprobados para confirmar');
      return;
    }

    setLoading(true);
    let exitosos = 0;
    let fallidos = 0;

    for (const productoId of pedidosAprobados) {
      try {
        const contratoInfo = obtenerContratoInfo(productoId);
        const payload = {
          contrato_id: contratoInfo.contrato_id,
          cliente_id: contratoInfo.cliente_id,
          producto_id: contratoInfo.producto_id,
          cantidad: parseInt(cantidades[productoId]),
          rfc: rfc.toUpperCase().trim()
        };
        
        console.log('📤 Enviando pedido:', payload);
        const response = await pedidosService.crear(payload);
        console.log('✅ Pedido creado exitosamente:', response.data);
        exitosos++;
      } catch (error) {
        console.error(`❌ Error al crear pedido para producto ${productoId}:`, error);
        console.error('Detalles del error:', error.response?.data);
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data?.error || error.message);
        
        // Mostrar error específico del backend si está disponible
        const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Error desconocido';
        console.error(`🔴 Razón del fallo: ${errorMsg}`);
        fallidos++;
      }
    }

    if (exitosos > 0) {
      mostrarExito(`${exitosos} pedido(s) creado(s) exitosamente con RFC: ${rfc}`);
    }
    if (fallidos > 0) {
      mostrarError(`${fallidos} pedido(s) fallaron`);
    }

    // Recargar datos y limpiar
    await cargarProductosCliente(clienteSeleccionado);
    setProductosSeleccionados([]);
    setCantidades({});
    setValidaciones({});
    setRfc('');
    setRfcValidado(false);
    setErrorRfc('');
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva Solicitud de Pedido</h1>
        <p className="text-slate-500 mt-1">Selecciona el cliente y el tipo de tarjeta que deseas solicitar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selección de Cliente */}
          <div className="bg-white p-6 rounded-xl shadow-card border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-primary" />
              Seleccionar Cliente
            </label>
            <div className="relative">
              <select
                value={clienteSeleccionado || ''}
                onChange={(e) => {
                  setClienteSeleccionado(e.target.value);
                }}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-slate-900"
              >
                <option value="">-- Seleccione un cliente --</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RFC del Cliente */}
          {clienteSeleccionado && (
            <div className="bg-white p-6 rounded-xl shadow-card border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-secondary" />
                RFC del Cliente (Requerido para cerrar contrato)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rfc}
                  onChange={handleRfcChange}
                  placeholder="XAXX010101000 (12 o 13 caracteres)"
                  maxLength="13"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all text-slate-900 uppercase ${
                    rfcValidado
                      ? 'border-green-500 bg-green-50 focus:ring-green-500/20 focus:border-green-500'
                      : errorRfc
                      ? 'border-red-500 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-300 bg-slate-50 focus:ring-brand-primary/20 focus:border-brand-primary'
                  }`}
                />
                {rfcValidado && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
              {errorRfc && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errorRfc}
                </p>
              )}
              {rfcValidado && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  RFC válido
                </p>
              )}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Importante:</strong> El RFC es necesario para formalizar el contrato de las tarjetas. 
                  Debe ser un RFC válido de 12 caracteres (persona moral) o 13 caracteres (persona física).
                </p>
              </div>
            </div>
          )}

          {/* Selección de Productos Múltiples */}
          {clienteSeleccionado && (
            <div className="bg-white p-6 rounded-xl shadow-card border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Box className="w-4 h-4 text-brand-secondary" />
                Tipos de Tarjetas Disponibles
              </label>
              {loadingProductos ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                </div>
              ) : productosDisponibles.length > 0 ? (
                <div className="space-y-3">
                  {productosDisponibles.map((producto) => {
                    const contratoInfo = obtenerContratoInfo(producto.id);
                    const isSeleccionado = productosSeleccionados.includes(producto.id);
                    const validacion = validaciones[producto.id];
                    
                    return (
                      <div 
                        key={producto.id} 
                        onClick={() => toggleProducto(producto.id)}
                        className={`relative border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md group ${
                          isSeleccionado 
                            ? 'border-brand-primary bg-brand-primary/5 shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-brand-primary/40'
                        }`}
                      >
                        {/* Indicador de selección */}
                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSeleccionado 
                            ? 'bg-brand-primary border-brand-primary' 
                            : 'bg-white border-slate-300 group-hover:border-brand-primary/40'
                        }`}>
                          {isSeleccionado && (
                            <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />
                          )}
                        </div>

                        <div className="pr-8">
                          {/* Header de la tarjeta */}
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              isSeleccionado ? 'bg-brand-primary/10' : 'bg-slate-50 group-hover:bg-brand-primary/10'
                            } transition-colors`}>
                              <CreditCard className={`w-4 h-4 ${
                                isSeleccionado ? 'text-brand-primary' : 'text-slate-500 group-hover:text-brand-primary'
                              } transition-colors`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 text-base truncate">{producto.nombre}</h4>
                              <div className="flex items-center gap-2 mt-0.5 text-xs">
                                <span className="text-slate-600">{producto.tipo}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">Stock: {producto.stock_actual}</span>
                              </div>
                            </div>
                            {/* Badge de uso inline */}
                            {contratoInfo && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                contratoInfo.porcentaje_uso >= 70 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                <Activity className="w-3 h-3" />
                                {contratoInfo.porcentaje_uso}%
                              </div>
                            )}
                          </div>

                          {/* Contenido expandible al seleccionar */}
                          {isSeleccionado && contratoInfo && (
                            <div className="mt-3 space-y-2.5 pt-3 border-t border-slate-200" onClick={(e) => e.stopPropagation()}>
                              {/* Mini stats compactas */}
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white p-2 rounded border border-slate-200 text-center">
                                  <div className="text-[10px] font-medium text-slate-500 uppercase mb-0.5">Emitidas</div>
                                  <div className="text-base font-bold text-slate-900">{contratoInfo.tarjetas_emitidas}</div>
                                </div>
                                <div className="bg-emerald-50 p-2 rounded border border-emerald-200 text-center">
                                  <div className="text-[10px] font-medium text-emerald-600 uppercase mb-0.5">Activas</div>
                                  <div className="text-base font-bold text-emerald-700">{contratoInfo.tarjetas_activas}</div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                                  <div className="text-[10px] font-medium text-slate-500 uppercase mb-0.5">Inactivas</div>
                                  <div className="text-base font-bold text-slate-700">{contratoInfo.tarjetas_inactivas}</div>
                                </div>
                              </div>

                              {/* Input cantidad y botón validar */}
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={cantidades[producto.id] || ''}
                                  onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                                  placeholder="Cantidad"
                                  min="1"
                                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
                                />
                                <button
                                  onClick={() => handleValidarProducto(producto.id)}
                                  disabled={loading || !cantidades[producto.id]}
                                  className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold whitespace-nowrap"
                                >
                                  Validar
                                </button>
                              </div>

                              {/* Resultado de validación */}
                              {validacion && (
                                <div className={`p-3 rounded-lg border ${
                                  validacion.puede_aprobar
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    {validacion.puede_aprobar ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={`font-medium text-xs ${
                                      validacion.puede_aprobar ? 'text-emerald-700' : 'text-red-700'
                                    }`}>
                                      {validacion.razon}
                                    </span>
                                  </div>
                                  {validacion.puede_aprobar && validacion.tarjetas_permitidas && (
                                    <div className="mt-1.5 text-xs text-emerald-700">
                                      Permitidas: <strong>{validacion.tarjetas_permitidas}</strong>
                                    </div>
                                  )}
                                </div>
                              )}

                              {contratoInfo.porcentaje_uso < 70 && !validacion && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-xs text-amber-700 font-medium">
                                    Rendimiento bajo: puede requerir aprobación especial
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800">Sin contratos activos</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Este cliente no tiene contratos activos. Contacte a su ejecutivo de cuenta para más información.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Resumen de Pedidos */}
        <div className="lg:col-span-1">
          {productosSeleccionados.length > 0 ? (
            <div className="bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden sticky top-24">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-primary" />
                  Resumen de Pedidos
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {productosSeleccionados.length} producto(s) seleccionado(s)
                </p>
              </div>
              
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {productosSeleccionados.map((productoId) => {
                  const producto = productosDisponibles.find(p => p.id === productoId);
                  const validacion = validaciones[productoId];
                  const cantidad = cantidades[productoId];
                  
                  return (
                    <div key={productoId} className="border border-slate-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-slate-900">{producto?.nombre}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{producto?.tipo}</div>
                      
                      {cantidad && (
                        <div className="mt-2 text-xs">
                          <span className="text-slate-500">Cantidad: </span>
                          <span className="font-medium text-slate-900">{cantidad}</span>
                        </div>
                      )}
                      
                      {validacion && (
                        <div className={`mt-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                          validacion.puede_aprobar
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {validacion.puede_aprobar ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Aprobado
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Rechazado
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {Object.values(validaciones).some(v => v?.puede_aprobar) && (
                <div className="p-4 border-t border-slate-200">
                  {!rfcValidado && (
                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-amber-700">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">
                          Ingresa el RFC del cliente para poder confirmar los pedidos
                        </span>
                      </div>
                    </div>
                  )}
                  {rfcValidado && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <div className="font-medium">RFC validado</div>
                          <div className="mt-0.5 text-green-600">{rfc}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleConfirmarTodos}
                    disabled={loading || !rfcValidado}
                    className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirmar y Cerrar Contrato
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-2">
                    {Object.values(validaciones).filter(v => v?.puede_aprobar).length} pedido(s) aprobado(s)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-8 text-center h-full flex flex-col items-center justify-center text-slate-400 sticky top-24">
              <Package className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Selecciona productos para crear pedidos</p>
              <p className="text-xs mt-1">Puedes seleccionar múltiples productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolicitudPedido;
