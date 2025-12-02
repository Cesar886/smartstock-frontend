import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { verificarConexion } from '../services/api';

const EstadoConexion = () => {
  const [estado, setEstado] = useState({
    conectado: null,
    cargando: true,
    ultimaVerificacion: null
  });

  const verificarEstado = async () => {
    setEstado(prev => ({ ...prev, cargando: true }));
    
    const resultado = await verificarConexion();
    
    setEstado({
      conectado: resultado.conectado,
      cargando: false,
      ultimaVerificacion: new Date(),
      data: resultado.data || null,
      error: resultado.error || null
    });
  };

  useEffect(() => {
    // Función interna para la verificación inicial
    const inicializar = async () => {
      const resultado = await verificarConexion();
      setEstado({
        conectado: resultado.conectado,
        cargando: false,
        ultimaVerificacion: new Date(),
        data: resultado.data || null,
        error: resultado.error || null
      });
    };

    inicializar();
    
    // Verificar cada 30 segundos
    const interval = setInterval(verificarEstado, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (estado.cargando && estado.conectado === null) {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-primary" />
        <span>Conectando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        estado.conectado 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : 'bg-red-50 text-red-700 border-red-200'
      }`}>
        {estado.conectado ? (
          <>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span>Sistema Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Sin Conexión</span>
          </>
        )}
      </div>
      
      <button 
        onClick={verificarEstado}
        disabled={estado.cargando}
        className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
        title="Verificar conexión"
      >
        <RefreshCw className={`w-4 h-4 ${estado.cargando ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default EstadoConexion;