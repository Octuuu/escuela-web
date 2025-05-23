import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProyectosList() {
  const [proyectos, setProyectos] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    async function cargarProyectos() {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error cargando proyectos:', error);
      } else {
        setProyectos(data);
      }
    }
    cargarProyectos();
  }, []);

  const proyectosVisibles = mostrarTodos ? proyectos : proyectos.slice(0, 8);

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-6">
        {proyectosVisibles.map((p) => (
          <div
            key={p.id}
            className="bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-white/10 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-6 flex flex-col justify-between items-center text-center max-h-[550px]"
          >
            <div className="w-full flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{p.title}</h2>

              <div className="relative w-full mb-4 max-h-32 overflow-y-auto text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words px-1">
  {p.description}
</div>


              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="rounded-xl mb-4 w-full object-cover h-48 shadow-md"
                  loading="lazy"
                />
              )}
            </div>

            {p.pdf_url && (
              <div className="mt-2">
                <a
                  href={p.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-full transition"
                >
                  {p.pdf_url.endsWith('.pdf')
                    ? 'Ver PDF'
                    : p.pdf_url.endsWith('.doc') || p.pdf_url.endsWith('.docx')
                    ? 'Descargar Word'
                    : 'Descargar Archivo'}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {proyectos.length > 8 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-300"
          >
            {mostrarTodos ? 'Ver menos' : 'Ver más'}
          </button>
        </div>
      )}
    </>
  );
}
