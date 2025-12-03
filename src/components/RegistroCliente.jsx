import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, X, CheckCircle, Mail, Phone, ArrowLeft, List, Lock, Eye, EyeOff } from 'lucide-react';

const RegistroCliente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    contacto_email: '',
    contacto_tel: '',
    password: '',
    confirmar_password: ''
  });

  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrores([]);
  };

  const handleRFCChange = (e) => {
    let value = e.target.value.toUpperCase();
    // Solo permitir letras, números y &
    value = value.replace(/[^A-ZÑ&0-9]/g, '');
    // Máximo 12 caracteres
    value = value.slice(0, 12);
    setFormData(prev => ({
      ...prev,
      rfc: value
    }));
    setErrores([]);
  };

  const handleTelefonoChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    // Máximo 15 dígitos
    value = value.slice(0, 15);
    setFormData(prev => ({
      ...prev,
      contacto_tel: value
    }));
    setErrores([]);
  };

  const validarFormulario = () => {
    const erroresValidacion = [];

    // Validar nombre
    if (!formData.nombre.trim()) {
      erroresValidacion.push('El nombre de la empresa es requerido');
    } else if (formData.nombre.trim().length < 3) {
      erroresValidacion.push('El nombre de la empresa debe tener mínimo 3 caracteres');
    }

    // Validar RFC
    if (!formData.rfc || formData.rfc.length !== 12) {
      erroresValidacion.push('El RFC debe tener exactamente 12 caracteres');
    } else {
      const rfcRegex = /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/;
      if (!rfcRegex.test(formData.rfc)) {
        erroresValidacion.push('Formato de RFC inválido. Ejemplo: ABC123456XYZ');
      }
    }

    // Validar email
    if (!formData.contacto_email.trim()) {
      erroresValidacion.push('El correo electrónico es requerido');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contacto_email)) {
        erroresValidacion.push('El formato del correo electrónico no es válido');
      }
    }

    // Validar teléfono
    if (!formData.contacto_tel.trim()) {
      erroresValidacion.push('El número de teléfono es requerido');
    } else if (formData.contacto_tel.length < 10) {
      erroresValidacion.push('El teléfono debe tener mínimo 10 dígitos');
    }

    // Validar contraseña
    if (!formData.password) {
      erroresValidacion.push('La contraseña es requerida');
    } else if (formData.password.length < 6) {
      erroresValidacion.push('La contraseña debe tener mínimo 6 caracteres');
    }

    // Validar confirmación de contraseña
    if (!formData.confirmar_password) {
      erroresValidacion.push('Debe confirmar la contraseña');
    } else if (formData.password !== formData.confirmar_password) {
      erroresValidacion.push('Las contraseñas no coinciden');
    }

    return erroresValidacion;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresValidacion = validarFormulario();
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setLoading(true);
    setErrores([]);

    try {
      // Enviar solo los campos necesarios (sin confirmar_password)
      // eslint-disable-next-line no-unused-vars
      const { confirmar_password, ...datosCliente } = formData;
      
      console.log('📤 Enviando datos al servidor:', datosCliente);
      
      const response = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCliente)
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📋 Datos de respuesta:', data);

      if (response.ok && data.success) {
        setSuccess(true);
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          rfc: '',
          contacto_email: '',
          contacto_tel: '',
          password: '',
          confirmar_password: ''
        });
        
        // Mantener el mensaje de éxito por 3 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        // Error del servidor
        console.error('❌ Error del servidor:', data);
        if (data.errores && Array.isArray(data.errores)) {
          setErrores(data.errores);
        } else if (data.error) {
          setErrores([data.error]);
        } else if (data.detalle) {
          setErrores([data.detalle]);
        } else {
          setErrores(['Error al registrar cliente. Por favor, revise los datos e intente nuevamente.']);
        }
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      setErrores([`Error de conexión: ${error.message}. Verifica que el servidor esté corriendo en el puerto 3001.`]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerListaClientes = () => {
    navigate('/admin/clientes');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header con botón de regreso */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Registro de Nuevo Cliente
            </h1>
            <p className="text-gray-600 mt-1">Complete todos los datos requeridos</p>
          </div>
        </div>
      </div>

      {/* Mensajes de Error */}
      {errores.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Errores de validación:</h3>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de Éxito */}
      {success && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="font-semibold text-green-900">
                ✅ Cliente registrado exitosamente
              </div>
            </div>
            <button
              onClick={handleVerListaClientes}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <List className="w-4 h-4" />
              Ver lista de clientes
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* INFORMACIÓN BÁSICA */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Datos del Cliente
          </h2>

          <div className="space-y-4">
            {/* Nombre de la Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Grupo Empresarial ABC S.A. de C.V."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                required
                autoFocus
              />
              <div className="text-sm text-gray-500 mt-1">
                Mínimo 3 caracteres
              </div>
            </div>

            {/* RFC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFC (Persona Moral) *
              </label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleRFCChange}
                placeholder="ABC123456XYZ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono uppercase text-lg tracking-wider"
                maxLength={12}
                required
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-500">
                  3 letras + 6 números + 3 caracteres
                </div>
                <div className={`text-sm font-medium ${
                  formData.rfc.length === 12 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {formData.rfc.length}/12 caracteres
                </div>
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="contacto_email"
                  value={formData.contacto_email}
                  onChange={handleChange}
                  placeholder="contacto@empresa.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  required
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Correo de contacto principal de la empresa
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="contacto_tel"
                  value={formData.contacto_tel}
                  onChange={handleTelefonoChange}
                  placeholder="5512345678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                  maxLength={15}
                  required
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-500">
                  Mínimo 10 dígitos (sin espacios ni guiones)
                </div>
                <div className={`text-sm font-medium ${
                  formData.contacto_tel.length >= 10 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {formData.contacto_tel.length} dígitos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEGURIDAD - CONTRASEÑA */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-purple-600" />
            Seguridad de la Cuenta
          </h2>

          <div className="space-y-4">
            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crea una contraseña segura"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-500">
                  Mínimo 6 caracteres
                </div>
                <div className={`text-sm font-medium ${
                  formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {formData.password.length}/6 caracteres
                </div>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={mostrarConfirmarPassword ? 'text' : 'password'}
                  name="confirmar_password"
                  value={formData.confirmar_password}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarConfirmarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmar_password && (
                <div className={`text-sm mt-1 font-medium ${
                  formData.password === formData.confirmar_password && formData.password.length >= 6
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmar_password && formData.password.length >= 6
                    ? '✓ Las contraseñas coinciden'
                    : '✗ Las contraseñas no coinciden'}
                </div>
              )}
            </div>

            {/* Nota de seguridad */}
            <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
              <div className="text-sm text-purple-700">
                <strong>🔒 Importante:</strong> Esta contraseña se usará para iniciar sesión. El nombre de tu empresa será tu usuario.
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2 text-lg transition-colors"
          >
            <Save className="w-6 h-6" />
            {loading ? 'Registrando...' : 'Registrar Cliente'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({ 
                nombre: '', 
                rfc: '', 
                contacto_email: '', 
                contacto_tel: '',
                password: '',
                confirmar_password: ''
              });
              setErrores([]);
              setSuccess(false);
            }}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Información de ayuda */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ejemplos de RFC */}
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="text-sm">
            <div className="font-semibold text-blue-900 mb-2">📝 RFC válido:</div>
            <div className="space-y-1 text-blue-700 font-mono text-xs">
              <div>• ABC123456XYZ</div>
              <div>• XYZ850315AB1</div>
            </div>
            <div className="mt-2 text-blue-700 text-xs">
              <strong>Nota:</strong> Solo RFC Moral (12 caracteres)
            </div>
          </div>
        </div>

        {/* Ejemplos de contacto */}
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <div className="text-sm">
            <div className="font-semibold text-green-900 mb-2">📞 Contacto:</div>
            <div className="space-y-1 text-green-700 text-xs">
              <div>• Email: empresa@mail.com</div>
              <div>• Tel: 5512345678</div>
            </div>
            <div className="mt-2 text-green-700 text-xs">
              <strong>Importante:</strong> Datos validados
            </div>
          </div>
        </div>

        {/* Información de login */}
        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
          <div className="text-sm">
            <div className="font-semibold text-purple-900 mb-2">🔐 Acceso:</div>
            <div className="space-y-1 text-purple-700 text-xs">
              <div>• Usuario: Nombre empresa</div>
              <div>• Contraseña: Mín 6 caracteres</div>
            </div>
            <div className="mt-2 text-purple-700 text-xs">
              <strong>Nota:</strong> Se usa para login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;
