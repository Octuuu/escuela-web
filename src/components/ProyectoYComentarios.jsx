import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProyectoYComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [mensajeComentario, setMensajeComentario] = useState('');
  const [mensajeProyecto, setMensajeProyecto] = useState('');
  const [proyectoIdAEliminar, setProyectoIdAEliminar] = useState(null);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    const fetchComentarios = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('id', { ascending: false });
      if (!error) setComentarios(data);
    };

    const fetchProyectos = async () => {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('id', { ascending: false });

      if (!error) {
        const proyectosConUrls = data.map((proyecto) => {
          const image_url = proyecto.image
            ? supabase.storage.from('proyectos').getPublicUrl(proyecto.image).data.publicUrl
            : null;

          const pdf_url = proyecto.pdf
            ? supabase.storage.from('proyectos').getPublicUrl(proyecto.pdf).data.publicUrl
            : null;

          return {
            ...proyecto,
            image_url,
            pdf_url,
          };
        });

        setProyectos(proyectosConUrls);
      }
    };

    fetchComentarios();
    fetchProyectos();
  }, []);

  const eliminarComentario = async (id) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      setComentarios((prev) => prev.filter((c) => c.id !== id));
      setMensajeComentario('Comentario eliminado correctamente.');
    } else {
      setMensajeComentario('Error al eliminar el comentario.');
    }
    setTimeout(() => setMensajeComentario(''), 4000);
  };

  const eliminarProyecto = async () => {
    if (!proyectoIdAEliminar) return;

    const { error } = await supabase.from('proyectos').delete().eq('id', proyectoIdAEliminar);
    if (!error) {
      setProyectos((prev) => prev.filter((p) => p.id !== proyectoIdAEliminar));
      setMensajeProyecto('Proyecto eliminado correctamente.');
    } else {
      setMensajeProyecto('Error al eliminar el proyecto.');
    }
    setProyectoIdAEliminar(null);
    setTimeout(() => setMensajeProyecto(''), 4000);
  };

  const proyectosVisibles = mostrarTodos ? proyectos : proyectos.slice(0, 8);

  return (
    <div className="text-white">
      {/* COMENTARIOS */}
      <section className="max-w-3xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-semibold text-center mb-8">Foro de Comentarios</h1>
        {mensajeComentario && (
          <div className="mb-6 px-4 py-3 rounded-lg text-center font-medium bg-green-100 text-green-800">
            {mensajeComentario}
          </div>
        )}
        <div className="space-y-6">
          {comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <div
                key={comentario.id}
                className="flex justify-between items-center bg-white/5 border border-white/10 backdrop-blur-lg p-4 rounded-lg shadow-xl"
              >
                <div>
                  <p className="text-white font-bold">{comentario.username}</p>
                  <p className="text-white/80">{comentario.content}</p>
                </div>
                <button
                  onClick={() => eliminarComentario(comentario.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-white/70">No hay comentarios aun</p>
          )}
        </div>
      </section>

      {/* PROYECTOS */}
      <section className="max-w-5xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Lista de Proyectos</h1>
        {mensajeProyecto && (
          <div className="mb-6 px-4 py-3 rounded-lg text-center font-medium bg-green-100 text-green-800">
            {mensajeProyecto}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proyectosVisibles.length > 0 ? (
            proyectosVisibles.map((p) => (
              <div
                key={p.id}
                className="bg-white/80 border border-gray-200 backdrop-blur-md shadow-lg rounded-2xl p-6 text-black dark:bg-white/10 dark:border-white/10 dark:text-white transition"
              >
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                <p className="mb-4">{p.description}</p>

                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="rounded-lg mb-4 mx-auto object-cover max-h-80 w-full"
                    loading="lazy"
                  />
                )}

                {p.pdf_url && (
                  <div className="flex justify-center mt-4">
                    <a
                      href={p.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                    >
                      {p.pdf_url.endsWith('.pdf')
                        ? 'Ver PDF'
                        : p.pdf_url.endsWith('.doc') || p.pdf_url.endsWith('.docx')
                        ? 'Descargar Word'
                        : 'Descargar Archivo'}
                    </a>
                  </div>
                )}

                <button
                  onClick={() => setProyectoIdAEliminar(p.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-700 transition font-semibold shadow"
                >
                  Eliminar proyecto
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No hay proyectos disponibles.</p>
          )}
        </div>

        {proyectos.length > 8 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setMostrarTodos(!mostrarTodos)}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold shadow"
            >
              {mostrarTodos ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        )}

        {/* Modal de confirmación para eliminar proyecto */}
        {proyectoIdAEliminar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
                ¿Eliminar proyecto?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setProyectoIdAEliminar(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarProyecto}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProyectoYComentarios;
