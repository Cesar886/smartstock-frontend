import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Shield, FileText, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const isActive = (path) => location.pathname.startsWith(path) && path !== '/' || location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // No mostrar navbar en la página de login
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-10">
            <div className="flex items-center group cursor-pointer">
              <Link to="/" className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <span className="text-2xl font-bold text-slate-800 tracking-tight">
                    SmartStock <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pro</span>
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] uppercase tracking-wider rounded-full font-bold border border-purple-200">
                      OneCard Edition
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60">
              <Link
                to="/"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Home className={`w-4 h-4 ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Inicio</span>
              </Link>

              {/* Solo mostrar Panel Admin si es admin */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                    isActive('/admin') 
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Shield className={`w-4 h-4 ${isActive('/admin') ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Panel Admin</span>
                </Link>
              )}
              
              <Link
                to="/pedidos"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/pedidos') 
                    ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileText className={`w-4 h-4 ${isActive('/pedidos') ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>Panel de Pedidos</span>
              </Link>
            </div>
          </div>

          {/* Usuario y Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
              <User className="w-4 h-4 text-slate-600" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900">{user?.username}</div>
                <div className="text-xs text-slate-500">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center gap-2 border border-red-200 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
