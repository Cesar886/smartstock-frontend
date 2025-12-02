import React, { useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { NotificacionContext } from '../context/NotificacionContext';

export const NotificacionProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const eliminarNotificacion = useCallback((id) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  }, []);

  const agregarNotificacion = useCallback((mensaje, tipo = 'info', duracion = 5000) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const nuevaNotificacion = { id, mensaje, tipo };
    
    setNotificaciones(prev => [...prev, nuevaNotificacion]);
    
    if (duracion > 0) {
      setTimeout(() => {
        setNotificaciones(current => current.filter(n => n.id !== id));
      }, duracion);
    }
    
    return id;
  }, []);

  const exito = useCallback((mensaje, duracion = 3000) => agregarNotificacion(mensaje, 'exito', duracion), [agregarNotificacion]);
  const error = useCallback((mensaje, duracion = 8000) => agregarNotificacion(mensaje, 'error', duracion), [agregarNotificacion]);
  const advertencia = useCallback((mensaje, duracion = 5000) => agregarNotificacion(mensaje, 'advertencia', duracion), [agregarNotificacion]);
  const info = useCallback((mensaje, duracion = 4000) => agregarNotificacion(mensaje, 'info', duracion), [agregarNotificacion]);

  return (
    <NotificacionContext.Provider value={{ exito, error, advertencia, info }}>
      {children}
      <ContenedorNotificaciones 
        notificaciones={notificaciones} 
        onEliminar={eliminarNotificacion} 
      />
    </NotificacionContext.Provider>
  );
};

const ContenedorNotificaciones = ({ notificaciones, onEliminar }) => {
  const getIcono = (tipo) => {
    switch (tipo) {
      case 'exito':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'advertencia':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getEstilos = (tipo) => {
    switch (tipo) {
      case 'exito':
        return 'bg-white border-l-4 border-emerald-500 text-slate-800 shadow-lg shadow-emerald-500/10';
      case 'error':
        return 'bg-white border-l-4 border-red-500 text-slate-800 shadow-lg shadow-red-500/10';
      case 'advertencia':
        return 'bg-white border-l-4 border-amber-500 text-slate-800 shadow-lg shadow-amber-500/10';
      default:
        return 'bg-white border-l-4 border-blue-500 text-slate-800 shadow-lg shadow-blue-500/10';
    }
  };

  const getIconoColor = (tipo) => {
    switch (tipo) {
      case 'exito': return 'text-emerald-500';
      case 'error': return 'text-red-500';
      case 'advertencia': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  if (notificaciones.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 w-full max-w-md pointer-events-none">
      {notificaciones.map(notificacion => (
        <div
          key={notificacion.id}
          className={`pointer-events-auto w-full border border-slate-100 rounded-lg p-4 flex items-start gap-3 transform transition-all duration-500 ease-out animate-in slide-in-from-right-full fade-in ${getEstilos(notificacion.tipo)}`}
        >
          <div className={`flex-shrink-0 mt-0.5 ${getIconoColor(notificacion.tipo)}`}>
            {getIcono(notificacion.tipo)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">{notificacion.mensaje}</p>
          </div>
          <button
            onClick={() => onEliminar(notificacion.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

