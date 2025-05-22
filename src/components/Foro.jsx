import React, { useEffect, useState } from 'react';
import CommentCard from './CommentCard.jsx';

export default function Foro() {
  const [comentarios, setComentarios] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetch('https://ifd-backend-production.up.railway.app/api/comments/inicio')
      .then(res => res.json())
      .then(setComentarios)
      .catch(err => {
        console.error('Error al obtener comentarios:', err);
        setComentarios([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.name.trim(),
      content: formData.content.trim(),
      pageId: 'inicio',
    };

    try {
      const res = await fetch('https://ifd-backend-production.up.railway.app/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({ name: '', content: '' });
        setMensaje({ tipo: 'success', texto: 'Comentario enviado' });
        setTimeout(() => location.reload(), 1500);
      } else {
        const error = await res.json();
        setMensaje({ tipo: 'error', texto: error.error });
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión.' });
    }

    setTimeout(() => setMensaje(null), 4000);
  };

  const comentariosVisibles = mostrarTodos ? comentarios : comentarios.slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-semibold text-center text-white mb-8">Foro</h1>

      {mensaje && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-center font-medium ${mensaje.tipo === 'success'
          ? 'bg-green-100 text-green-800 border border-green-300'
          : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4 text-white">
        <input
          type="text"
          name="name"
          placeholder="Ingrese su nombre (no es obligatorio)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/70"
        />
        <textarea
          name="content"
          placeholder="Escribe tu comentario"
          required
          rows="4"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/70"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-4 py-2 rounded-lg shadow-md">
          Enviar comentario
        </button>
      </form>

      <div className="mt-10 space-y-2">
        {comentarios.length > 0 ? (
          <>
            {comentariosVisibles.map((comentario) => (
              <CommentCard key={comentario.id} comentario={comentario} />
            ))}
            {comentarios.length > 10 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition shadow"
                >
                  {mostrarTodos ? 'Ver menos' : 'Ver más'}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-white/70">No hay comentarios aún</p>
        )}
      </div>
    </div>
  );
}
