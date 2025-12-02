import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔹 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// CLIENTES
// ============================================
export const clientesService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
};

// ============================================
// PRODUCTOS
// ============================================
export const productosService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  getAlertasStock: () => api.get('/productos/alertas/stock'),
  updateStock: (id, data) => api.put(`/productos/${id}/stock`, data),
};

// ============================================
// CONTRATOS
// ============================================
export const contratosService = {
  getAll: () => api.get('/contratos'),
  getById: (id) => api.get(`/contratos/${id}`),
  getSaludContratos: () => api.get('/contratos/salud'),
  getByCliente: (clienteId) => api.get(`/contratos/cliente/${clienteId}`),
  getProductosByCliente: (clienteId) => api.get(`/contratos/cliente/${clienteId}/productos`),
  getResumen: () => api.get('/contratos/resumen/estadistico'),
};

// ============================================
// PEDIDOS
// ============================================
export const pedidosService = {
  validar: (contratoId, cantidad) => 
    api.post('/pedidos/validar', { contratoId, cantidad }),
  crear: (data) => api.post('/pedidos', data),
  getAll: () => api.get('/pedidos'),
  getPendientesEnvio: () => api.get('/pedidos?estado=pendiente_envio'),
  aprobar: (id, usuarioId) => api.put(`/pedidos/${id}/aprobar`, { usuario_id: usuarioId }),
  rechazar: (id, razon) => api.put(`/pedidos/${id}/rechazar`, { razon_rechazo: razon }),
};

// ============================================
// ALERTAS
// ============================================
export const alertasService = {
  getAll: () => api.get('/alertas'),
  getNoResueltas: () => api.get('/alertas/no-resueltas'),
  resolver: (id) => api.put(`/alertas/${id}/resolver`),
  generar: () => api.post('/alertas/generar'),
};

// ============================================
// ENVÍOS
// ============================================
export const enviosService = {
  crear: (data) => api.post('/envios', data),
  getActivos: () => api.get('/envios/activos'),
  getTracking: (trackingCode) => api.get(`/envios/tracking/${trackingCode}`),
  getByCliente: (clienteId) => api.get(`/envios/cliente/${clienteId}`),
  actualizarUbicacion: (id, data) => api.put(`/envios/${id}/ubicacion`, data),
  marcarEntregado: (id, data) => api.put(`/envios/${id}/entregar`, data),
};

// ============================================
// REPARTIDORES
// ============================================
export const repartidoresService = {
  getAll: () => api.get('/repartidores'),
  getDisponibles: () => api.get('/repartidores?disponible=true'),
  create: (data) => api.post('/repartidores', data),
  getEnvios: (id) => api.get(`/repartidores/${id}/envios`),
};

// ============================================
// TICKETS (COMUNICACIÓN)
// ============================================
export const ticketsService = {
  crear: (data) => api.post('/tickets', data),
  getByCliente: (clienteId) => api.get(`/tickets/cliente/${clienteId}`),
  getDetalle: (id) => api.get(`/tickets/${id}`),
  agregarRespuesta: (data) => api.post('/tickets/respuesta', data),
  cerrar: (id) => api.put(`/tickets/${id}/cerrar`),
};

// ============================================
// INVENTARIO
// ============================================
export const inventarioService = {
  getEstados: () => api.get('/inventario/estados'),
  getEstadoProducto: (productoId) => api.get(`/inventario/producto/${productoId}`),
  getResumen: () => api.get('/inventario/resumen'),
  getMovimientos: () => api.get('/inventario/movimientos'),
};

// ============================================
// VERIFICACIÓN DE CONEXIÓN
// ============================================
export const verificarConexion = async () => {
  try {
    const response = await api.get('/clientes', { timeout: 3000 });
    return { conectado: true, data: response.data };
  } catch (error) {
    console.error('Error de conexión:', error);
    return { conectado: false, error: error.message };
  }
};

export default api;
