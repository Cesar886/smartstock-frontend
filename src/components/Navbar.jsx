import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, AlertTriangle, BarChart3, FileText, Truck, MapPin, Warehouse, MessageSquare, Upload } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
                  isActive('/') 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Home className={`w-4 h-4 ${isActive('/') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Inicio</span>
              </Link>

              <Link
                to="/dashboard"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${isActive('/dashboard') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Rendimiento</span>
              </Link>

              <Link
                to="/inventario"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/inventario') 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Package className={`w-4 h-4 ${isActive('/inventario') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Inventario</span>
              </Link>
              
              <Link
                to="/solicitar"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/solicitar') 
                    ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Warehouse className={`w-4 h-4 ${isActive('/solicitar') ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>Pedidos</span>
              </Link>

              <Link
                to="/solicitar-validado"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/solicitar-validado') 
                    ? 'bg-white text-green-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Upload className={`w-4 h-4 ${isActive('/solicitar-validado') ? 'text-green-600' : 'text-slate-400'}`} />
                <span>Validado</span>
              </Link>

              <Link
                to="/envios"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/envios') 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Truck className={`w-4 h-4 ${isActive('/envios') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Envíos</span>
              </Link>

              <Link
                to="/tracking"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all duration-200 ${
                  isActive('/tracking') 
                    ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <MapPin className={`w-4 h-4 ${isActive('/tracking') ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>Rastrear</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
