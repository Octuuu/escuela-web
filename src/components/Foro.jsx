import React, { useEffect, useState } from 'react';
import CommentCard from './CommentCard.jsx';
import { supabase } from '../lib/supabaseClient.js'; 

export default function Foro() {
  const [comentarios, setComentarios] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('pageid', 'inicio')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener comentarios:', error);
        setComentarios([]);
      } else {
        setComentarios(data);
      }
    };

    fetchComentarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: formData.name.trim() || 'Anónimo',
      content: formData.content.trim(),
      pageid: 'inicio',
    };

    const { error } = await supabase.from('comments').insert([payload]);

    if (!error) {
      setFormData({ name: '', content: '' });
      setMensaje({ tipo: 'success', texto: 'Comentario enviado' });

      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('pageid', 'inicio')
        .order('created_at', { ascending: false });

      setComentarios(data);
    } else {
      setMensaje({ tipo: 'error', texto: 'Error al enviar comentario' });
    }

    setTimeout(() => setMensaje(null), 4000);
  };

  const comentariosVisibles = mostrarTodos ? comentarios : comentarios.slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      {mensaje && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-center font-medium ${
          mensaje.tipo === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className=" backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4 text-white">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">Foro de comentarios</h2>
        <input
          type="text"
          name="name"
          placeholder="Ingrese su nombre (no es obligatorio)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-transparent border-0 border-b-2 border-white/30 text-white placeholder-white/70 px-0 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
        />

        <textarea
          name="content"
          placeholder="Escribe tu comentario"
          required
          rows="4"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full bg-transparent border-0 border-b-2 border-white/30 text-white placeholder-white/70 px-0 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
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
