import { useEffect, useState } from 'react';

const ProyectoYComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [mensajeComentario, setMensajeComentario] = useState('');
  const [mensajeProyecto, setMensajeProyecto] = useState('');
  const [proyectoIdAEliminar, setProyectoIdAEliminar] = useState(null);

  useEffect(() => {
    fetch('https://ifd-backend-production.up.railway.app/api/comments/inicio')
      .then((res) => res.json())
      .then(setComentarios)
      .catch(() => console.error('Error al obtener comentarios'));

    fetch('https://ifd-backend-production.up.railway.app/api/proyectos')
      .then((res) => res.json())
      .then(setProyectos)
      .catch(() => console.error('Error al obtener proyectos'));
  }, []);

  const eliminarComentario = async (id) => {
    try {
      const res = await fetch(`https://ifd-backend-production.up.railway.app/api/comments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setComentarios((prev) => prev.filter((c) => c.id !== id));
        setMensajeComentario('Comentario eliminado correctamente.');
      } else {
        setMensajeComentario('Error al eliminar el comentario.');
      }
    } catch {
      setMensajeComentario('Error de conexión.');
    }
    setTimeout(() => setMensajeComentario(''), 4000);
  };

  const eliminarProyecto = async () => {
    if (!proyectoIdAEliminar) return;
    try {
      const res = await fetch(`https://ifd-backend-production.up.railway.app/api/proyectos/${proyectoIdAEliminar}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProyectos((prev) => prev.filter((p) => p.id !== proyectoIdAEliminar));
        setMensajeProyecto('Proyecto eliminado correctamente.');
      } else {
        setMensajeProyecto('Error al eliminar el proyecto.');
      }
    } catch {
      setMensajeProyecto('Error de conexión.');
    }
    setProyectoIdAEliminar(null);
    setTimeout(() => setMensajeProyecto(''), 4000);
  };

  return (
    <div className="text-white">
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
            <p className="text-center text-white/70">No hay comentarios aún.</p>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Lista de Proyectos</h1>
        {mensajeProyecto && (
          <div className="mb-6 px-4 py-3 rounded-lg text-center font-medium bg-green-100 text-green-800">
            {mensajeProyecto}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {proyectos.length > 0 ? (
            proyectos.map((proyecto) => (
              <div
                key={proyecto.id}
                className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl relative"
              >
                <img
                  src={`https://ifd-backend-production.up.railway.app/uploads/${proyecto.image}`}
                  alt={proyecto.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{proyecto.title}</h2>
                <p className="text-white/80 mb-3">{proyecto.description}</p>
                <a
                  href={`https://ifd-backend-production.up.railway.app/uploads/${proyecto.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm block mb-2"
                >
                  Ver PDF
                </a>
                <button
                  onClick={() => setProyectoIdAEliminar(proyecto.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Eliminar proyecto
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No hay proyectos disponibles.</p>
          )}
        </div>

        {/* Modal */}
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
