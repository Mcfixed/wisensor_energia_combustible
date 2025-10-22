// InfoPopup.jsx
import React from 'react';

/**
 * Un componente modal simple.
 * @param {boolean} show - Si se debe mostrar el modal.
 * @param {function} onClose - Función que se llama al cerrar el modal.
 * @param {string} title - El título del modal.
 * @param {React.ReactNode} children - El contenido HTML a mostrar (tu "id").
 */
export const InfoPopup = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }

  return (
    // Fondo oscuro (overlay)
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose} // Cierra el modal si se hace clic en el fondo
    >
      {/* Contenedor del Modal */}
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-11/12 max-w-sm"
        onClick={e => e.stopPropagation()} // Evita que el clic en el modal se propague al fondo
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title || 'Información'}</h3>
          <button
            className="text-gray-500 hover:text-gray-900 text-2xl font-bold leading-none"
            onClick={onClose}
            title="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Contenido (Aquí va tu HTML) */}
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};