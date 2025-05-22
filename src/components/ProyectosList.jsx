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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proyectosVisibles.map((p) => (
          <div
            key={p.id}
            className="bg-white/80 border border-gray-200 backdrop-blur-md shadow-lg rounded-2xl p-6 text-black dark:bg-white/10 dark:border-white/10 dark:text-white transition"
          >
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <p className="mb-4">{p.description}</p>

            {/* Imagen */}
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.title}
                className="rounded-lg mb-4 mx-auto object-cover max-h-80 w-full"
                loading="lazy"
              />
            )}

            {/* PDF o archivo adjunto */}
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
          </div>
        ))}
      </div>

      {/* Botón para ver más o menos */}
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
    </>
  );
}
