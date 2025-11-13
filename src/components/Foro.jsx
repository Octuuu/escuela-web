import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Foro() {
  const [comentarios, setComentarios] = useState([]);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [replyingToId, setReplyingToId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarRespuestas, setMostrarRespuestas] = useState({});

  useEffect(() => {
    fetchComentarios();
  }, []);

  const fetchComentarios = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('pageid', 'inicio')
      .order('id', { ascending: true }); 

    if (!error) {

      const principales = data.filter(c => c.parent_id === null);
      const respuestas = data.filter(c => c.parent_id !== null);

      const comentariosConRespuestas = principales.map(c => ({
        ...c,
        replies: respuestas.filter(r => r.parent_id === c.id),
      }));

      setComentarios(comentariosConRespuestas);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    const payload = {
      username: formData.name.trim() || 'Anónimo',
      content: formData.content.trim(),
      pageid: 'inicio',
      parent_id: replyingToId,
    };

    const { error } = await supabase.from('comments').insert([payload]);

    if (!error) {
      setFormData({ name: '', content: '' });
      setReplyingToId(null);
      setMensaje({ tipo: 'success', texto: 'Comentario enviado' });
      fetchComentarios();
    } else {
      setMensaje({ tipo: 'error', texto: 'Error al enviar comentario' });
    }

    setTimeout(() => setMensaje(null), 4000);
  };
  
  function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => 
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  }


  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 text-white">
      {mensaje && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-center font-medium ${
          mensaje.tipo === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">
          {replyingToId ? 'Respondiendo' : 'Foro de comentarios'}
        </h2>

        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-transparent border-0 border-b-2 border-white/30 text-white placeholder-white/70 px-0 py-2 focus:outline-none focus:border-blue-500"
        />

        <textarea
          placeholder={replyingToId ? 'Escribe tu respuesta...' : 'Escribe tu comentario'}
          required
          rows="4"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full bg-transparent border-0 border-b-2 border-white/30 text-white placeholder-white/70 px-0 py-2 focus:outline-none focus:border-blue-500"
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md">
          {replyingToId ? 'Responder' : 'Enviar comentario'}
        </button>
      </form>

      <div className="mt-10 space-y-4">
        {comentarios.length === 0 && <p className="text-center text-white/70">No hay comentarios aún</p>}

        {comentarios.map(c => (
          <div key={c.id} className="p-4 bg-white/5 rounded-lg shadow-lg">
            <p className="font-semibold text-blue-500">{c.username}</p>
            <p className="whitespace-pre-line">{linkify(c.content)}</p>

            {c.replies.length > 0 && (
              <button
                className="text-sm font-bold text-blue-400 mt-2 cursor-pointer"
                onClick={() => setMostrarRespuestas(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
              >
                {mostrarRespuestas[c.id] ? 'Ocultar respuestas' : `Ver respuestas (${c.replies.length})`}
              </button>
            )}

            {mostrarRespuestas[c.id] && (
              <div className="mt-2 pl-6 border-l-2 border-white/30 space-y-2">
                {c.replies.map(r => (
                  <div key={r.id} className="p-2  rounded">
                    <p className="font-semibold text-blue-400">{r.username}</p>
                    <p className="whitespace-pre-line">{linkify(r.content)}</p>
                  </div>
                ))}
              </div>
            )}

            {!replyingToId && (
              <button
                onClick={() => setReplyingToId(c.id)}
                className="text-sm text-blue-500 mt-4 ml-5 font-bold cursor-pointer"
              >
                Responder
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
