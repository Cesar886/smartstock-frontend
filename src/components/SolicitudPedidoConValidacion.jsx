import React, { useState, useEffect } from 'react';
import { Upload, Download, CheckCircle, AlertTriangle, X, FileText } from 'lucide-react';
import { clientesService } from '../services/api';

const SolicitudPedidoConValidacion = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [validacionResultado, setValidacionResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await clientesService.getAll();
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const descargarPlantilla = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/validacion/plantilla');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_nomina_empleados.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      alert('Error al descargar plantilla');
    }
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Solo se permiten archivos CSV');
        return;
      }
      setArchivo(file);
      setValidacionResultado(null);
      setError(null);
    }
  };

  const validarArchivo = async () => {
    if (!clienteSeleccionado) {
      alert('Selecciona un cliente primero');
      return;
    }

    if (!cantidad || parseInt(cantidad) <= 0) {
      alert('Ingresa una cantidad válida de tarjetas');
      return;
    }

    if (!archivo) {
      alert('Selecciona un archivo CSV');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('clienteId', clienteSeleccionado);
      formData.append('cantidadTarjetasSolicitadas', cantidad);

      const response = await fetch('http://localhost:3001/api/validacion/nomina', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setValidacionResultado(data);
      } else {
        setError(data);
        setValidacionResultado(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al validar archivo');
    } finally {
      setLoading(false);
    }
  };

  const crearPedido = async () => {
    if (!validacionResultado || !validacionResultado.success) {
      alert('Primero debes validar el archivo correctamente');
      return;
    }

    alert('🎉 Pedido creado exitosamente con nómina validada');
    // Aquí conectarías con tu endpoint de crear pedido
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Solicitud de Pedido</h1>
        <p className="text-gray-600 mt-1">Con validación de nómina de empleados</p>
      </div>

      {/* PASO 1: Seleccionar Cliente */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">1. Seleccionar Cliente</h2>
        <select
          value={clienteSeleccionado || ''}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">-- Selecciona un cliente --</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* PASO 2: Cantidad de Tarjetas */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">2. Cantidad de Tarjetas</h2>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Ej: 200"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          min="1"
        />
        {cantidad && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
            <div className="font-medium text-blue-900">Requisito de validación:</div>
            <div className="text-blue-700">
              Debes subir un archivo con mínimo <strong>{Math.ceil(parseInt(cantidad) * 0.9)}</strong> empleados válidos (90% de {cantidad})
            </div>
          </div>
        )}
      </div>

      {/* PASO 3: Descargar Plantilla */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow p-6 mb-6 border-2 border-green-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Download className="w-6 h-6 text-green-600" />
          3. Descargar Plantilla
        </h2>
        <p className="text-gray-700 mb-4">
          Descarga la plantilla, llénala con los datos de tus empleados (RFC y Nombre completo) y súbela en el siguiente paso.
        </p>
        <button
          onClick={descargarPlantilla}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold"
        >
          <Download className="w-5 h-5" />
          Descargar Plantilla CSV
        </button>
      </div>

      {/* PASO 4: Subir Archivo */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          4. Subir Archivo de Nómina
        </h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleArchivoChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <FileText className="w-16 h-16 text-gray-400 mb-3" />
            <div className="text-lg font-medium text-gray-900 mb-1">
              {archivo ? archivo.name : 'Selecciona un archivo CSV'}
            </div>
            <div className="text-sm text-gray-600">
              Click para seleccionar o arrastra aquí
            </div>
          </label>
        </div>

        {archivo && (
          <button
            onClick={validarArchivo}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? 'Validando...' : 'Validar Archivo'}
          </button>
        )}
      </div>

      {/* RESULTADO DE VALIDACIÓN - ERROR */}
      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">
                ❌ {error.mensaje || 'Error de Validación'}
              </h3>
              
              {error.detalle && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Tarjetas solicitadas:</div>
                      <div className="text-lg font-bold text-gray-900">
                        {error.detalle.tarjetas_solicitadas}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Mínimo requerido (90%):</div>
                      <div className="text-lg font-bold text-orange-600">
                        {error.detalle.minimo_empleados_requerido}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Empleados válidos encontrados:</div>
                      <div className="text-lg font-bold text-red-600">
                        {error.detalle.empleados_validos_encontrados}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Te faltan:</div>
                      <div className="text-lg font-bold text-red-600">
                        {error.detalle.faltante} empleados más
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600">Porcentaje cumplido:</div>
                    <div className="text-3xl font-bold text-red-600">
                      {error.detalle.porcentaje_cumplido}%
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-red-700 mb-4">
                Por favor, agrega más empleados a tu archivo y vuelve a intentar.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTADO DE VALIDACIÓN - ÉXITO */}
      {validacionResultado && validacionResultado.success && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">
                ✅ Archivo Validado Exitosamente
              </h3>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total registros:</div>
                    <div className="text-lg font-bold text-gray-900">
                      {validacionResultado.resumen.total_registros}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Empleados válidos:</div>
                    <div className="text-lg font-bold text-green-600">
                      {validacionResultado.resumen.empleados_validos}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Mínimo requerido:</div>
                    <div className="text-lg font-bold text-orange-600">
                      {validacionResultado.resumen.minimo_requerido}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Porcentaje:</div>
                    <div className="text-lg font-bold text-green-600">
                      {validacionResultado.resumen.porcentaje_cumplido}%
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={crearPedido}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold text-lg"
              >
                ✅ Crear Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudPedidoConValidacion;
