import { useContext } from 'react';
import { NotificacionContext } from '../context/NotificacionContext';

export const useNotificaciones = () => {
  const context = useContext(NotificacionContext);
  if (!context) {
    throw new Error('useNotificaciones debe ser usado dentro de NotificacionProvider');
  }
  return context;
};