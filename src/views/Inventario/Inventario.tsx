import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Package,
  Eye,
  Search,
  Minus,
  ArrowLeftRight,
  Battery,
  Shield,
  Cloud,
  Bell,
  AlertCircle,
} from "lucide-react";
import { Registro, FormData } from "../../assets/types/Inventario";
import Generalinv from "./sections/Generalinv";
import { Asignados } from "./sections/Asignados";
import Noasignados from "./sections/Noasignados";
import Inspecciones from "./sections/Inspecciones";
export const Inventario = () => {
  const [registros, setRegistros] = useState<Registro[]>([
    { id: 1, nombre: "Alao", estado: "Activo" },
    { id: 2, nombre: "Puduguapi", estado: "Activo" },
    { id: 3, nombre: "Quenac", estado: "Inactivo" },
    { id: 4, nombre: "Puduguapi2", estado: "Activo" },
    { id: 5, nombre: "Quenac2", estado: "Inactivo" },
    { id: 3, nombre: "Quenac2", estado: "Inactivo" },
    { id: 4, nombre: "Puduguapi", estado: "Activo" },
    { id: 5, nombre: "Quenac", estado: "Inactivo" },
  ]);
  // const [activeTab, setActiveTab] = useState(0);
   const [activeTabinv, setActiveTabinv] = useState(0);
  const tabs = [
    { id: 0, label: "Pasillos", content: "Contenido Inventario asignado" },
    { id: 1, label: "Pasadores", content: "Contenido Inventario asignado" },
    { id: 2, label: "Boyas", content: "Contenido Inventario asignado" },
    { id: 3, label: "lineas fondeo", content: "Contenido Inventario asignado" },
  ];

  //inventario
  const tabsInv = [
    {
      id: 0,
      label: "Estado general Inventario",
      content: "Contenido Inventario general por centro",
    },
    {
      id: 1,
      label: "Inventario asignado detalle",
      content: "Contenido Inventario asignado detalle",
    },
    {
      id: 2,
      label: "Inventario Bodega SA",
      content: "Contenido Inventario Bodega SA",
    }
    ,
    {
      id: 3,
      label: "Inspecciones",
      content: "Contenido inspecciones",
    },
  ];

  //const [modalArtefacto, setModalArtefacto] = useState(false);
  const [modalArrendar, setModalArrendar] = useState(false);
  const [modaldardeBaja, setModalDardeBaja] = useState(false);
  const [modalTraslado, setModalTraslado] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false);

  const [modalEdicion, setModalEdicion] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    nombre: "",
    estado: "Activo",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const abrirModalArtefacto = () => {
  //   setFormData({
  //     id: "",
  //     nombre: "",
  //     estado: "Activo",
  //   });
  //   setModalArtefacto(true);
  // };
  const abrirModalArrendar = () => {
    setFormData({
      id: "",
      nombre: "",
      estado: "Activo",
    });
    setModalArrendar(true);
  };
  const abrirModalDardeBaja = () => {
    setFormData({
      id: "",
      nombre: "",
      estado: "Activo",
    });
    setModalDardeBaja(true);
  };
  const abrirModalTraslado = () => {
    setFormData({
      id: "",
      nombre: "",
      estado: "Activo",
    });
    setModalTraslado(true);
  };
  const abrirModalAgregar = () => {
    setFormData({
      id: "",
      nombre: "",
      estado: "Activo",
    });
    setModalAgregar(true);
  };

  return (
    <div className="p-4 h-full">
      <div className="w-full mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Gestión de Inventario
            </h1>
            <p className="text-gray-400 text-sm">
              Administra los productos del sistema
            </p>
          </div>
          <div className="flex gap-2">
  {/* Botones existentes */}
  <button
    onClick={abrirModalArrendar}
    className="bg-amber-300 hover:bg-amber-400 text-white px-4 py-2 flex items-center transition-colors cursor-pointer"
  >
    <ArrowLeftRight size={18} className="mr-2" />
    Arrendar
  </button>
  
  <button
    onClick={abrirModalDardeBaja}
    className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 flex items-center transition-colors cursor-pointer"
  >
    <Minus size={18} className="mr-2" />
    Dar de baja
  </button>
  
  <button
    onClick={abrirModalTraslado}
    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 flex items-center transition-colors cursor-pointer"
  >
    <ArrowLeftRight size={18} className="mr-2" />
    Traslado
  </button>
  
  <button
    onClick={abrirModalAgregar}
    className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 flex items-center transition-colors cursor-pointer"
  >
    <Plus size={18} className="mr-2" />
    Agregar
  </button>

   <div 
    className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center"
  >
    <AlertCircle size={20} className="mr-2" />
  </div>
</div>
        </div>
        {/* tabbbbb */}
        {/* activeTabinv, setActiveTabinv */}
        <div className="flex flex-col h-full">
          {/* Barra de pestañas */}
          <div className="flex border-b border-gray-700">
            {tabsInv.map((tab) => (
  <button
    key={tab.id}
    onClick={() => setActiveTabinv(tab.id)}
    className={`px-4 py-3 text-sm font-medium flex-1 text-center transition-all duration-200 cursor-pointer ${
      activeTabinv === tab.id
        ? "text-white bg-emerald-500/20 border-b-2 border-emerald-500 font-semibold"
        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
    }`}
  >
    {tab.label}
  </button>
))}
          </div>

          {/* Contenido de pestañas */}
          <div className="flex-1 p-3 overflow-auto">
            <div className="text-gray-300 text-sm">
              {tabsInv.find((tab) => tab.id === activeTabinv)?.content}

              {activeTabinv === 0 && 
              (
                <Generalinv/>
                
              )}
              {activeTabinv === 1 && 
              (
                <Asignados/>

              )}
              {activeTabinv === 2 && 
              (
                <Noasignados/>

              )}
              {activeTabinv === 3 && 
              (
                <Inspecciones/>

              )}
            </div>
          </div>
        </div>
        
        {/* componentizar!! */}
        
        {modalArrendar && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Arrendar elemento
                  </h2>
                  <button
                    onClick={() => setModalArrendar(false)}
                    className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      // value={formData.nombre}
                      // onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="estado"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Estado
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      // value={formData.estado}
                      // onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setModalArrendar(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors"
                    >
                      {modalEdicion ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {modaldardeBaja && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Dar de baja</h2>
                  <button
                    onClick={() => setModalDardeBaja(false)}
                    className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      // value={"ejemplo"}
                      // onChange={}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="estado"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Estado
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      // value={formData.estado}
                      // onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setModalDardeBaja(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors"
                    >
                      guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {modalTraslado && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Traslado</h2>
                  <button
                    onClick={() => setModalTraslado(false)}
                    className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      // value={"ejemplo"}
                      // onChange={}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="estado"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Estado
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      // value={formData.estado}
                      // onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setModalTraslado(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors"
                    >
                      guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {modalAgregar && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Agregar</h2>
                  <button
                    onClick={() => setModalAgregar(false)}
                    className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      // value={"ejemplo"}
                      // onChange={}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="estado"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Estado
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      // value={formData.estado}
                      // onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setModalAgregar(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors"
                    >
                      guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
