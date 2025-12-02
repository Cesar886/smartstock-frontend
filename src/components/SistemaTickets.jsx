import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

const SistemaTickets = ({ clienteId }) => {
  const [tickets, setTickets] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarNuevoTicket, setMostrarNuevoTicket] = useState(false);
  const [loading, setLoading] = useState(true);

  // Formulario nuevo ticket
  const [nuevoTicket, setNuevoTicket] = useState({
    tipo: 'consulta',
    asunto: '',
    mensaje: ''
  });

  // Nueva respuesta
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tickets/cliente/${clienteId}`);
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar tickets:', error);
        setLoading(false);
      }
    };

    cargarTickets();
  }, [clienteId]);

  const cargarTickets = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tickets/cliente/${clienteId}`);
      const data = await response.json();
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      setLoading(false);
    }
  };

  const crearTicket = async () => {
    if (!nuevoTicket.asunto || !nuevoTicket.mensaje) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          tipo: nuevoTicket.tipo,
          asunto: nuevoTicket.asunto,
          mensaje: nuevoTicket.mensaje,
          creado_por: 1 // TODO: usar ID de usuario real
        })
      });

      if (response.ok) {
        alert('✅ Ticket creado exitosamente');
        setMostrarNuevoTicket(false);
        setNuevoTicket({ tipo: 'consulta', asunto: '', mensaje: '' });
        cargarTickets();
      }
    } catch (error) {
      console.error('Error al crear ticket:', error);
      alert('Error al crear ticket');
    }
  };

  const cargarDetalleTicket = async (ticketId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tickets/${ticketId}`);
      const data = await response.json();
      setTicketSeleccionado(data.ticket);
      setRespuestas(data.respuestas);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    }
  };

  const enviarRespuesta = async () => {
    if (!nuevaRespuesta.trim()) {
      alert('Escribe un mensaje');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/tickets/respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketSeleccionado.id,
          usuario_id: 1, // TODO: usar ID de usuario real
          mensaje: nuevaRespuesta
        })
      });

      if (response.ok) {
        setNuevaRespuesta('');
        cargarDetalleTicket(ticketSeleccionado.id);
      }
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    }
  };

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'abierto':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Abierto
          </span>
        );
      case 'en_proceso':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <MessageSquare className="w-3 h-3" />
            En Proceso
          </span>
        );
      case 'resuelto':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Resuelto
          </span>
        );
      case 'cerrado':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            <X className="w-3 h-3" />
            Cerrado
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="p-6">Cargando tickets...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda</h1>
          <p className="text-gray-600 mt-1">
            Comunicación directa con OneCard
          </p>
        </div>
        <button
          onClick={() => setMostrarNuevoTicket(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Nuevo Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Tickets */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mis Tickets</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {tickets.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <div className="text-sm">No tienes tickets</div>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => cargarDetalleTicket(ticket.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      ticketSeleccionado?.id === ticket.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900 text-sm">
                        {ticket.asunto}
                      </div>
                      {getEstadoBadge(ticket.estado)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(ticket.fecha_creacion).toLocaleDateString('es-MX')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MessageSquare className="w-3 h-3" />
                      {ticket.num_respuestas} respuestas
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detalle del Ticket */}
        <div className="lg:col-span-2">
          {ticketSeleccionado ? (
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {ticketSeleccionado.asunto}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1">
                      Ticket #{ticketSeleccionado.id} • {' '}
                      {new Date(ticketSeleccionado.fecha_creacion).toLocaleDateString('es-MX')}
                    </div>
                  </div>
                  {getEstadoBadge(ticketSeleccionado.estado)}
                </div>
              </div>

              {/* Conversación */}
              <div className="p-6 max-h-[400px] overflow-y-auto">
                {/* Mensaje inicial */}
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="font-medium text-blue-900 mb-1">
                          {ticketSeleccionado.cliente_nombre}
                        </div>
                        <div className="text-gray-700">
                          {ticketSeleccionado.mensaje}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(ticketSeleccionado.fecha_creacion).toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Respuestas */}
                {respuestas.map((respuesta) => (
                  <div key={respuesta.id} className="mb-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-full ${
                        respuesta.usuario_email?.includes('onecard') 
                          ? 'bg-green-100' 
                          : 'bg-gray-100'
                      }`}>
                        <MessageSquare className={`w-5 h-5 ${
                          respuesta.usuario_email?.includes('onecard')
                            ? 'text-green-600'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className={`p-4 rounded-lg ${
                          respuesta.usuario_email?.includes('onecard')
                            ? 'bg-green-50'
                            : 'bg-gray-50'
                        }`}>
                          <div className="font-medium mb-1">
                            {respuesta.usuario_email?.includes('onecard')
                              ? 'Soporte OneCard'
                              : 'Tú'}
                          </div>
                          <div className="text-gray-700">
                            {respuesta.mensaje}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(respuesta.fecha_creacion).toLocaleString('es-MX')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Campo de Respuesta */}
              {ticketSeleccionado.estado !== 'cerrado' && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <textarea
                      value={nuevaRespuesta}
                      onChange={(e) => setNuevaRespuesta(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                    />
                    <button
                      onClick={enviarRespuesta}
                      className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                Selecciona un ticket
              </div>
              <div className="text-gray-600">
                O crea uno nuevo para comenzar una conversación
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nuevo Ticket */}
      {mostrarNuevoTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Ticket</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Solicitud
                </label>
                <select
                  value={nuevoTicket.tipo}
                  onChange={(e) => setNuevoTicket({...nuevoTicket, tipo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="consulta">Consulta General</option>
                  <option value="solicitud_devolucion">Solicitud de Devolución</option>
                  <option value="problema">Reportar Problema</option>
                  <option value="activacion">Ayuda con Activación</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={nuevoTicket.asunto}
                  onChange={(e) => setNuevoTicket({...nuevoTicket, asunto: e.target.value})}
                  placeholder="Ej: Solicitud de devolución de 100 tarjetas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={nuevoTicket.mensaje}
                  onChange={(e) => setNuevoTicket({...nuevoTicket, mensaje: e.target.value})}
                  placeholder="Describe detalladamente tu solicitud..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="6"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setMostrarNuevoTicket(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={crearTicket}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemaTickets;
