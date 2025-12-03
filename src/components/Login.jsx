import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ShieldCheck, UserCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username, selectedRole);
      // Redirigir según el rol
      if (selectedRole === 'admin') {
        navigate('/admin/rendimiento');
      } else {
        navigate('/pedidos/solicitar');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">SmartStock</h1>
          <p className="text-slate-600">Sistema de Gestión de Inventario</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ingresa tu nombre de usuario"
                  required
                />
              </div>
            </div>

            {/* Contraseña (solo visual, no se valida) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                * Login de prueba - No requiere validación real
              </p>
            </div>

            {/* Selección de Rol */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Tipo de Usuario
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('user')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === 'user'
                      ? 'border-purple-600 bg-purple-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <UserCircle className={`w-8 h-8 mx-auto mb-2 ${
                    selectedRole === 'user' ? 'text-purple-600' : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-semibold ${
                    selectedRole === 'user' ? 'text-purple-900' : 'text-slate-600'
                  }`}>
                    Usuario
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Panel de Pedidos</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === 'admin'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className={`w-8 h-8 mx-auto mb-2 ${
                    selectedRole === 'admin' ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-semibold ${
                    selectedRole === 'admin' ? 'text-blue-900' : 'text-slate-600'
                  }`}>
                    Admin
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Panel Completo</div>
                </button>
              </div>
            </div>

            {/* Botón de Submit */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Ingresar como {selectedRole === 'admin' ? 'Administrador' : 'Usuario'}
            </button>
          </form>

          {/* Info de prueba */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              🔓 Sistema de prueba - Ingresa cualquier nombre de usuario
            </p>
          </div>

          {/* Link de registro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/clientes/nuevo"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Registrarse aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
