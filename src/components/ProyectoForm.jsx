import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function sanitizeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // eliminar tildes y acentos
    .replace(/\s+/g, "_")            // espacios por guion bajo
    .replace(/[^a-zA-Z0-9._-]/g, "") // caracteres inválidos
    .toLowerCase();
}

export default function ProyectoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mensajeClass, setMensajeClass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setMensajeClass("");

    if (!title.trim() || !description.trim() || !imageFile || !pdfFile) {
      setMensaje("Por favor completa todos los campos y selecciona los archivos.");
      setMensajeClass("text-red-600 dark:text-red-400");
      return;
    }

    try {
      // Sanitizar nombres de archivo
      const sanitizedImageName = sanitizeFileName(imageFile.name);
      const imagePath = `images/${Date.now()}_${sanitizedImageName}`;

      // Subir imagen
      const { data: imageData, error: imageError } = await supabase.storage
        .from("proyectos")
        .upload(imagePath, imageFile, { upsert: false });

      if (imageError) {
        throw imageError;
      }

      const sanitizedPdfName = sanitizeFileName(pdfFile.name);
      const pdfPath = `pdfs/${Date.now()}_${sanitizedPdfName}`;

      // Subir PDF
      const { data: pdfData, error: pdfError } = await supabase.storage
        .from("proyectos")
        .upload(pdfPath, pdfFile, { upsert: false });

      if (pdfError) {
        throw pdfError;
      }

      // Obtener URLs públicas correctamente
      const { data: imageUrlData, error: imageUrlError } = supabase.storage
        .from("proyectos")
        .getPublicUrl(imagePath);

      if (imageUrlError) {
        throw imageUrlError;
      }
      const imageUrl = imageUrlData.publicUrl;

      const { data: pdfUrlData, error: pdfUrlError } = supabase.storage
        .from("proyectos")
        .getPublicUrl(pdfPath);

      if (pdfUrlError) {
        throw pdfUrlError;
      }
      const pdfUrl = pdfUrlData.publicUrl;

      if (!imageUrl || !pdfUrl) {
        throw new Error("No se pudo obtener la URL pública para uno o ambos archivos. Verifica la configuración del bucket en Supabase.");
      }

      // Insertar datos en tabla proyectos
      const { data, error } = await supabase
        .from("proyectos")
        .insert([{ title, description, image_url: imageUrl, pdf_url: pdfUrl }]);

      if (error) {
        throw error;
      }

      setMensaje("Proyecto subido correctamente!");
      setMensajeClass("text-green-600 dark:text-green-400");

      // Limpiar formulario
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPdfFile(null);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMensaje("❌ Error al subir el proyecto: " + error.message);
      setMensajeClass("text-red-600 dark:text-red-400");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-8 mb-16 space-y-6 max-w-2xl mx-auto text-black dark:text-white transition-all"
      encType="multipart/form-data"
      autoComplete="on"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">
        Subir un Proyecto
      </h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="title">
          Título del proyecto
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Ingrese el título del proyecto..."
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder-gray-500 dark:placeholder-white/60"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe tu proyecto"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder-gray-500 dark:placeholder-white/60"
        ></textarea>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" htmlFor="image">
          Imagen del proyecto
        </label>
        <label
          htmlFor="image"
          className="block w-full px-4 py-3 text-center text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-200 dark:bg-blue-900 dark:border-blue-700 dark:text-white dark:hover:bg-blue-800 transition"
        >
          Seleccionar imagen
        </label>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          required
          className="sr-only"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <p className="text-xs text-gray-500 dark:text-white/50">
          Formatos aceptados: JPG, PNG, etc
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" htmlFor="pdf">
          Archivo del proyecto
        </label>
        <label
          htmlFor="pdf"
          className="block w-full px-4 py-3 text-center text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-200 dark:bg-indigo-900 dark:border-indigo-700 dark:text-white dark:hover:bg-indigo-800 transition"
        >
          Seleccionar PDF
        </label>
        <input
          id="pdf"
          type="file"
          name="pdf"
          accept=".pdf,.doc,.docx"
          required
          className="w-full text-sm text-gray-500 dark:text-white"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />
        <p className="text-xs text-gray-500 dark:text-white/50">
          Archivos PDF, docx, etc (máx. 5MB)
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-transform"
      >
        Subir Proyecto
      </button>

      <div className={`mt-4 text-center text-sm font-medium ${mensajeClass}`}>
        {mensaje}
      </div>
    </form>
  );
}
